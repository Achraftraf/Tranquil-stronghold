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
      <AnimatedSection delay={0.1} classNames="max-w-5xl mx-auto text-center py-10">
        <h2 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mb-4 text-blue-500">
          Upcoming Events
        </h2>
        <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
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
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-gray-300 hover:border-blue-500 transition-all"
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
                    ? "bg-blue-500 text-white shadow-lg"
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-12 text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Don't See What You're Looking For?</h2>
            <p className="text-xl mb-8 text-blue-50">
              Stay updated with our latest events and programs by following us on social media
              or subscribing to our newsletter.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg">
                Follow Us
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/10 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
