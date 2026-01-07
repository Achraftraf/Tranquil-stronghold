"use client"

import { useState, useEffect, useRef } from "react";
import { Mail, Instagram, Send, Phone, X } from "lucide-react";

const AnimatedSection = ({ children, delay = 0, classNames = "" }: { children: React.ReactNode; delay?: number; classNames?: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        } ${classNames}`}
    >
      {children}
    </div>
  );
};

const ParticleBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    class Particle {
      x!: number;
      y!: number;
      speed!: number;
      size!: number;
      opacity!: number;

      constructor() {
        this.reset();
        this.y = Math.random() * canvas!.height;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      reset() {
        this.x = Math.random() * canvas!.width;
        this.y = -10;
        this.speed = Math.random() * 1 + 0.5;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.y += this.speed;
        if (this.y > canvas!.height) {
          this.reset();
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

const ContactLinkItem = ({ title, icon, content, href }: { title: string; icon: React.ReactNode; content: string; href: string }) => {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-lg shadow-blue-500/5 ring-1 ring-blue-900/5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:ring-blue-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-teal-500/0 group-hover:from-blue-500/5 group-hover:to-teal-500/5 transition-all duration-500"></div>
      <div className="relative z-10 flex flex-col items-center text-center space-y-3">
        <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300 group-hover:scale-110 transform">
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">{title}</p>
          <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
            {content}
          </p>
        </div>
      </div>
    </a>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      setSubmitStatus({
        type: 'success',
        message: 'Message sent successfully! We\'ll get back to you soon.'
      });
      setFormData({ name: '', lastName: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 text-black flex items-center justify-center font-sans py-12 overflow-hidden">
      <ParticleBackground />

      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-400/20 to-blue-400/20 rounded-full blur-3xl animate-float-delayed"></div>

      <div className="relative z-10 w-full md:max-w-5xl mx-auto px-8 pt-6 pb-8">
        <AnimatedSection delay={0.1} classNames="text-center mb-12 flex flex-col items-center">
          <span className="mb-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
            </span>
            Contact Us
          </span>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-gray-900 leading-tight">
            Get <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">in Touch</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </AnimatedSection>

        <div className="px-2 lg:px-8">
          <AnimatedSection delay={0.2} classNames="mb-8">
            {submitStatus && (
              <div className={`p-4 rounded-xl text-sm animate-slide-down ${submitStatus.type === 'success'
                ? 'bg-teal-50 text-teal-800 border border-teal-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                {submitStatus.message}
              </div>
            )}

            <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl p-8 md:p-14 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-900/5 border border-white/50">
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-100/40 via-teal-100/30 to-cyan-100/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-gradient-to-tr from-cyan-100/40 via-blue-100/30 to-teal-100/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

              <div className="relative z-10">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all duration-300 text-base hover:border-blue-300"
                        required
                      />
                    </div>
                    <div className="group">
                      <label htmlFor="lastName" className="block text-sm font-semibold mb-2 text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all duration-300 text-base hover:border-blue-300"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all duration-300 text-base hover:border-blue-300"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="resize-none w-full bg-gray-50/50 border border-gray-200 rounded-xl p-4 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:outline-none transition-all duration-300 text-base min-h-[150px] hover:border-blue-300"
                      required
                    ></textarea>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="group relative w-full mt-6 bg-gradient-to-r from-blue-600 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-teal-500/40 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <Send className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                    <span className="relative z-10">{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                icon={<Phone className="w-6 h-6 text-blue-600" />}
                content="+19016022176"
                href="tel:+19016022176"
              />
              <ContactLinkItem
                title="X Platform"
                icon={<X className="w-6 h-6 text-blue-600" />}
                content="@steadfasthaven1"
                href="https://x.com/steadfasthaven1"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float-delayed {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float 20s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 25s ease-in-out infinite;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}