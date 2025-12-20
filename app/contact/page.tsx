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
        <AnimatedSection delay={0.1} classNames="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-blue-500">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-700 max-w-xl mx-auto leading-relaxed">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </AnimatedSection>

        <div className="px-2 lg:px-8">

          <AnimatedSection delay={0.2} classNames="mb-4">
                {submitStatus && (
                  <div className={`p-4 text-sm ${submitStatus.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                    } mb-4`}>
                    {submitStatus?.message}
                  </div>
                )}
            <form onSubmit={handleSubmit} className="w-full bg-white h-full border border-gray-300 p-8">
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
                      className="w-full border-2 border-gray-200 p-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
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
                      className="w-full border-2 border-gray-200 p-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-1 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-1 text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="resize-none w-full border-2 border-gray-200 p-3 focus:border-blue-500 focus:outline-none transition-colors text-sm"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-4 font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </AnimatedSection>

          <AnimatedSection delay={0.3} classNames="w-full mx-auto">
            <div className="flex flex-row justify-between items-center">
              <ContactLinkItem title="Email" icon={<Mail className="w-6 h-6 text-blue-600" />} content="admin@steadfasthaven.com" href="mailto:admin@steadfasthaven.com" />
              <ContactLinkItem title="Instagram" icon={<Instagram className="w-6 h-6 text-blue-600" />} content="@thesfhaven" href="https://instagram.com/thesfhaven" />
              <ContactLinkItem title="Phone call" icon={<Phone className="w-6 h-6 text-blue-600"/>} content="+19016022176" href="tel:+19016022176"/>
              <ContactLinkItem title="X Platform" icon={<XIcon className="w-6 h-6 text-blue-600"/>} content="@steadfasthaven1" href="https://x.com/steadfasthaven1"/>
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