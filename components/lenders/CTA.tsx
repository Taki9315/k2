'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface FormData {
  companyName: string;
  contactName: string;
  email: string;
  message: string;
}

const initialFormData: FormData = {
  companyName: '',
  contactName: '',
  email: '',
  message: '',
};

export function CTA() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const nameParts = formData.contactName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { error: dbError } = await supabase.from('lender_inquiries').insert({
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        company: formData.companyName,
        message: formData.message,
        lender_type: 'other',
      });

      if (dbError) throw dbError;

      // Fire-and-forget admin notification
      fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lender',
          name: formData.contactName,
          company: formData.companyName,
          email: formData.email,
        }),
      }).catch(() => {});

      setSubmitted(true);
      setFormData(initialFormData);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-xl sm:p-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Join the K2 Preferred Lender Network
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-300">
              Preferred Lenders commit to white-glove service for our certified
              borrowers. Submit your inquiry and we&apos;ll send you the full
              program description.
            </p>
          </div>

          {submitted ? (
            <div className="mt-10 rounded-xl border border-blue-400/20 bg-blue-500/10 p-6 text-center">
              <p className="text-lg font-semibold text-white">
                Thank you for your interest.
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Our team will review your submission and reach out shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-medium text-blue-400 underline underline-offset-4 transition-colors hover:text-blue-300"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="companyName"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Acme Capital"
                    className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contactName"
                    className="mb-1.5 block text-sm font-medium text-slate-300"
                  >
                    Contact Name
                  </label>
                  <input
                    id="contactName"
                    name="contactName"
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={handleChange}
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="jane@acmecapital.com"
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-slate-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your lending programs, coverage areas, and what types of deals you are looking for..."
                  className="w-full resize-none rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:opacity-50 sm:w-auto"
              >
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>

              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
