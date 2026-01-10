const ContactLinkItem = ({
  icon,
  content,
  href,
}: {
  icon: React.ReactNode;
  content: string;
  href: string;
}) => {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-all duration-200"
    >
      <div className="text-gray-500 group-hover:text-gray-900 transition-colors duration-200">
        {icon}
      </div>
      <span className="text-xs text-gray-500 group-hover:text-gray-900 transition-colors duration-200">
        {content}
      </span>
    </a>
  );
};

export default ContactLinkItem;
