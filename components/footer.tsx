
import Link from 'next/link'
import React from 'react'
import { FaChevronRight } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="w-full text-neutral-500 text-sm p-6 bg-gray-50 border-t border-gray-400/50">
      <div className='max-w-4xl mx-auto pt-4 flex flex-col md:flex-row items-center justify-between gap-2'>
        <p className="text-center text-xs">
          &copy; {new Date().getFullYear()} Steadfast Haven. All rights reserved.
        </p>

        <p className="text-center text-xs">
          Based in 119 Racine Street, Suite 102, Memphis, TN 38111
        </p>
      </div>
    </footer>
  )
}

export default Footer

export const ExternalLinkItem = ({ href, label }: { href: string, label: string }) => (
  <a href={href} target='_blank' className="text-blue-500 hover:text-blue-600 hover:underline hover:underline-offset-3 hover:decoration-1 transition-colors flex items-center text-sm gap-[0.8]">
    <span>
      {label}
    </span>
    <FaChevronRight className='h-3 w-3 mt-[2px]' />
  </a>
)
