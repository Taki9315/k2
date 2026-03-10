'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  CheckCircle2,
  Shield,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Zap,
  BarChart3,
  Handshake,
  Play,
  ArrowRight,
  Globe,
  Bot,
  Upload,
  Video,
} from 'lucide-react';

/* ── Benefits ────────────────────────────────────────────────────────── */
const BENEFITS = [
  {
    icon: Globe,
    title: 'Custom Website Page',
    description:
      'Get your own dedicated page within the K2 preferred lender/vendor ecosystem — showcasing your firm, services, and contact info to every borrower.',
  },
  {
    icon: Bot,
    title: 'Prep Coach Priority Placement',
    description:
      'Our AI Prep Coach will always suggest your firm first before other options when guiding borrowers through their financing journey.',
  },
  {
    icon: Upload,
    title: 'Upload Documents & Video Intro',
    description:
      'Upload documents and a 2-minute video introduction to your firm — so borrowers can get to know you before they even reach out.',
  },
  {
    icon: DollarSign,
    title: 'Reseller Rights & Referral Revenue',
    description:
      'Customize and sell K2 Success Kits / Certified memberships. Earn $5 per Kit referral and $48 per Certified Borrower referral.',
  },
  {
    icon: Users,
    title: 'Direct Access to Qualified Borrowers',
    description:
      'Our Certified Borrowers come pre-screened, prepared, and lender-ready. No more wading through unqualified inquiries.',
  },
  {
    icon: BarChart3,
    title: 'Organized, Complete Packages',
    description:
      'Our PrepCoach AI guides borrowers through document preparation — so deal packages arrive clean, complete, and ready for review.',
  },
];

/* ── How it Works ──────────────────────────────────────────────────── */
const STEPS = [
  {
    num: '1',
    title: 'Apply for Partnership',
    description: 'Fill out the form below. Our team reviews every application to ensure quality.',
  },
  {
    num: '2',
    title: 'Get Your Profile Set Up',
    description: 'We create your dedicated partner page with your branding, services, and contact information.',
  },
  {
    num: '3',
    title: 'Start Receiving Referrals',
    description: 'Certified Borrowers discover you in our network. PrepCoach recommends you by name.',
  },
  {
    num: '4',
    title: 'Earn While You Grow',
    description: 'Close more deals and earn referral commissions on Success Kit and Certified Borrower sign-ups.',
  },
];

/* ══════════════════════════════════════════════════════════════════════ */

export default function PartnerRecruitmentPage() {
  const [billingCycle, setBillingCycle] = useState<'yearly' | 'monthly'>('yearly');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    partnerType: 'lender',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company,
          website: formData.website || null,
          inquiry_type: formData.partnerType,
          message: formData.message,
          source: 'recruitment-landing',
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Submission failed');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        partnerType: 'lender',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/80 mb-6">
            <Shield className="h-4 w-4 text-primary" />
            K2 Partner Network — By Invitation
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Become a K2{' '}
            <span className="text-primary">Preferred Partner</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4 leading-relaxed">
            Join our curated network of top-tier lenders and vendors. Get
            direct access to pre-qualified, prepared borrowers who are ready
            to close.
          </p>

          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-10">
            Limited spots available. We maintain strict quality standards to
            ensure every partner in our network delivers exceptional service.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 shadow-lg shadow-primary/20"
              onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Video Demo Section ──────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              See What Our Platform Delivers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch a quick demo of how K2 connects prepared borrowers directly
              to our preferred partners.
            </p>
          </div>

          {/* Video placeholder - replace src with actual video */}
          <div className="aspect-video rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-xl overflow-hidden">
            <div className="text-center p-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4 cursor-pointer hover:bg-primary/30 transition">
                <Play className="h-10 w-10 text-primary ml-1" />
              </div>
              <p className="text-white font-semibold mb-1">Partner Demo Video</p>
              <p className="text-sm text-slate-400">
                See how K2 Certified Borrowers find and connect with you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits ────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Zap className="h-4 w-4" />
              Partner Benefits
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Top Lenders &amp; Vendors Choose K2
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform does the heavy lifting — qualifying borrowers, preparing
              their packages, and steering them to you first.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="group bg-white rounded-2xl p-6 border border-slate-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {b.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <DollarSign className="h-4 w-4" />
              Simple, Transparent Pricing
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Invest in Your Deal Flow
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              One plan. Full access. No hidden fees.
            </p>
          </div>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                billingCycle === 'monthly'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-gray-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white text-gray-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs opacity-80">Save $60</span>
            </button>
          </div>

          {/* Pricing card */}
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-primary/20 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-emerald-50 px-8 py-6 border-b">
                <h3 className="text-xl font-bold text-gray-900">K2 Preferred Partner</h3>
                <p className="text-sm text-gray-600 mt-1">Everything you need to grow your lending or vendor business</p>
              </div>
              <CardContent className="p-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {billingCycle === 'yearly' ? '$240' : '$25'}
                  </span>
                  <span className="text-gray-500">
                    /{billingCycle === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-sm text-primary font-medium mb-6">That&apos;s just $20/month — save $60 vs. monthly</p>
                )}
                {billingCycle === 'monthly' && (
                  <p className="text-sm text-gray-500 mb-6">$300/year if paid monthly. Switch to yearly to save $60.</p>
                )}

                <ul className="space-y-3 mb-8">
                  {[
                    'Custom website page in K2 partner ecosystem',
                    'Prep Coach always suggests your firm first',
                    'Upload documents & 2-min video intro',
                    'Reseller rights: $5 per Kit, $48 per Certified referral',
                    'K2 Preferred Badge on your profile',
                    'Direct access to pre-qualified borrowers',
                    'Priority support & partner dashboard',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className="w-full text-base shadow-lg shadow-primary/20"
                  onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-center text-gray-400 mt-3">
                  Payment starts after your application is approved
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {STEPS.map((step) => (
              <div
                key={step.num}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founding Partner Offer ────────────────────────────── */}
      <section className="py-12 bg-primary/5 border-y border-primary/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-semibold text-emerald-700 mb-4">
            <Star className="h-4 w-4" />
            Limited Time Offer
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            First 20 Partners Join Free
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            We&apos;re currently building our founding partner network. The first
            20 approved lenders and vendors get lifetime preferred status at no
            cost. Apply now to secure your spot.
          </p>
        </div>
      </section>

      {/* ── Application Form ──────────────────────────────────────── */}
      <section id="apply-section" className="py-16 md:py-20 bg-white scroll-mt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Apply to Join the K2 Partner Network
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Fill out the form below and our team will review your application.
              We&apos;ll be in touch within 2 business days.
            </p>
          </div>

          <Card className="border-2">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {success && (
                  <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      Thank you for your application! Our team will review it
                      and contact you within 2 business days.
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      type="url"
                      placeholder="https://"
                      value={formData.website}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="partnerType">I am a...</Label>
                  <select
                    id="partnerType"
                    name="partnerType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.partnerType}
                    onChange={handleChange}
                    required
                  >
                    <option value="lender">Lender</option>
                    <option value="vendor">Vendor / Service Provider</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Tell us about your company and why you&apos;d like to join
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Describe your services, coverage area, and what makes your firm a great fit for K2 borrowers..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── Bottom CTA ─────────────────────────────────────────── */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">
            Join the K2 Partner Network and start receiving referrals from
            prepared, pre-qualified borrowers who are ready to close.
          </p>
          <Button
            size="lg"
            onClick={() => document.getElementById('apply-section')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Apply Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
