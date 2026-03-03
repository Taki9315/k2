'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface CheckoutButtonProps {
  product: 'kit' | 'certified';
  referralCode?: string;
  label?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  children?: React.ReactNode;
}

export function CheckoutButton({
  product,
  referralCode,
  label,
  className,
  variant = 'default',
  size = 'lg',
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Kit purchases can proceed without authentication (guest checkout)
      // Certified purchases still require login
      if (!session?.access_token && product !== 'kit') {
        window.location.href = `/login?redirect=/membership/${product === 'certified' ? 'certified-borrower' : ''}`;
        return;
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({ product, referralCode }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const defaultLabel =
    product === 'certified' ? 'Enroll Now — $250' : 'Get Success Kit — $15';

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Redirecting to checkout…
        </>
      ) : (
        children || label || defaultLabel
      )}
    </Button>
  );
}
