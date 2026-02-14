// "use client";
//
// import { useState, useEffect, useRef } from "react";
// import { Send, Sparkles, Mail, User, MessageSquare } from "lucide-react";
// import { ParticleBackground } from "@/components/particle-background";
//
// const AnimatedSection = ({
//   children,
//   delay = 0,
//   classNames = "",
// }: {
//   children: React.ReactNode;
//   delay?: number;
//   classNames?: string;
// }) => {
//   const [isVisible, setIsVisible] = useState(false);
//   const ref = useRef(null);
//
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setTimeout(() => setIsVisible(true), delay * 1000);
//         }
//       },
//       { threshold: 0.1 }
//     );
//
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [delay]);
//
//   return (
//     <div
//       ref={ref}
//       className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//         } ${classNames}`}
//     >
//       {children}
//     </div>
//   );
// };
//
// export default function Contact() {
//   const [formData, setFormData] = useState({
//     name: "",
//     lastName: "",
//     email: "",
//     message: "",
//   });
//   const [focusedField, setFocusedField] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);
//
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus(null);
//
//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
//
//       const data = await response.json();
//
//       if (!response.ok) {
//         throw new Error(data.message || 'Something went wrong');
//       }
//
//       setSubmitStatus({
//         type: "success",
//         message: "Message received! We'll be in touch shortly.",
//       });
//       setFormData({ name: "", lastName: "", email: "", message: "" });
//     } catch (error) {
//       setSubmitStatus({
//         type: "error",
//         message: "Failed to send message. Please try again later.",
//       });
//       console.error("Submission error:", error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
//
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//
//   return (
//     <section className="relative min-h-[90vh] w-full bg-slate-50 overflow-hidden flex items-center justify-center font-sans py-12 md:py-20">
//       {/* Background Atmosphere */}
//       <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-50 to-blue-50/50"></div>
//
//       {/* Dynamic Orbs behind glass */}
//       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] animate-pulse-slow"></div>
//       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-[100px] animate-pulse-slow [animation-delay:2s]"></div>
//
//       <ParticleBackground />
//
//       <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid lg:grid-cols-5 gap-12 lg:gap-8 items-center">
//
//           {/* Left Column: Heading & Info */}
//           <div className="lg:col-span-2 text-center lg:text-left space-y-6">
//             <AnimatedSection delay={0.1}>
//               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-blue-100 shadow-sm backdrop-blur-sm mb-6">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
//                 </span>
//                 <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
//                   Get Involved
//                 </span>
//               </div>
//
//               <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[0.9]">
//                 Join the <br />
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
//                   Movement
//                 </span>
//               </h1>
//             </AnimatedSection>
//
//             <AnimatedSection delay={0.2} classNames="max-w-md mx-auto lg:mx-0">
//               <p className="text-lg text-slate-600 leading-relaxed font-medium">
//                 Ready to make a difference? Whether you want to plant trees, mentor others, or support our cause, we'd love to have you on board.
//               </p>
//             </AnimatedSection>
//           </div>
//
//           {/* Right Column: Glassmorphism Form */}
//           <div className="lg:col-span-3">
//             <AnimatedSection delay={0.3}>
//               <div className="relative">
//                 {/* Decorative border gradient */}
//                 <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-blue-200 via-white to-teal-200 opacity-70 blur-sm"></div>
//
//                 {/* Glass Card */}
//                 <div className="relative bg-white/60 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-2xl ring-1 ring-white/60">
//
//                   {submitStatus && (
//                     <div className={`absolute top-0 left-0 right-0 -mt-16 mx-4 p-4 rounded-xl text-sm font-medium text-center animate-slide-down shadow-lg backdrop-blur-md border ${submitStatus.type === 'success'
//                       ? 'bg-teal-50/90 text-teal-800 border-teal-200'
//                       : 'bg-red-50/90 text-red-800 border-red-200'
//                       }`}>
//                       {submitStatus.message}
//                     </div>
//                   )}
//
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="space-y-1.5 cursor-text" onClick={() => document.getElementById('name')?.focus()}>
//                         <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">First Name</label>
//                         <div className={`group relative flex items-center bg-white/50 border-2 rounded-xl transition-all duration-300 ${focusedField === 'name' ? 'border-blue-500 shadow-lg shadow-blue-500/10 bg-white' : 'border-slate-100 hover:border-slate-200'}`}>
//                           <User className={`w-4 h-4 ml-4 transition-colors ${focusedField === 'name' ? 'text-blue-500' : 'text-slate-400'}`} />
//                           <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             onFocus={() => setFocusedField('name')}
//                             onBlur={() => setFocusedField(null)}
//                             className="w-full bg-transparent border-none p-3.5 pl-3 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-semibold"
//                             placeholder="John"
//                             required
//                           />
//                         </div>
//                       </div>
//
//                       <div className="space-y-1.5 cursor-text" onClick={() => document.getElementById('lastName')?.focus()}>
//                         <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Last Name</label>
//                         <div className={`group relative flex items-center bg-white/50 border-2 rounded-xl transition-all duration-300 ${focusedField === 'lastName' ? 'border-teal-500 shadow-lg shadow-teal-500/10 bg-white' : 'border-slate-100 hover:border-slate-200'}`}>
//                           <User className={`w-4 h-4 ml-4 transition-colors ${focusedField === 'lastName' ? 'text-teal-500' : 'text-slate-400'}`} />
//                           <input
//                             type="text"
//                             id="lastName"
//                             name="lastName"
//                             value={formData.lastName}
//                             onChange={handleChange}
//                             onFocus={() => setFocusedField('lastName')}
//                             onBlur={() => setFocusedField(null)}
//                             className="w-full bg-transparent border-none p-3.5 pl-3 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-semibold"
//                             placeholder="Doe"
//                             required
//                           />
//                         </div>
//                       </div>
//                     </div>
//
//                     <div className="space-y-1.5 cursor-text" onClick={() => document.getElementById('email')?.focus()}>
//                       <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Email Address</label>
//                       <div className={`group relative flex items-center bg-white/50 border-2 rounded-xl transition-all duration-300 ${focusedField === 'email' ? 'border-blue-500 shadow-lg shadow-blue-500/10 bg-white' : 'border-slate-100 hover:border-slate-200'}`}>
//                         <Mail className={`w-4 h-4 ml-4 transition-colors ${focusedField === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
//                         <input
//                           type="email"
//                           id="email"
//                           name="email"
//                           value={formData.email}
//                           onChange={handleChange}
//                           onFocus={() => setFocusedField('email')}
//                           onBlur={() => setFocusedField(null)}
//                           className="w-full bg-transparent border-none p-3.5 pl-3 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-semibold"
//                           placeholder="john@example.com"
//                           required
//                         />
//                       </div>
//                     </div>
//
//                     <div className="space-y-1.5 cursor-text" onClick={() => document.getElementById('message')?.focus()}>
//                       <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 pl-1">Your Message</label>
//                       <div className={`group relative flex items-start bg-white/50 border-2 rounded-xl transition-all duration-300 ${focusedField === 'message' ? 'border-teal-500 shadow-lg shadow-teal-500/10 bg-white' : 'border-slate-100 hover:border-slate-200'}`}>
//                         <MessageSquare className={`w-4 h-4 ml-4 mt-4 transition-colors ${focusedField === 'message' ? 'text-teal-500' : 'text-slate-400'}`} />
//                         <textarea
//                           id="message"
//                           name="message"
//                           rows={4}
//                           value={formData.message}
//                           onChange={handleChange}
//                           onFocus={() => setFocusedField('message')}
//                           onBlur={() => setFocusedField(null)}
//                           className="w-full bg-transparent border-none p-3.5 pl-3 text-slate-800 placeholder-slate-400 focus:ring-0 text-sm font-semibold resize-none min-h-[120px]"
//                           placeholder="I'd love to help with..."
//                           required
//                         ></textarea>
//                       </div>
//                     </div>
//
//                     <button
//                       disabled={isSubmitting}
//                       className="group relative w-full overflow-hidden rounded-xl bg-slate-900 p-4 transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       <div className="absolute inset-0 flex items-center justify-center text-white/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//                         <Sparkles className="w-24 h-24 animate-spin-slow" />
//                       </div>
//                       <div className="relative flex items-center justify-center gap-3">
//                         <span className="text-base font-bold text-white tracking-wide">
//                           {isSubmitting ? "Sending Message..." : "Send Message"}
//                         </span>
//                         {!isSubmitting && <Send className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />}
//                       </div>
//                       <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/20 to-blue-600/0 skew-x-12 -translate-x-[200%] transition-transform duration-1000 group-hover:translate-x-[200%]" />
//                     </button>
//
//                   </form>
//                 </div>
//               </div>
//             </AnimatedSection>
//           </div>
//         </div>
//       </div>
//
//       <style jsx global>{`
//         @keyframes slide-down {
//           from { opacity: 0; transform: translateY(-10px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slide-down {
//           animation: slide-down 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//         }
//         .animate-pulse-slow {
//             animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//         .animate-spin-slow {
//             animation: spin 8s linear infinite;
//         }
//         @keyframes spin {
//             from { transform: rotate(0deg); }
//             to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { Mail, MapPin, Instagram, Send, X } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";
import ContactLinkItem from "@/components/contact-link-item";
import { SiX } from "react-icons/si";
import { IoCall } from "react-icons/io5";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Message sent successfully! We'll get back to you soon.",
        });
        setFormData({ name: "", lastName: "", email: "", message: "" });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.message || "Failed to send message. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </AnimatedSection>

        <div className="px-2 lg:px-8">
          <AnimatedSection delay={0.2} classNames="mb-4">
            {submitStatus && (
              <div
                className={`p-4 text-sm ${
                  submitStatus.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                } mb-4`}
              >
                {submitStatus?.message}
              </div>
            )}
            <div className="w-full bg-white h-full border border-gray-300 p-8">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold mb-1 text-gray-700"
                    >
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
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold mb-1 text-gray-700"
                    >
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold mb-1 text-gray-700"
                  >
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
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-1 text-gray-700"
                  >
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-4 font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3} classNames="w-full mx-auto">
            <div className="flex flex-row justify-between items-center">
              <ContactLinkItem
                title="Email"
                icon={<Mail className="w-6 h-6 text-blue-600" />}
                content="admin@steadfasthaven.com"
                href="mailto:admin@steadfasthaven.com"
              />
              <ContactLinkItem
                title="Instagram"
                icon={<Instagram className="w-6 h-6 text-blue-600" />}
                content="@thesfhaven"
                href="https://instagram.com/thesfhaven"
              />
              <ContactLinkItem
                title="Phone call"
                icon={<IoCall className="w-6 h-6 text-blue-600" />}
                content="+19016022176"
                href="https://x.com/steadfasthaven1"
              />
              <ContactLinkItem
                title="X Platform"
                icon={<SiX className="w-6 h-6 text-blue-600" />}
                content="@steadfasthaven1"
                href="https://x.com/steadfasthaven1"
              />
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
