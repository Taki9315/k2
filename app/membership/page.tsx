import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  Video,
  MessageSquare,
  FileCheck,
  Calendar,
  Award,
  ArrowRight,
} from 'lucide-react';

export default function MembershipPage() {
  return (
    <div className="flex flex-col">
      <section className="bg-gradient-to-br from-slate-50 to-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                MOST COMPREHENSIVE
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Financing Acceleration Program
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Go beyond the basics. Get ongoing support, expert guidance, and
                exclusive resources as you navigate your financing journey.
              </p>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-5xl font-bold text-gray-900">$97</span>
                <span className="text-gray-600">/month</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Cancel anytime. No long-term contracts.
              </p>
              <Button size="lg" asChild className="text-lg px-8 py-6 w-full sm:w-auto">
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="bg-white rounded-xl shadow-2xl p-8 border-2 border-slate-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Everything Included
              </h3>
              <ul className="space-y-4">
                {[
                  'Borrower Preparation Workbook',
                  'Monthly live Q&A sessions',
                  'Private member community',
                  'Exclusive video library',
                  'Document review and feedback',
                  'Early access to new content',
                  'Email support priority',
                  'Member-only resources',
                ].map((item) => (
                  <li key={item} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Member Benefits
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive support throughout your entire financing journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Monthly Live Q&A
                </h3>
                <p className="text-gray-600">
                  Join monthly live sessions with lending experts. Ask
                  questions, get personalized guidance, and learn from others'
                  situations.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Exclusive Video Library
                </h3>
                <p className="text-gray-600">
                  Access our growing library of advanced training videos,
                  case studies, and deep-dive tutorials not available
                  elsewhere.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Private Community
                </h3>
                <p className="text-gray-600">
                  Connect with other borrowers, share experiences, get
                  feedback, and build relationships with like-minded
                  entrepreneurs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <FileCheck className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Document Review
                </h3>
                <p className="text-gray-600">
                  Submit your financial documents, business plans, and
                  applications for expert review and actionable feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Workbook Included
                </h3>
                <p className="text-gray-600">
                  Get immediate access to the complete Borrower Preparation
                  Workbook as part of your membership.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-slate-700" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Priority Support
                </h3>
                <p className="text-gray-600">
                  Get faster responses to questions via email and priority
                  access to new features and resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Accelerate Your Financing Journey?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join our community of informed borrowers and get the support you
            need to succeed.
          </p>
          <div className="flex items-baseline gap-3 justify-center mb-8">
            <span className="text-5xl font-bold">$97</span>
            <span className="text-slate-300">/month</span>
          </div>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="text-lg px-8 py-6"
          >
            <Link href="/signup">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="text-sm text-slate-400 mt-4">
            Cancel anytime. No long-term commitment.
          </p>
        </div>
      </section>
    </div>
  );
}
