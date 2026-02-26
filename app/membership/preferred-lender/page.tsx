'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { PuzzleCaptcha } from '@/components/PuzzleCaptcha';
import { supabase } from '@/lib/supabase';
import {
  Building2,
  CheckCircle2,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Send,
  Star,
  Handshake,
  BadgeCheck,
} from 'lucide-react';

/* ── Lender types for the dropdown ────────────────────────────────────── */
const LENDER_TYPES = [
  { value: '', label: 'Select lender type...' },
  { value: 'bank', label: 'Bank' },
  { value: 'credit_union', label: 'Credit Union' },
  { value: 'cdfi', label: 'CDFI' },
  { value: 'sba_lender', label: 'SBA Lender' },
  { value: 'private_lender', label: 'Private / Direct Lender' },
  { value: 'hard_money', label: 'Hard Money Lender' },
  { value: 'bridge_lender', label: 'Bridge Lender' },
  { value: 'life_company', label: 'Life Company' },
  { value: 'agency', label: 'Agency Lender' },
  { value: 'other', label: 'Other' },
];

/* ── Benefits for the highlight cards ─────────────────────────────────── */
const HIGHLIGHTS = [
  {
    icon: Users,
    title: 'Pre-Qualified Certified Borrowers',
    text: 'Every borrower in our pipeline has completed the K2 Financing Success Kit - educated, documented, and ready to transact with a lender who treats them as a priority.',
  },
  {
    icon: TrendingUp,
    title: 'Structured, Quality Deal Flow',
    text: 'Receive borrower packages matched to your lending criteria. Each submission includes a Transaction Executive Summary - reducing noise and increasing close rates.',
  },
  {
    icon: Shield,
    title: 'White-Glove Commitment',
    text: 'K2 Preferred Lenders commit to providing dedicated account representation and high-priority service to every certified borrower in the network.',
  },
];

/* ── Lender commitments for the borrower-focused section ──────────────── */
const COMMITMENTS = [
  'Assign a dedicated account representative to every K2 certified borrower',
  'Respond to borrower submissions within 48 hours',
  'Provide transparent term sheets with clear pricing and conditions',
  'Maintain ongoing communication throughout the underwriting process',
  'Treat K2 certified borrowers as a high priority in your pipeline',
];

