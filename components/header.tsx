"use client"

import { inter } from '@/fonts';
import React, { useState } from 'react'
import Link from 'next/link'
import Logo from '@/public/logo.png'
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaDonate } from 'react-icons/fa';
import { NavItem } from './nav-item';
import { HiOutlineMenuAlt4 } from 'react-icons/hi';
import { IoMdClose } from 'react-icons/io';

const Header = () => {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  return (
    <div className={`sticky top-0 left-0 right-0 z-40 border-b border-black/15 w-full px-3 ${inter.className} bg-gradient-to-r from-white via-transparent to-white bg-opacity-10 backdrop-blur-md`}>
      <div className='max-w-4xl mx-auto flex flex-row items-center justify-between text-xs'>
        <Link href={"/"} className='flex flex-row items-center gap-2 cursor-pointer' >
          <Image src={Logo} alt="Steadfast haven logo" width={32} height={32} style={{ borderRadius: '8px', border: '1px solid #aaa' }} />
          <h1 className='text-xl font-[600] py-1'>
            Steadfast Haven
          </h1>
        </Link>
        <ul className={`text-md hidden sm:flex flex-row gap-6 font-thin text-black`}>
          <NavItem href="/about" url={pathname} label="About" />
          <NavItem href="/events" url={pathname} label="Events" />
          <NavItem href="/work" url={pathname} label="Work" />
          <NavItem href="/contact" url={pathname} label="Contact" />
          <Link target='_blank' href={"https://givebutter.com/auElnc"} className='text-white border border-blue-600 bg-blue-500 my-3 rounded-full px-2 py-1 flex flexrow items-center gap-1 hover:bg-blue-600'>
            <FaDonate />
            <span>
              Donate
            </span>
          </Link>
        </ul>
        <button onClick={() => setOpen(true)} className='sm:hidden'>
          <HiOutlineMenuAlt4 className='h-6 w-6' />
        </button>
        {open && (
          <div className='sm:hidden absolute top-0 right-0 left-0 w-full border bg-white border border-neutral-300 shadow-lg'>
            <button onClick={() => setOpen(!open)} className='absolute top-3 right-3'>
              <IoMdClose className='h-6 w-6' />
            </button>
            <ul className='flex flex-col items-start justify-center w-40 py-4 px-4 gap-2 text-lg'>
              <NavItem href="/team" url={pathname} label="Team" />
              <NavItem href="/about" url={pathname} label="About" />
              <NavItem href="/events" url={pathname} label="Events" />
              <NavItem href="/work" url={pathname} label="Work" />
              <NavItem href="/contact" url={pathname} label="Contact" />
              <Link target='_blank' href={"https://givebutter.com/auElnc"} className='text-white border border-blue-600 bg-blue-500 my-3 rounded-full px-2 py-1 flex flexrow items-center gap-1 hover:bg-blue-600'>
                <FaDonate />
                <span>
                  Donate
                </span>
              </Link>
            </ul>
          </div>
        )}
      </div>
    </div>)
}

export default Header;
