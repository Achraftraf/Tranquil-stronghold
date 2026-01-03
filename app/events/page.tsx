"use client"

import { useEffect, useState } from "react";
import { Filter, X } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";
import { EventCard } from "@/components/event-card";
import { EventCardSkeleton } from "@/components/event-card-skeleton";
import { FeaturedEvent } from "@/components/featured-event"; // Remove eventsData import
import { getEvents } from "@/lib/strapi"; // Import Event type
import { Event } from "@/types";

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState<Event[]>([]); // Now no conflict
  const [loading, setLoading] = useState(true); // Fixed typo: laoding -> loading

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


  return (
    <section className="w-full min-h-screen bg-white text-black max-w-5xl mx-auto px-8">
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
      </AnimatedSection>

      {/* Featured Event */}
      {!loading && featuredEvent && (
        <div className="w-full mx-auto px-6 py-8">
          <FeaturedEvent event={featuredEvent} />
        </div>
      )}

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

      {/* Events Grid */}
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
          <div className="text-center py-12 text-gray-500">
            No events found in this category.
          </div>
        )}
      </div>

      {/* CTA Section */}
      <AnimatedSection delay={0.6}>
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="relative overflow-hidden rounded-[3rem] bg-white p-8 md:p-16 text-center shadow-[0_30px_100px_-20px_rgba(59,130,246,0.15),0_10px_40px_-10px_rgba(0,0,0,0.05)] ring-1 ring-blue-900/5 isolation-auto">

            {/* Dynamic brand background effects */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[40rem] h-[40rem] bg-gradient-to-br from-blue-100/50 via-teal-100/40 to-cyan-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow mix-blend-multiply"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[35rem] h-[35rem] bg-gradient-to-tr from-cyan-100/50 via-blue-100/40 to-teal-100/30 rounded-full blur-3xl opacity-70 animate-pulse-slow [animation-delay:2s] mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-plus-darker pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-gray-900 leading-tight">
                Don't See What <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent decoration-clone pr-2 pb-1">You're Looking For?</span>
              </h2>

              <p className="text-xl mb-10 text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium">
                Stay updated with our latest events and programs by following us on social media
                or subscribing to our newsletter.
              </p>

              <div className="flex flex-wrap gap-5 justify-center">
                <a
                  href="https://www.instagram.com/thesfhaven"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex h-14 items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-600 to-teal-400 px-10 text-base font-bold text-white shadow-[0_10px_30px_-5px_rgba(37,99,235,0.4)] transition-all hover:shadow-[0_20px_40px_-5px_rgba(37,99,235,0.5)] hover:scale-[1.02]"
                >
                  <span className="relative z-10">Follow Us</span>
                </a>

                <a
                  href="https://www.eventbrite.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-14 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-10 text-base font-bold text-gray-700 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50/50 hover:text-blue-700 hover:scale-[1.02]"
                >
                  Subscribe
                </a>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