export default function PreferredLenderPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    lenderType: '',
    lendingFocus: '',
    message: '',
  });
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaPassed) {
      setError('Please complete the puzzle verification first.');
      return;
    }
    if (!formData.lenderType) {
      setError('Please select your lender type.');
      return;
    }
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      /* Save to the dedicated lender_inquiries table */
      const { error: submitError } = await supabase
        .from('lender_inquiries')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company,
          lender_type: formData.lenderType,
          lending_focus: formData.lendingFocus || null,
          message: formData.message || null,
        });

      if (submitError) throw submitError;

      /* Queue admin notification */
      try {
        await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'lender',
            name: `${formData.firstName} ${formData.lastName}`,
            company: formData.company,
            email: formData.email,
            lenderType: formData.lenderType,
          }),
        });
      } catch {
        /* non-blocking - inquiry was already saved */
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        lenderType: '',
        lendingFocus: '',
        message: '',
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to submit inquiry'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 md:py-28 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6">
            <Building2 className="h-4 w-4" />
            Direct Lenders Only
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Join the K2 Preferred Lender Network
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We&apos;re building a dream team of direct lenders willing to provide
            white-glove service - including a dedicated account representative -
            to our certified borrowers. If your institution is ready to commit
            to making K2 borrowers a high priority, we want to hear from you.
          </p>
        </div>
      </section>

      {/* ── Highlights ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Lenders Join the K2 Network
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We do the heavy lifting on borrower preparation so you can focus
              on what you do best - funding deals with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HIGHLIGHTS.map((h) => (
              <Card
                key={h.title}
                className="border-2 hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-8 pb-6 px-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <h.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {h.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {h.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Lender Commitment + Inquiry Form ──────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: overview & commitments */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How It Works
              </h2>
              <p className="text-gray-600 leading-relaxed">
                K2 Commercial Finance educates and prepares borrowers through a
                structured Success Kit process before they ever reach your desk.
                Each certified borrower completes our Financing Success
                Kit, goes through a full intake, and receives a Transaction
                Executive Summary - so when you see a deal, it&apos;s already
                organized and underwriteable.
              </p>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Preferred Lender Commitments
                </h3>
                <ul className="space-y-3">
                  {COMMITMENTS.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-gray-500 italic">
                Once your inquiry is reviewed, we&apos;ll send you a link to the
                full Preferred Lender program description, including referral
                fee structure, borrower matching criteria, and portal access
                details.
              </p>

              <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-primary/5 via-white to-white p-5 mt-4 flex items-start gap-5 shadow-sm">
                <div className="shrink-0 rounded-lg bg-white p-2.5 shadow-sm border border-slate-100">
                  <Image
                    src="/assets/Lender_Logo.png"
                    alt="K2 Preferred Lender Network"
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <BadgeCheck className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-gray-900">K2 Preferred Lender</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Approved lenders receive full access to the Preferred Lender
                    portal including deal flow details, referral fee structure,
                    and direct communication with the K2 team.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Inquiry form */}
            <div>
              <Card className="border-2 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Lender Inquiry Form
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Submit your inquiry and a K2 representative will follow up
                    with full program details.
                  </p>

                  {!mounted ? (
                    <div className="space-y-4 py-4">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-10 rounded-md bg-slate-100 animate-pulse" />
                      ))}
                    </div>
                  ) : success ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                      <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 mb-3" />
                      <h4 className="text-lg font-semibold text-green-800 mb-1">
                        Inquiry Received
                      </h4>
                      <p className="text-sm text-green-700">
                        Thank you for your interest in the K2 Preferred Lender
                        Network. We&apos;ll review your inquiry and follow up
                        with the full program description shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="company">
                          Company / Institution *
                        </Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lenderType">Lender Type *</Label>
                        <select
                          id="lenderType"
                          name="lenderType"
                          value={formData.lenderType}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {LENDER_TYPES.map((lt) => (
                            <option key={lt.value} value={lt.value}>
                              {lt.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="lendingFocus">
                          Lending Focus (property types, loan size range)
                        </Label>
                        <Input
                          id="lendingFocus"
                          name="lendingFocus"
                          placeholder="e.g. Multifamily, MHP, $250K–$5M"
                          value={formData.lendingFocus}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={3}
                          placeholder="Tell us about your lending programs or any questions..."
                          value={formData.message}
                          onChange={handleChange}
                        />
                      </div>

                      <PuzzleCaptcha
                        onVerified={() => setCaptchaPassed(true)}
                      />

                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading || !captchaPassed}
                      >
                        {loading ? (
                          'Submitting...'
                        ) : (
                          <>
                            Submit Inquiry
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full text-white max-w-3xl mx-auto"
          >
            {[
              {
                q: 'What kind of borrowers will I receive?',
                a: 'Every borrower has purchased and completed the K2 Financing Success Kit. They arrive documented, educated, and with a Transaction Executive Summary - so you can evaluate deals faster with fewer back-and-forth requests.',
              },
              {
                q: 'Is this program for direct lenders only?',
                a: 'Yes. The K2 Preferred Lender Network is exclusively for direct lenders - banks, credit unions, CDFIs, SBA lenders, bridge lenders, and private/direct lending institutions. Brokers and correspondents are not eligible.',
              },
              {
                q: 'What commitment is required?',
                a: 'Preferred Lenders agree to assign a dedicated account representative, respond within 48 hours, provide transparent term sheets, and treat K2 certified borrowers as a high priority.',
              },
              {
                q: 'What happens after I submit my inquiry?',
                a: 'A K2 representative will review your submission and send you a link to the full Preferred Lender program description - similar to our LEV page - with complete details on referral fees, matching criteria, and portal access.',
              },
              {
                q: 'Is there a cost to join?',
                a: 'Program terms, including any associated fees or referral structures, are shared after your inquiry is approved. Contact us to learn about the current partnership terms.',
              },
            ].map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-white/20"
              >
                <AccordionTrigger className="text-left text-white hover:text-primary py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/75">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">
            Not a Lender? Explore Other Programs
          </h2>
          <p className="text-slate-300 mb-8">
            Whether you&apos;re a borrower looking to get funded or a vendor
            looking to grow your business, K2 has a program for you.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/membership/certified-borrower">
                Certified Borrower
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-slate-900"
            >
              <Link href="/membership/preferred-vendor">
                Vendor Network
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
