import { useState } from "react";
import { Event } from "@/types";
import { Calendar, Clock, MapPin } from "lucide-react";

export const FeaturedEvent = ({ event }: { event: Event }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
      <div className="w-full text-start relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-40">
          <img
            src={event.image}
            alt={event.title}
            className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        <div className="relative z-10 p-8 md:p-12 lg:p-16 text-white">
          <div className="inline-block bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-1 rounded-full text-sm font-semibold mb-4 shadow-lg shadow-teal-500/20">
            Next Featured Event
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 max-w-3xl">
            {event.title}
          </h2>

          <p className="text-lg text-gray-200 mb-6 max-w-2xl leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-6 mb-8 text-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>{event.location}</span>
            </div>
          </div>
          <a
          href="https://docs.google.com/forms/d/e/1FAIpQLSc7sCv5f35LvLNNqXc_XzK2fNKGMniHx3hmFkwZHve0IOpAew/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold text-lg hover:bg-teal-50 transition-all shadow-lg hover:shadow-xl hover:text-teal-600">
            Register Now
          </a>
        </div>
      </div>
  );
};
