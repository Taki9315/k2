'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Handshake, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function PartnershipPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
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
      const { error: submitError } = await supabase
        .from('contact_inquiries')
        .insert({
          type: 'partnership',
          name: formData.name,
          email: formData.email,
          company: formData.company,
          message: formData.message,
        });

      if (submitError) throw submitError;

      setSuccess(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit inquiry');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
            Partnership Opportunities
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Interested in collaborating? We're always looking for strategic
            partners who share our mission to educate and empower borrowers.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Who We Partner With
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're interested in partnerships with organizations that align
                with our values and mission.
              </p>

              <div className="space-y-6">
                {[
                  {
                    title: 'Financial Institutions',
                    description:
                      'Banks, credit unions, and lenders who want to offer education resources to their customers.',
                  },
                  {
                    title: 'Business Consultants',
                    description:
                      'Advisors and consultants who want to provide financing education to their clients.',
                  },
                  {
                    title: 'Educational Organizations',
                    description:
                      'Schools, training programs, and business development centers.',
                  },
                  {
                    title: 'Technology Partners',
                    description:
                      'Software and platform providers serving the lending or small business space.',
                  },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
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
                  Submit Partnership Inquiry
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {success && (
                    <Alert>
                      <AlertDescription>
                        Thank you for your interest! We'll review your inquiry
                        and get back to you soon.
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your Company Name"
                      value={formData.company}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Partnership Details</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us about your organization and how you'd like to partner..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
