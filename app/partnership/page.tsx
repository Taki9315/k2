'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Handshake, CheckCircle2, Building2, Wrench, Shield } from 'lucide-react';

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
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
      const isLender = formData.partnerType === 'lender';
      const tableName = isLender ? 'lender_inquiries' : 'vendor_inquiries';

      // Submit to inquiry table via API
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.partnerType,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          company: formData.company,
          message: formData.message,
          source: 'partnership-page',
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
        partnerType: 'lender',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Handshake className="h-16 w-16 text-slate-700 mx-auto mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Partner Network
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We&apos;re building a network of the best lenders and real estate
            related vendors. If you&apos;re interested in being considered for
            our Preferred Partner program, fill out the form below.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Who We&apos;re Looking For
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We selectively partner with organizations that share our
                commitment to serving prepared borrowers with excellence.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: Building2,
                    title: 'Commercial Lenders',
                    description:
                      'Banks, credit unions, CDFI, SBA lenders, and private lenders focused on the $150K–$5M commercial space.',
                  },
                  {
                    icon: Wrench,
                    title: 'Real Estate Service Providers',
                    description:
                      'Appraisers, environmental consultants, title companies, insurance brokers, attorneys, and CPAs.',
                  },
                  {
                    icon: Shield,
                    title: 'Quality First',
                    description:
                      'Every partner application is personally reviewed. We only accept firms that meet our standards for service and reliability.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Express Your Interest
                </CardTitle>
              </CardHeader>
              <CardContent>
                {success ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600">
                      We&apos;ve received your inquiry and will be back in touch
                      after reviewing your information.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-3">
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
                      <Label htmlFor="company">Company / Organization</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="partnerType">I am a...</Label>
                      <select
                        id="partnerType"
                        name="partnerType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={formData.partnerType}
                        onChange={handleChange}
                        required
                      >
                        <option value="lender">Lender</option>
                        <option value="vendor">Vendor / Service Provider</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Tell us about your company</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Describe your services and coverage area..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? 'Submitting...' : 'Submit Inquiry'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
