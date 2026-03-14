'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { StripePaymentDialog } from '@/components/StripePaymentDialog';

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [checking, setChecking] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    setChecking(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Certified purchases require login
      if (!session?.access_token && product !== 'kit') {
        window.location.href = `/login?redirect=/membership/${product === 'certified' ? 'certified-borrower' : ''}`;
        return;
      }

      // Open the embedded payment dialog
      setDialogOpen(true);
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setChecking(false);
    }
  };

  const handleSuccess = useCallback((paymentIntentId: string) => {
    // Redirect to success page after payment completes
    router.push(`/checkout/success?payment=elements&pi=${paymentIntentId}`);
  }, [router]);

  const defaultLabel =
    product === 'certified' ? 'Enroll Now — $250' : 'Get Success Kit — $15';

  return (
    <>
      <Button
        onClick={handleClick}
        disabled={checking}
        variant={variant}
        size={size}
        className={className}
      >
        {checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading…
          </>
        ) : (
          children || label || defaultLabel
        )}
      </Button>

      <StripePaymentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={product}
        referralCode={referralCode}
        onSuccess={handleSuccess}
      />
    </>
  );
}
