export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us when you create an
            account, purchase products, or communicate with us. This includes
            your name, email address, and payment information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to provide, maintain, and improve
            our services, process transactions, send you technical notices and
            support messages, and respond to your inquiries.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Information Sharing
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or rent your personal information to third
            parties. We may share your information with service providers who
            assist us in operating our platform, such as payment processors and
            email service providers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700 mb-4">
            You have the right to access, correct, or delete your personal
            information. You may also object to or restrict certain processing of
            your data. To exercise these rights, please contact us at
            privacy@borrowered.com.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700">
            If you have questions about this Privacy Policy, please contact us at
            privacy@borrowered.com.
          </p>
        </section>
      </div>
    </div>
  );
}
