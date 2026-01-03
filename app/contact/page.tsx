"use client"

import { useState } from "react";
import { Mail, Instagram, Send, Phone, X as XIcon } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";
import ContactLinkItem from "@/components/contact-link-item";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/.netlify/functions/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
        setFormData({ name: '', lastName: '', email: '', message: '' });
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="w-full bg-white text-black flex items-center justify-center font-sans py-6">
      <div className="w-full md:max-w-5xl w-full mx-auto px-8 pt-6 pb-8">
        <AnimatedSection delay={0.1} classNames="text-center mb-12 flex flex-col items-center">
          <span className="mb-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm font-sans">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            Contact Us
          </span>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 leading-tight font-sans">
            Get <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent pr-2 pb-1">in Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium font-sans">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </AnimatedSection>

        <div className="px-2 lg:px-8">

          <AnimatedSection delay={0.2} classNames="mb-4">
            {submitStatus && (
              <div className={`p-4 rounded-xl text-sm font-sans ${submitStatus.type === 'success'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                } mb-8`}>
                {submitStatus?.message}
              </div>
            )}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white p-8 md:p-14 shadow-[0_40px_100px_-20px_rgba(59,130,246,0.12)] ring-1 ring-blue-900/5 isolation-auto border border-white/50 backdrop-blur-xl">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/40 via-teal-100/30 to-cyan-100/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-cyan-100/40 via-blue-100/30 to-teal-100/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

              <form onSubmit={handleSubmit} className="relative z-10 w-full">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold mb-1 text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:outline-none transition-all duration-300 text-base font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-semibold mb-1 text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:outline-none transition-all duration-300 text-base font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700 font-sans">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:outline-none transition-all duration-300 text-base font-sans"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-1 text-gray-700 font-sans">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="resize-none w-full bg-gray-50/50 border border-gray-100 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:outline-none transition-all duration-300 text-base font-sans min-h-[150px]"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-teal-500/40 hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-sans"
                  >
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3} classNames="w-full mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
              <ContactLinkItem title="Email" icon={<Mail className="w-6 h-6 text-blue-600" />} content="admin@steadfasthaven.com" href="mailto:admin@steadfasthaven.com" />
              <ContactLinkItem title="Instagram" icon={<Instagram className="w-6 h-6 text-blue-600" />} content="@thesfhaven" href="https://instagram.com/thesfhaven" />
              <ContactLinkItem title="Phone call" icon={<Phone className="w-6 h-6 text-blue-600" />} content="+19016022176" href="tel:+19016022176" />
              <ContactLinkItem title="X Platform" icon={<XIcon className="w-6 h-6 text-blue-600" />} content="@steadfasthaven1" href="https://x.com/steadfasthaven1" />
            </div>
          </AnimatedSection>

        </div>

      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}