// import { Calendar, MapPin, Clock, Users } from "lucide-react";
// import { AnimatedSection } from "@/components/animations/animated-section";
// import { Event } from "@/types";
//
// interface Props {
//   event: Event;
//   index: number;
// }
//
// export const EventCard = ({ event, index }: Props) => {
//
//   return (
//     <AnimatedSection delay={index * 0.1} classNames="group">
//       <div className="bg-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-500 border border-gray-200">
//         <div className="relative h-64 overflow-hidden bg-gray-100">
//           <img
//             src={event.image}
//             alt={event.title}
//             className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110`}
//           />
//           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-blue-600">
//             {event.category}
//           </div>
//           {event.featured && (
//             <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
//               Featured
//             </div>
//           )}
//         </div>
//
//         <div className="p-6">
//           <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
//             {event.title}
//           </h3>
//
//           <div className="space-y-2 mb-4 text-gray-600">
//             <div className="flex items-center gap-2">
//               <Calendar className="w-4 h-4 text-blue-500" />
//               <span className="text-sm">{event.date}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4 text-blue-500" />
//               <span className="text-sm">{event.time}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <MapPin className="w-4 h-4 text-blue-500" />
//               <span className="text-sm">{event.location}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Users className="w-4 h-4 text-blue-500" />
//               <span className="text-sm">{event.attendees}</span>
//             </div>
//           </div>
//
//           <p className="text-gray-700 mb-4 leading-relaxed">
//             {event.description}
//           </p>
//         </div>
//       </div>
//     </AnimatedSection>
//   );
// };
//

import { Calendar, MapPin, Clock, Users } from "lucide-react";
import { AnimatedSection } from "@/components/animations/animated-section";
import { Event } from "@/types";

interface Props {
  event?: Event;
  index: number;
  loading?: boolean;
}

export const EventCard = ({ event, index, loading = false }: Props) => {
  return (
    <AnimatedSection delay={index * 0.1} classNames="group">
      <div className="bg-gray-100 rounded-3xl overflow-hidden hover:shadow-md transition-all duration-500 border border-gray-200">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {loading ? (
            <div className="w-full h-full bg-gray-300 animate-pulse" />
          ) : (
            <img
              src={event?.image}
              alt={event?.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
            />
          )}

          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-blue-600">
            {loading ? (
              <div className="h-4 w-12 bg-gray-300 rounded animate-pulse" />
            ) : (
              event?.category
            )}
          </div>

          {(loading || event?.featured) && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {loading ? (
                <div className="h-4 w-16 bg-blue-400 rounded animate-pulse" />
              ) : (
                "Featured"
              )}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-3 group-hover:text-blue-600 transition-colors">
            {loading ? (
              <div className="h-7 bg-gray-300 rounded w-3/4 animate-pulse" />
            ) : (
              event?.title
            )}
          </h3>

          <div className="space-y-2 mb-4 text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              {loading ? (
                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse" />
              ) : (
                <span className="text-sm">{event?.date}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              {loading ? (
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse" />
              ) : (
                <span className="text-sm">{event?.time}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              {loading ? (
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse" />
              ) : (
                <span className="text-sm">{event?.location}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              {loading ? (
                <div className="h-4 bg-gray-300 rounded w-16 animate-pulse" />
              ) : (
                <span className="text-sm">{event?.attendees}</span>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-300 rounded w-4/6 animate-pulse" />
              </div>
            ) : (
              event?.description
            )}
          </p>
        </div>
      </div>
    </AnimatedSection>
  );
};
