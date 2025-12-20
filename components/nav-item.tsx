import React from 'react'

interface NavItemProps {
  href: string;
  url: string;
  label: string;
}

export const NavItem: React.FC<NavItemProps> = ({ href, url, label }) => {
  const isActive = href === url;
  return (
    <li className={`py-5 ${isActive ? "border-b" : "text-neutral-600 hover:text-black"}`}>
      <a href={href}>
        {label}
      </a>
    </li>
  );
}
