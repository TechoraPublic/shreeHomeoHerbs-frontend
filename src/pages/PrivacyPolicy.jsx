const LAST_UPDATED = "January 1, 2025";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us when you create an account, place an order, or contact us. This includes:
    
• Personal identification information (name, email address, phone number)
• Delivery address and billing information
• Order history and transaction data
• Communications you send to us

We also automatically collect certain information when you use our website, including IP address, browser type, pages visited, and time spent on pages.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

• Process and fulfill your orders
• Send order confirmations, shipping updates, and delivery notifications
• Respond to your comments, questions, and customer service requests
• Send promotional communications (only with your consent)
• Improve our website, products, and services
• Comply with legal obligations`,
  },
  {
    title: "3. Information Sharing",
    content: `We do not sell, trade, or rent your personal information to third parties. We may share your information with:

• Delivery partners and logistics providers to fulfill your orders
• Payment processors to complete transactions securely
• Service providers who assist in our operations (under strict confidentiality agreements)
• Law enforcement or government authorities when required by law`,
  },
  {
    title: "4. Data Security",
    content: `We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "5. Cookies",
    content: `We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences. Disabling cookies may affect some features of our website.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to:

• Access the personal information we hold about you
• Request correction of inaccurate or incomplete data
• Request deletion of your personal data (subject to legal requirements)
• Opt out of marketing communications at any time
• Lodge a complaint with a supervisory authority

To exercise any of these rights, please contact us at hello@herbonature.com.`,
  },
  {
    title: "7. Data Retention",
    content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Order data is typically retained for 7 years for accounting and legal purposes.`,
  },
  {
    title: "8. Children's Privacy",
    content: `Our website and services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.`,
  },
  {
    title: "9. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.`,
  },
  {
    title: "10. Contact Us",
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:

Email: hello@herbonature.com
Phone: +91 00000 00000
Address: Your Address, City, State — PIN`,
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <section className="bg-white border-b border-brand-100 pt-28 pb-10">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-4 py-1.5 rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <p className="text-gray-500 mt-4 leading-relaxed">
            At HerboNature, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {SECTIONS.map(({ title, content }) => (
            <div key={title} className="bg-white rounded-2xl border border-brand-50 shadow-sm p-6 sm:p-8">
              <h2 className="font-heading text-lg font-bold text-gray-900 mb-4">{title}</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{content}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-brand-50 border border-brand-100 rounded-2xl p-6 text-center">
          <p className="text-sm text-gray-600">
            Questions about our privacy practices?{" "}
            <a href="mailto:hello@herbonature.com" className="text-brand-600 font-semibold hover:text-brand-800 transition-colors">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
