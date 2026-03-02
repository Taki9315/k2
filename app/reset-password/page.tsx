'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { CheckCircle2 } from 'lucide-react';

const AUTH_SIDE_IMAGE =
  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1920&q=80";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase processes the recovery token from the URL hash automatically
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') {
          setReady(true);
        }
      }
    );

    // Also check if user is already in a session (token already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      // Redirect to dashboard after a brief delay
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white lg:grid lg:grid-cols-[75%_25%]">
      <section
        className="relative hidden min-h-[calc(100vh-13rem)] lg:flex items-center bg-neutral-800 px-16"
        style={{
          backgroundImage: `linear-gradient(rgba(23, 23, 23, 0.72), rgba(23, 23, 23, 0.72)), url('${AUTH_SIDE_IMAGE}')`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="max-w-lg text-white">
          <p className="text-4xl font-semibold leading-tight">
            K2 Commercial Finance — Your CRE Financing Partner
          </p>
          <div className="mt-6 h-0.5 w-32 bg-emerald-400" />
          <p className="mt-6 text-base text-white/80">
            Set a new password for your K2 account.
          </p>
        </div>
      </section>

      <section className="relative min-h-[calc(100vh-13rem)] bg-white px-6 py-10 shadow-xl sm:px-8">
        <div className="absolute inset-x-0 top-8 z-10 flex justify-center">
          <div className="flex flex-col items-center">
            <Link href="/" className="inline-flex">
              <Image
                src="/assets/brand.jpg"
                alt="K2 Commercial Finance"
                width={160}
                height={48}
                className="h-auto w-60"
                priority
              />
            </Link>
            <p className="mt-3 text-center text-xs font-semibold tracking-[0.2em] text-neutral-500">
              MEMBER PORTAL
            </p>
          </div>
        </div>

        <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center">
          <div className="w-full max-w-sm">
            {success ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                  Password updated!
                </h1>
                <p className="text-sm text-neutral-500 mb-6">
                  Your password has been changed. Redirecting to your
                  dashboard...
                </p>
              </div>
            ) : !ready ? (
              <div className="text-center">
                <p className="text-sm text-neutral-500">
                  Processing your reset link...
                </p>
              </div>
            ) : (
              <>
                <div className="mt-8">
                  <h1 className="text-center text-xl font-semibold text-neutral-900">
                    Set a new password
                  </h1>
                  <p className="mt-2 text-center text-sm text-neutral-500">
                    Choose a new password for your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs text-neutral-600">
                      New Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-neutral-500">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-xs text-neutral-600"
                    >
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
