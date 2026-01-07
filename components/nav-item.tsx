import React from 'react'

interface NavItemProps {
  href: string;
  url: string;
  label: string;
}

export const NavItem: React.FC<NavItemProps> = ({ href, url, label }) => {
  const isActive = href === url;
  return (
    <li className={`py-5 ${isActive ? "border-b-2 border-teal-500 font-medium text-teal-600" : "text-neutral-600 hover:text-teal-600 transition-colors"}`}>
      <a href={href}>
        {label}
      </a>
    </li>
  );
}
