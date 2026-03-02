'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const AUTH_SIDE_IMAGE =
  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1920&q=80";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
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
            Reset your password to regain access to your K2 account, PrepCoach
            templates, and partner network.
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
            {sent ? (
              <div className="text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary mb-4" />
                <h1 className="text-xl font-semibold text-neutral-900 mb-2">
                  Check your email
                </h1>
                <p className="text-sm text-neutral-500 mb-6">
                  We sent a password reset link to <strong>{email}</strong>.
                  Follow the link to set a new password.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="mt-8">
                  <h1 className="text-center text-xl font-semibold text-neutral-900">
                    Reset your password
                  </h1>
                  <p className="mt-2 text-center text-sm text-neutral-500">
                    Enter the email address associated with your account and
                    we&apos;ll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs text-neutral-600">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-neutral-300 text-neutral-700"
                    asChild
                  >
                    <Link href="/login">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Sign In
                    </Link>
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
