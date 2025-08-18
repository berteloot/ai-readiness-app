import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background-surface">
      {/* Header */}
      <div className="bg-white shadow-card border-b border-border-subtle">
        <div className="max-w-4xl mx-auto mobile-optimized py-8">
          <div className="text-center">
            <Link href="/" className="inline-block mb-6">
              <img 
                src="https://cdn.prod.website-files.com/636a549426aa8438b3b45fa8/63861ae0dfd2084587eb343a_LeanSolutions_2021__logo_Color_FA.svg"
                alt="Lean Solutions Group"
                className="h-12 mx-auto"
              />
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              Privacy Policy
            </h1>
            <p className="text-text-secondary">
              AI Readiness Assessment Tool
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto mobile-optimized">
          <div className="bg-white rounded-lg shadow-card border border-border-default p-6 sm:p-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-sm text-text-secondary mb-4">
                  <strong>Effective Date:</strong> January 1, 2025
                </p>
                <p className="text-sm text-text-secondary">
                  <strong>Last Updated:</strong> January 1, 2025
                </p>
              </div>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Introduction
              </h2>
              <p className="mb-6">
                Lean Solutions Group (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI Readiness Assessment Tool (the &ldquo;Service&rdquo;).
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Information We Collect
              </h2>
              <p className="mb-4">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Company name and contact information</li>
                <li>Email address</li>
                <li>Assessment responses and scores</li>
                <li>Any additional information you choose to provide</li>
              </ul>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Provide and maintain the AI Readiness Assessment Service</li>
                <li>Generate personalized assessment reports</li>
                <li>Send assessment results to your email</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about our services</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Information Sharing and Disclosure
              </h2>
              <p className="mb-6">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted third-party service providers who assist us in operating our website and providing services.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Data Security
              </h2>
              <p className="mb-6">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Data Retention
              </h2>
              <p className="mb-6">
                We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. You may request deletion of your data at any time by contacting us.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Withdraw consent at any time</li>
              </ul>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Cookies and Tracking Technologies
              </h2>
              <p className="mb-6">
                We may use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Third-Party Links
              </h2>
              <p className="mb-6">
                Our Service may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Children&apos;s Privacy
              </h2>
              <p className="mb-6">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Changes to This Policy
              </h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;Last Updated&rdquo; date.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Contact Us
              </h2>
              <p className="mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-background-surface p-4 rounded-lg mb-6">
                <p className="mb-2">
                  <strong>Lean Solutions Group</strong>
                </p>
                <p className="mb-2">
                  <a href="https://www.leangroup.com/" className="text-accent-600 hover:text-accent-700">
                    www.leangroup.com
                  </a>
                </p>
                <p className="mb-2">
                  Email: <a href="mailto:privacy@leangroup.com" className="text-accent-600 hover:text-accent-700">privacy@leangroup.com</a>
                </p>
                <p>
                  Phone: <a href="tel:+18883239995" className="text-accent-600 hover:text-accent-700">+1 (888) 323-9995</a>
                </p>
              </div>

              <div className="text-center pt-6 border-t border-border-default">
                <Link 
                  href="/" 
                  className="inline-flex items-center text-accent-600 hover:text-accent-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Assessment Tool
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
