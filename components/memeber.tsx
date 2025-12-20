import React from 'react'
import Image from "next/image";
import Link from 'next/link';
import { TeamMember } from '@/types';


const Member: React.FC<TeamMember> = ({ name, role, instagram, description, image }) => (
  <div className="group flex flex-col h-full  rounded-3xl bg-zinc-100 transition-all duration-500 ease-out border-[1px] border-zinc-300">
    <div className="relative rounded-t-3xl overflow-hidden w-full h-[230px] sm:h-[250px]">
      <Image
        src={image}
        alt={name}
        fill
        className="object-cover object-center group-hover:scale-[1.05] transition-all duration-500 ease-out"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
      />
      <div className="absolute top-[80%] h-1/4 inset-0 bg-gradient-to-b from-transparent via-zinc-100/50 to-zinc-100/95 border-none" />
    </div>

    <div className="p-3 md:p-4 flex-1 flex flex-col">
      <h2 className="mb-1.5 text-2xl font-bold tracking-[-0.03em] text-[#1d1d1f] md:text-2xl">
        {role}
      </h2>
      <div className='mb-3'>
        <p className="inline mr-4 text-sm font-medium tracking-[0.012em] text-[#86868b] md:text-base">
          {name}
        </p>
        {
          instagram && (
            <Link href={`https://instagram.com/${instagram}`} target="_blank" className='text-sm font-bold text-blue-500 hover:underline hover:decoration-2'>
              {instagram}
            </Link>
          )
        }
      </div>
      <p className="text-sm leading-relaxed tracking-[-0.022em] text-[#6e6e73] md:text-sm">
        {description}
      </p>
    </div>
  </div>
);

export default Member;
