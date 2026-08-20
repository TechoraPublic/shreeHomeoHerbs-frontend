import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, AlertCircle, CheckCircle } from "lucide-react";

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+91 00000 00000", href: "tel:+910000000000" },
  { icon: Mail, label: "Email", value: "hello@herbonature.com", href: "mailto:hello@herbonature.com" },
  { icon: MapPin, label: "Address", value: "Your Address, City, State — PIN", href: null },
  { icon: Clock, label: "Business Hours", value: "Mon–Sat, 9 AM – 6 PM IST", href: null },
];

const SUBJECTS = ["Product Inquiry", "Order Issue", "Return / Refund", "Wholesale", "Other"];

function Field({ label, id, type = "text", value, onChange, error, placeholder, required, as: As = "input", rows }) {
  const cls = `w-full px-4 py-3 border rounded-xl text-sm text-gray-800 placeholder-gray-400 bg-white transition-all focus:outline-none focus:ring-2 ${
    error ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"
  }`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {As === "textarea" ? (
        <textarea id={id} value={value} onChange={onChange} placeholder={placeholder} rows={rows || 4} className={cls} />
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className={cls} />
      )}
      {error && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(field) {
    return (e) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      if (errors[field]) setErrors((er) => ({ ...er, [field]: "" }));
    };
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (form.phone && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Enter a valid 10-digit mobile number.";
    if (!form.subject) e.subject = "Please select a subject.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 10) e.message = "Message must be at least 10 characters.";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#faf8f5]">
      {/* Hero */}
      <section className="bg-white border-b border-brand-100 pt-28 pb-12">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question or need help? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info */}
          <div className="space-y-5">
            <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-brand-50 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-brand-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm text-gray-800 font-medium hover:text-brand-600 transition-colors">{value}</a>
                  ) : (
                    <p className="text-sm text-gray-800 font-medium">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-brand-600 rounded-2xl p-5 text-white">
              <MessageCircle size={24} className="text-brand-200 mb-3" />
              <p className="font-heading font-semibold mb-1">Quick Response</p>
              <p className="text-brand-200 text-sm">We typically respond to all inquiries within 24 business hours.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-3xl border border-brand-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-gray-500 mb-6">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                  className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-full transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-brand-100 shadow-sm p-8">
                <h2 className="font-heading text-xl font-bold text-gray-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name" id="name" value={form.name} onChange={set("name")} placeholder="Your name" error={errors.name} required />
                    <Field label="Email Address" id="email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" error={errors.email} required />
                  </div>
                  <Field label="Mobile Number" id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="10-digit mobile (optional)" error={errors.phone} />
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Subject<span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={set("subject")}
                      className={`w-full px-4 py-3 border rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 transition-all ${
                        errors.subject ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-brand-400 focus:ring-brand-100"
                      }`}
                    >
                      <option value="">Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.subject && <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1"><AlertCircle size={11} />{errors.subject}</p>}
                  </div>
                  <Field label="Message" id="message" as="textarea" rows={5} value={form.message} onChange={set("message")} placeholder="Tell us how we can help you..." error={errors.message} required />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-brand-200"
                  >
                    <Send size={16} />
                    {loading ? "Sending…" : "Send Message"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
