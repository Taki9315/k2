'use client';

import { useState } from 'react';
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
  Wrench,
  CheckCircle2,
  Handshake,
  Target,
  BarChart3,
  ArrowRight,
  Send,
  ShieldCheck,
} from 'lucide-react';

/* ── Service types dropdown ──────────────────────────────────────────── */
const SERVICE_TYPES = [
  { value: '', label: 'Select service type...' },
  { value: 'appraisal', label: 'Appraisal' },
  { value: 'environmental', label: 'Environmental Consulting' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'legal', label: 'Legal / Attorney' },
  { value: 'title', label: 'Title Services' },
  { value: 'construction_mgmt', label: 'Construction Management' },
  { value: 'property_inspection', label: 'Property Inspection' },
  { value: 'property_mgmt', label: 'Property Management' },
  { value: 'accounting', label: 'Accounting / CPA' },
  { value: 'architecture', label: 'Architecture / Engineering' },
  { value: 'surveying', label: 'Surveying' },
  { value: 'other', label: 'Other' },
];

/* ── Benefit highlights ──────────────────────────────────────────────── */
const HIGHLIGHTS = [
  {
    icon: Target,
    title: 'Qualified, Active Referrals',
    text: 'Connect with K2 certified borrowers and commercial property investors who are actively transacting and need your services — not cold leads, but warm introductions.',
  },
  {
    icon: Handshake,
    title: 'White-Glove Partnership',
    text: 'As a K2 Preferred Vendor, you commit to priority service and dedicated attention for our certified borrowers — building trust and long-term relationships.',
  },
  {
    icon: BarChart3,
    title: 'Grow Your Pipeline',
    text: 'Gain steady, high-quality deal flow through the K2 ecosystem. Your services are showcased to borrowers at the point of need — when decisions are being made.',
  },
];

/* ── Vendor commitments ──────────────────────────────────────────────── */
const COMMITMENTS = [
  'Provide dedicated point-of-contact for every K2 certified borrower referral',
  'Deliver priority turnaround times on engagements sourced through K2',
  'Maintain transparent pricing and clear scope of work upfront',
  'Communicate proactively throughout the engagement lifecycle',
  'Treat K2 certified borrowers as a high priority in your service queue',
];

export default function PreferredVendorPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    serviceAreas: '',
    message: '',
  });
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

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
    if (!formData.serviceType) {
      setError('Please select your service type.');
      return;
    }
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      /* Save to the dedicated vendor_inquiries table */
      const { error: submitError } = await supabase
        .from('vendor_inquiries')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company,
          service_type: formData.serviceType,
          service_areas: formData.serviceAreas || null,
          message: formData.message || null,
        });

      if (submitError) throw submitError;

      /* Queue admin notification */
      try {
        await fetch('/api/inquiry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'vendor',
            name: `${formData.firstName} ${formData.lastName}`,
            company: formData.company,
            email: formData.email,
            serviceType: formData.serviceType,
          }),
        });
      } catch {
        /* non-blocking — inquiry was already saved */
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        serviceType: '',
        serviceAreas: '',
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
            <Wrench className="h-4 w-4" />
            Preferred Vendor Network
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Join the K2 CRE Preferred Vendor Network
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We&apos;re building a dream team of vendors committed to providing
            white-glove service — including a dedicated point of contact — to
            our certified borrowers. If your firm delivers exceptional service
            and wants access to qualified, transacting clients, we want to
            hear from you.
          </p>
        </div>
      </section>

      {/* ── Highlights ────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Vendors Join the K2 Network
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our certified borrowers need trusted service providers. Position
              your firm in front of decision-makers who are ready to act.
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

      {/* ── Vendor Commitments + Inquiry Form ─────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: overview & commitments */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                How It Works
              </h2>
              <p className="text-gray-600 leading-relaxed">
                K2 Commercial Finance works with commercial real estate borrowers
                and investors at every stage of the transaction. From attorneys
                and appraisers to environmental consultants and property managers
                — our certified borrowers need the services you provide.
              </p>

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-gray-900">
                  Preferred Vendor Commitments
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
                full Preferred Vendor program description with complete details
                on referral structure, listing placement, and partnership terms.
              </p>

              <div className="rounded-xl border-2 border-primary/20 bg-white p-6 mt-4">
                <div className="flex items-center gap-4 mb-3">
                  <Image
                    src="/assets/Network_Logo.png"
                    alt="K2 Preferred Network"
                    width={160}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Approved vendors receive full access to the Preferred Vendor
                  portal including referral details, listing placement, and
                  direct communication with the K2 team.
                </p>
              </div>
            </div>

            {/* Right: Inquiry form */}
            <div>
              <Card className="border-2 shadow-lg">
                <CardContent className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Vendor Inquiry Form
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Submit your inquiry and a K2 representative will follow up
                    with full program details.
                  </p>

                  {success ? (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
                      <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 mb-3" />
                      <h4 className="text-lg font-semibold text-green-800 mb-1">
                        Inquiry Received
                      </h4>
                      <p className="text-sm text-green-700">
                        Thank you for your interest in the K2 Preferred Vendor
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
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="serviceType">Service Type *</Label>
                        <select
                          id="serviceType"
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                          {SERVICE_TYPES.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="serviceAreas">
                          Service Areas (states / regions)
                        </Label>
                        <Input
                          id="serviceAreas"
                          name="serviceAreas"
                          placeholder="e.g. NY, NJ, CT or Nationwide"
                          value={formData.serviceAreas}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={3}
                          placeholder="Tell us about your services, specialties, and experience..."
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
                q: 'What types of vendors can join the Preferred Vendor network?',
                a: 'We welcome appraisers, environmental consultants, insurance providers, attorneys, title companies, construction managers, property inspectors, property managers, accountants, and other professionals that serve commercial real estate transactions.',
              },
              {
                q: 'What commitment is required?',
                a: 'Preferred Vendors agree to provide a dedicated point of contact, deliver priority turnaround times, maintain transparent pricing, and treat K2 certified borrowers as a high priority in their service queue.',
              },
              {
                q: 'How are vendors matched with clients?',
                a: 'We match vendors based on service category, geography, deal type, and track record. Our goal is to connect you with certified borrowers where your expertise is the best fit.',
              },
              {
                q: 'What happens after I submit my inquiry?',
                a: 'A K2 representative will review your submission and send you a link to the full Preferred Vendor program description with complete details on referral structure, listing placement, and partnership terms.',
              },
              {
                q: 'Is there a cost to become a Preferred Vendor?',
                a: 'Program terms, including any associated fees, are shared after your inquiry is approved. Contact us to learn about the current partnership terms.',
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
            Not a Vendor? Explore Other Programs
          </h2>
          <p className="text-slate-300 mb-8">
            Whether you&apos;re a borrower looking to get funded or a lender
            looking for qualified deal flow, K2 has a program for you.
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
              <Link href="/membership/preferred-lender">
                Lender Network
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
