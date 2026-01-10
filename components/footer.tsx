import { FaChevronRight } from "react-icons/fa";
import ContactLinkItem from "./contact-link-item";
import { Instagram, Mail, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 z-10">
      <div className="max-w-5xl mx-auto px-6 lg:px-4">
        <div className="py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500 order-2 md:order-1">
            © {new Date().getFullYear()} Steadfast Haven. All rights reserved.
          </div>

          {/* Center - Contact Links */}
          <div className="flex items-center gap-1 order-1 md:order-2">
            <ContactLinkItem
              icon={<Mail className="w-3.5 h-3.5" />}
              content="admin@steadfasthaven.com"
              href="mailto:admin@steadfasthaven.com"
            />
            <ContactLinkItem
              icon={<Instagram className="w-3.5 h-3.5" />}
              content="@thesfhaven"
              href="https://instagram.com/thesfhaven"
            />
            <ContactLinkItem
              icon={<X className="w-3.5 h-3.5" />}
              content="@steadfasthaven1"
              href="https://x.com/steadfasthaven1"
            />
          </div>

          {/* Right - Location */}
          <div className="text-xs text-gray-500 text-center md:text-right order-3">
            119 Racine Street, Suite 102, Memphis, TN 38111
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

export const ExternalLinkItem = ({
  href,
  label,
}: {
  href: string;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    className="text-blue-500 hover:text-blue-600 hover:underline hover:underline-offset-3 hover:decoration-1 transition-colors flex items-center text-sm gap-[0.8]"
  >
    <span>{label}</span>
    <FaChevronRight className="h-3 w-3 mt-[2px]" />
  </a>
);
