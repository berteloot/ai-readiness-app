import Link from 'next/link';

export default function TermsOfService() {
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
              Terms of Service
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
                Agreement to Terms
              </h2>
              <p className="mb-6">
                By accessing and using the AI Readiness Assessment Tool (the &ldquo;Service&rdquo;) provided by Lean Solutions Group (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you disagree with any part of these terms, you may not access the Service.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Description of Service
              </h2>
              <p className="mb-6">
                The AI Readiness Assessment Tool is a comprehensive evaluation platform that analyzes your organization&apos;s readiness for artificial intelligence transformation. The Service provides personalized assessments, scoring, and detailed reports based on your responses to our evaluation questions.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                User Eligibility
              </h2>
              <p className="mb-6">
                You must be at least 18 years old and have the legal capacity to enter into these Terms. By using the Service, you represent and warrant that you meet these requirements and that you will use the Service in accordance with these Terms.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                User Responsibilities
              </h2>
              <p className="mb-4">You agree to:</p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain the security of your account and information</li>
                <li>Use the Service only for lawful purposes</li>
                <li>Not attempt to gain unauthorized access to the Service</li>
                <li>Not interfere with or disrupt the Service</li>
                <li>Not use the Service to transmit harmful or malicious content</li>
              </ul>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Intellectual Property Rights
              </h2>
              <p className="mb-6">
                The Service and its original content, features, and functionality are owned by Lean Solutions Group and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works of the Service without our express written consent.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Assessment Results and Reports
              </h2>
              <p className="mb-6">
                While we strive to provide accurate and helpful assessments, the results and recommendations are for informational purposes only. We do not guarantee the accuracy, completeness, or usefulness of any assessment results. You should not rely solely on these results for business decisions and should consult with qualified professionals as appropriate.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Privacy and Data Protection
              </h2>
              <p className="mb-6">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to our collection and use of information as described in our Privacy Policy.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Disclaimers
              </h2>
              <p className="mb-6">
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Limitation of Liability
              </h2>
              <p className="mb-6">
                IN NO EVENT SHALL LEAN SOLUTIONS GROUP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM YOUR USE OF THE SERVICE.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Indemnification
              </h2>
              <p className="mb-6">
                You agree to defend, indemnify, and hold harmless Lean Solutions Group and its officers, directors, employees, and agents from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Termination
              </h2>
              <p className="mb-6">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will cease immediately.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Governing Law
              </h2>
              <p className="mb-6">
                These Terms shall be governed by and construed in accordance with the laws of the State of Florida, United States, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be resolved in the courts of Broward County, Florida.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Changes to Terms
              </h2>
              <p className="mb-6">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
              </p>

              <h2 className="text-xl font-semibold text-text-primary mb-4">
                Contact Information
              </h2>
              <p className="mb-6">
                If you have any questions about these Terms of Service, please contact us:
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
                  Email: <a href="mailto:legal@leangroup.com" className="text-accent-600 hover:text-accent-700">legal@leangroup.com</a>
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
