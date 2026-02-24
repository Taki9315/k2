export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        Terms of Service
      </h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-gray-700 mb-4">
            By accessing or using BorrowerEd, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do
            not agree with any of these terms, you are prohibited from using this
            platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Educational Purpose
          </h2>
          <p className="text-gray-700 mb-4">
            BorrowerEd is an educational platform. All content, resources, and
            guidance provided are for informational purposes only. We do not
            provide financial advice, guarantee loan approval, or act as a
            lending broker.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            User Accounts
          </h2>
          <p className="text-gray-700 mb-4">
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You agree to notify us immediately of any unauthorized use
            of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Intellectual Property
          </h2>
          <p className="text-gray-700 mb-4">
            All content on this platform, including text, graphics, logos, and
            software, is the property of BorrowerEd and is protected by
            copyright and intellectual property laws. You may not reproduce,
            distribute, or create derivative works without our written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We offer a 30-day Prepared Borrower Guarantee on our Success Kit.
            If you don&apos;t feel more confident, more organized, and better
            equipped to approach lenders after using the Kit, return it within
            30 days for a full refund. Membership
            subscriptions can be cancelled at any time, with no refunds for
            partial months.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            BorrowerEd shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of or
            inability to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Changes to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. We will
            notify users of significant changes via email or through the platform.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <p className="text-gray-700">
            If you have questions about these Terms of Service, please contact us
            at legal@borrowered.com.
          </p>
        </section>
      </div>
    </div>
  );
}
