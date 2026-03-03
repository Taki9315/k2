'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Shield, Building2, Phone, Mail, User } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading, profile, isCertifiedBorrower, isKitBuyer, isBasicBorrower, isPartner, isAdmin, userRole, refreshProfile } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Populate form from profile
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
      setCompany(profile.company || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      if (!user) throw new Error('No user found');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone || null,
          company: company || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Refresh the AuthContext profile so the nav updates immediately
      await refreshProfile();
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const roleBadge = () => {
    if (isAdmin)
      return <Badge variant="outline" className="gap-1"><Shield className="h-3 w-3" />Admin</Badge>;
    if (isCertifiedBorrower)
      return <Badge className="bg-primary/10 text-primary border-primary/20 gap-1"><Shield className="h-3 w-3" />Certified Borrower</Badge>;
    if (isPartner)
      return <Badge variant="secondary" className="gap-1"><Building2 className="h-3 w-3" />{userRole === 'lender' ? 'Lender' : 'Vendor'}</Badge>;
    if (isKitBuyer)
      return <Badge variant="secondary">Kit Owner</Badge>;
    return <Badge variant="secondary">Borrower</Badge>;
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          {roleBadge()}
        </div>

        <div className="space-y-6">
          {/* Account status card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Account Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Account Type</p>
                  <p className="font-medium text-gray-900 capitalize">{userRole}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className="font-medium text-gray-900 capitalize">{profile?.status || 'active'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : '—'}
                  </p>
                </div>
              </div>
              {isCertifiedBorrower && profile?.certified_at && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="text-gray-500">
                    Certified on{' '}
                    <span className="font-medium text-gray-900">
                      {new Date(profile.certified_at).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Editable profile card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {success && (
                  <Alert>
                    <AlertDescription>
                      Profile updated successfully!
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-sm text-gray-500">
                    Email cannot be changed. Contact support for assistance.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> Phone
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" /> Company
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Acme LLC"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Need help?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact our support team for assistance with your account.
                </p>
                <Button variant="outline" asChild>
                  <a href="/contact">Contact Support</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
