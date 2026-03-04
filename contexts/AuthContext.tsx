'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export type UserRole = 'borrower' | 'certified' | 'lender' | 'vendor' | 'admin';

export type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  status: string;
  preferred: boolean;
  phone: string | null;
  company: string | null;
  workbook_purchased: boolean;
  certified_at: string | null;
  referral_code: string | null;
  membership_number: string | null;
};

type AuthContextType = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    company?: string
  ) => Promise<void>;
  signOut: () => Promise<void>;
  /** @deprecated Use isCertifiedBorrower instead */
  hasMembership: boolean;
  checkMembership: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Convenience role helpers
  fullName: string;
  isCertifiedBorrower: boolean;
  isKitBuyer: boolean;
  isBasicBorrower: boolean;
  isPartner: boolean;
  isAdmin: boolean;
  userRole: UserRole;
  membershipNumber: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasMembership, setHasMembership] = useState(false);
  // Guard against double-init in StrictMode / fast remounts
  const initRef = useRef(false);

  const fetchProfile = useCallback(async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (!error && data) {
        setProfile(data as UserProfile);
        return data as UserProfile;
      }
    } catch {
      // Profile table might not exist yet
    }
    return null;
  }, []);

  const checkMembership = useCallback(async (uid?: string) => {
    const userId = uid;
    if (!userId) {
      setHasMembership(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

      setHasMembership(!!data && !error);
    } catch {
      setHasMembership(false);
    }
  }, []);

  // Initialize auth — runs once
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      const u = session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) {
        checkMembership(u.id);
        fetchProfile(u.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        const u = session?.user ?? null;
        setUser(u);
        if (u) {
          checkMembership(u.id);
          fetchProfile(u.id);
        } else {
          setHasMembership(false);
          setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [checkMembership, fetchProfile]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
    company?: string
  ) => {
    const role = 'borrower';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });
    if (error) throw error;

    console.log('Sign-up successful, user:', data.user);

    if (data.user) {
      try {
        const res = await fetch('/api/auth/create-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.user.id,
            email,
            full_name: fullName,
            role,
            phone: phone || null,
            company: company || null,
          }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.error('Error creating profile:', body);
        }
      } catch (err) {
        console.error('Error creating profile:', err);
      }
    }
  }, []);

  const signOut = useCallback(async () => {
    // Notify admin about logout (fire-and-forget)
    if (user) {
      fetch('/api/admin/notifications/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'logout',
          title: 'User signed out',
          message: profile?.email || user.email,
          user_id: user.id,
          user_name: profile?.full_name || null,
          user_email: profile?.email || user.email || null,
        }),
      }).catch(() => {});
    }
    await supabase.auth.signOut();
    setProfile(null);
  }, [user, profile]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  // Derived role helpers
  const userRole: UserRole = profile?.role || 'borrower';
  const isCertifiedBorrower = userRole === 'certified' || (userRole === 'borrower' && profile?.preferred === true);
  const isKitBuyer = !isCertifiedBorrower && userRole === 'borrower' && profile?.workbook_purchased === true;
  const isBasicBorrower = !isCertifiedBorrower && userRole === 'borrower' && !profile?.workbook_purchased;
  const isPartner = userRole === 'lender' || userRole === 'vendor';
  const isAdmin = userRole === 'admin';
  const fullName = profile?.full_name || user?.user_metadata?.full_name || '';
  const membershipNumber = profile?.membership_number || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        hasMembership: hasMembership || isCertifiedBorrower,
        checkMembership: () => checkMembership(user?.id),
        refreshProfile,
        fullName,
        isCertifiedBorrower,
        isKitBuyer,
        isBasicBorrower,
        isPartner,
        isAdmin,
        userRole,
        membershipNumber,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
