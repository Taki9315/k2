import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Disclaimer</h1>

      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-base">
          Please read this disclaimer carefully before using our platform.
        </AlertDescription>
      </Alert>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Educational Content Only
          </h2>
          <p className="text-gray-700 mb-4">
            All information, content, and materials available on BorrowerEd are
            for educational and informational purposes only. Nothing on this
            platform constitutes financial, legal, or professional advice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Guarantees
          </h2>
          <p className="text-gray-700 mb-4">
            We do not guarantee, represent, or warrant that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>You will be approved for any loan or financing</li>
            <li>
              Following our guidance will result in specific outcomes or results
            </li>
            <li>Your credit score or financial situation will improve</li>
            <li>You will secure funding on specific terms</li>
            <li>
              The information provided is applicable to your specific situation
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Not a Lending Service
          </h2>
          <p className="text-gray-700 mb-4">
            BorrowerEd is not a lender, lending broker, or financial institution.
            We do not:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Provide, broker, or facilitate loans</li>
            <li>Make lending decisions</li>
            <li>Guarantee loan approval or denial</li>
            <li>Represent or partner with specific lenders</li>
            <li>Receive compensation for loan referrals</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Individual Results May Vary
          </h2>
          <p className="text-gray-700 mb-4">
            Every borrower's situation is unique. Lending decisions depend on
            numerous factors including but not limited to credit history, income,
            debt-to-income ratio, collateral, business viability, and lender
            criteria. What works for one borrower may not work for another.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Consult Professionals
          </h2>
          <p className="text-gray-700 mb-4">
            You should consult with qualified professionals regarding your
            specific situation:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Financial advisors for financial planning</li>
            <li>Attorneys for legal matters</li>
            <li>Accountants for tax and accounting questions</li>
            <li>Business consultants for business strategy</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Content Accuracy
          </h2>
          <p className="text-gray-700 mb-4">
            While we strive to provide accurate and up-to-date information,
            lending regulations, requirements, and best practices change
            frequently. We do not warrant that the information on this platform
            is complete, accurate, reliable, current, or error-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Risk Acknowledgment
          </h2>
          <p className="text-gray-700 mb-4">
            Seeking business financing involves financial risk. You acknowledge
            that:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
            <li>Borrowing money creates financial obligations</li>
            <li>Failure to repay loans can have serious consequences</li>
            <li>You are solely responsible for your financial decisions</li>
            <li>
              You should only borrow what you can reasonably afford to repay
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Third-Party Links
          </h2>
          <p className="text-gray-700 mb-4">
            Our platform may contain links to third-party websites or resources.
            We are not responsible for the content, accuracy, or availability of
            these external sites. Links do not constitute endorsement.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Use at Your Own Risk
          </h2>
          <p className="text-gray-700 mb-4">
            Your use of BorrowerEd and reliance on any information provided is
            solely at your own risk. We shall not be held liable for any losses,
            damages, or consequences resulting from your use of our platform or
            application of information provided.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions</h2>
          <p className="text-gray-700">
            If you have questions about this disclaimer, please contact us at
            legal@borrowered.com.
          </p>
        </section>
      </div>
    </div>
  );
}
