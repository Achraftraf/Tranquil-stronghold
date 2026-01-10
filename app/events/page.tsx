"use client"

import { useEffect, useState } from "react";
import { Filter, X, Calendar } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";
import { EventCard } from "@/components/event-card";
import { EventCardSkeleton } from "@/components/event-card-skeleton";
import { FeaturedEvent } from "@/components/featured-event"; // Remove eventsData import
import { getEvents } from "@/lib/strapi"; // Import Event type
import { Event } from "@/types";
import { ParticleBackground } from "@/components/particle-background";
import Link from 'next/link'

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]); // Now no conflict
  const [loading, setLoading] = useState(true); // Fixed typo: laoding -> loading
  const [rsvpFormData, setRsvpFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    attendees: "",
    dietary: "",
    message: "",
  });
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();
        console.log("Events are : ", data);
        setEvents(data); // This should work now
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents()
  }, [])

  const categories = ["All", "Art", "Film", "Music", "Festival"];
  const featuredEvent = events.find(e => e.featured);

  const filteredEvents = selectedCategory === "All"
    ? events.filter(e => !e.featured) // Exclude featured from main list
    : events.filter(e => e.category === selectedCategory && !e.featured);

  const handleRsvpChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setRsvpFormData({
      ...rsvpFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRsvp(true);
    setRsvpStatus(null);

    try {
      let fullMessage = "RSVP Registration Details:\n\n";
      fullMessage += `Name: ${rsvpFormData.name} ${rsvpFormData.lastName}\n`;
      fullMessage += `Email: ${rsvpFormData.email}\n`;
      if (rsvpFormData.phone) fullMessage += `Phone: ${rsvpFormData.phone}\n`;
      if (rsvpFormData.attendees) fullMessage += `Number of Attendees: ${rsvpFormData.attendees}\n`;
      if (rsvpFormData.dietary) fullMessage += `Dietary Restrictions: ${rsvpFormData.dietary}\n`;
      if (rsvpFormData.message) fullMessage += `\nAdditional Notes:\n${rsvpFormData.message}`;

      const response = await fetch("/.netlify/functions/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: rsvpFormData.name,
          lastName: rsvpFormData.lastName,
          email: rsvpFormData.email,
          message: fullMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRsvpStatus({
          type: "success",
          message: "RSVP submitted successfully! We'll confirm your registration soon.",
        });
        setRsvpFormData({ name: "", lastName: "", email: "", phone: "", attendees: "", dietary: "", message: "" });
      } else {
        setRsvpStatus({
          type: "error",
          message: data.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      setRsvpStatus({
        type: "error",
        message: "Failed to submit RSVP. Please try again later.",
      });
    } finally {
      setIsSubmittingRsvp(false);
    }
  };


  return (
    <section className="w-full min-h-screen bg-white text-black max-w-5xl mx-auto px-8">
    <ParticleBackground/>
      <AnimatedSection delay={0.1} classNames="max-w-5xl mx-auto text-center py-10 flex flex-col items-center">
        <span className="mb-6 inline-flex items-center justify-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold tracking-wide text-blue-600 ring-1 ring-inset ring-blue-600/20 transition-all hover:bg-blue-100 hover:scale-105 cursor-default shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          Community Calendar
        </span>

        <h2 className="text-5xl md:text-7xl font-black tracking-tighter max-w-4xl mb-6 text-gray-900 leading-tight">
          Upcoming <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent drop-shadow-sm pr-2 pb-1">Events</span>
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Join us in celebrating youth creativity through art, film, and music.
          Every event is a chance to learn, create, and connect.
        </p>

      {!loading && featuredEvent && (
        <div className="w-full mx-auto px-6 py-8">
          <FeaturedEvent event={featuredEvent} />
        </div>
      )}
      </AnimatedSection>


      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <AnimatedSection delay={0.4}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold">All Events</h2>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 hover:border-teal-500 transition-all"
            >
              {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
              <span className="font-medium">Filter</span>
            </button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === cat
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {loading ? (
          // Show skeletons while loading
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <EventCardSkeleton key={`skeleton-event-${index}`} index={index} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          // Show actual events when loaded
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500  border border-dashed rounded-3xl">
            No events found in this category.
          </div>
        )}
      </div>

      <AnimatedSection delay={0.6}>
        <div id="join-us" className="w-full mx-auto px-6 pt-10 sm:pt-14 lg:pb-16">

          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-gray-900">
              RSVP for an <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">Event</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
              Reserve your spot at one of our upcoming events. We'll send you a confirmation shortly.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-white p-10 md:p-14 text-center ring-1 ring-blue-900/20 isolation-auto  z-10">

            {rsvpStatus && (
              <div
                className={`p-4 rounded-xl text-sm mb-6 animate-slide-down ${
                  rsvpStatus.type === "success"
                    ? "bg-teal-50 text-teal-800 border border-teal-300"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {rsvpStatus.message}
              </div>
            )}

            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-100/50 via-teal-100/40 to-cyan-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow mix-blend-multiply -z-10"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-gradient-to-tr from-cyan-100/50 via-blue-100/40 to-teal-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow [animation-delay:2s] mix-blend-multiply -z-10"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-plus-darker pointer-events-none -z-10"></div>

              <form onSubmit={handleRsvpSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    name="name"
                    value={rsvpFormData.name}
                    onChange={handleRsvpChange}
                    placeholder="First Name *"
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base placeholder:text-gray-400"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={rsvpFormData.lastName}
                    onChange={handleRsvpChange}
                    placeholder="Last Name *"
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base placeholder:text-gray-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="email"
                    name="email"
                    value={rsvpFormData.email}
                    onChange={handleRsvpChange}
                    placeholder="Email Address *"
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base placeholder:text-gray-400"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={rsvpFormData.phone}
                    onChange={handleRsvpChange}
                    placeholder="Phone Number"
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base placeholder:text-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="number"
                    name="attendees"
                    value={rsvpFormData.attendees}
                    onChange={handleRsvpChange}
                    placeholder="Number of Attendees"
                    min="1"
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base placeholder:text-gray-400"
                  />
                  <input
                    type="text"
                    name="dietary"
                    value={rsvpFormData.dietary}
                    onChange={handleRsvpChange}
                    placeholder="Dietary Restrictions (if any)"
                    className="px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base placeholder:text-gray-400"
                  />
                </div>

                <textarea
                  name="message"
                  value={rsvpFormData.message}
                  onChange={handleRsvpChange}
                  rows={4}
                  placeholder="Additional notes or questions (Optional)"
                  className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-base resize-none placeholder:text-gray-400"
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmittingRsvp}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {isSubmittingRsvp ? "Submitting..." : "Submit RSVP"}
                </button>
              </form>

          </div>
        </div>
      </AnimatedSection>

      <style jsx>{`
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

        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
