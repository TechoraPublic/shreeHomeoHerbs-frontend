const LAST_UPDATED = "January 1, 2025";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using the HerboNature website and purchasing our products, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.

These terms apply to all visitors, users, and customers of HerboNature.`,
  },
  {
    title: "2. Products & Descriptions",
    content: `We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, or error-free.

All products are subject to availability. We reserve the right to discontinue any product at any time. Product images are for illustrative purposes and may slightly differ from the actual product.`,
  },
  {
    title: "3. Pricing & Payment",
    content: `All prices are listed in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise. We reserve the right to change prices at any time without prior notice.

Payment must be made in full at the time of placing an order. We accept UPI, credit/debit cards, and cash on delivery (COD). For COD orders, payment must be made to the delivery person at the time of delivery.`,
  },
  {
    title: "4. Order Placement & Confirmation",
    content: `Placing an order constitutes an offer to purchase. An order is confirmed only after you receive an order confirmation. We reserve the right to cancel or refuse any order at our discretion, including cases of pricing errors, suspected fraud, or unavailability of stock.

You will receive an order confirmation via email or on-screen notification after successful placement.`,
  },
  {
    title: "5. Shipping & Delivery",
    content: `We aim to dispatch orders within 1–2 business days. Estimated delivery time is 3–7 business days depending on your location. Delivery timelines are estimates and not guaranteed.

Free shipping is available on orders above ₹299. A shipping fee of ₹49 applies to orders below this amount.

We are not responsible for delays caused by courier partners, natural disasters, or other circumstances beyond our control.`,
  },
  {
    title: "6. Returns & Refunds",
    content: `We accept returns within 7 days of delivery for products that are:

• Damaged or defective upon arrival
• Incorrect items delivered
• Significantly different from the product description

Products must be unused, in original packaging, and accompanied by proof of purchase. We do not accept returns for opened or used products unless they are defective.

Refunds will be processed within 5–7 business days after we receive and inspect the returned product.`,
  },
  {
    title: "7. User Accounts",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.

We reserve the right to terminate accounts that violate these terms or engage in fraudulent activity.`,
  },
  {
    title: "8. Intellectual Property",
    content: `All content on this website, including text, images, logos, product descriptions, and graphics, is the property of HerboNature and is protected by applicable intellectual property laws.

You may not reproduce, distribute, modify, or create derivative works without our express written permission.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `To the maximum extent permitted by law, HerboNature shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our products or services.

Our total liability to you for any claim arising from these terms shall not exceed the amount you paid for the specific product or service giving rise to the claim.`,
  },
  {
    title: "10. Governing Law",
    content: `These Terms and Conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in [Your City], India.`,
  },
  {
    title: "11. Changes to Terms",
    content: `We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Your continued use of our website after any changes constitutes your acceptance of the new terms.`,
  },
  {
    title: "12. Contact Us",
    content: `For any questions regarding these Terms and Conditions, please contact us at:

Email: hello@herbonature.com
Phone: +91 00000 00000
Address: Your Address, City, State — PIN`,
  },
];

export default function TermsConditions() {
  return (
    <main className="min-h-screen bg-[#faf8f5]">
      <section className="bg-white border-b border-brand-100 pt-28 pb-10">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="inline-block text-xs font-bold text-brand-600 uppercase tracking-widest bg-brand-50 px-4 py-1.5 rounded-full mb-4">
            Legal
          </span>
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-3">Terms & Conditions</h1>
          <p className="text-sm text-gray-500">Last updated: {LAST_UPDATED}</p>
          <p className="text-gray-500 mt-4 leading-relaxed">
            Please read these Terms and Conditions carefully before using the HerboNature website or purchasing our products. These terms govern your use of our services.
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
            Questions about our terms?{" "}
            <a href="mailto:hello@herbonature.com" className="text-brand-600 font-semibold hover:text-brand-800 transition-colors">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
