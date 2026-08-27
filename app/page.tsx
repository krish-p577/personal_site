'use client';


// import dynamic from 'next/dynamic';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SectionRenderer from '@/components/SectionRenderer';
import type { SectionKey } from '@/lib/types';

// How long the CSS opacity transition takes (ms). Must match the
// `duration-*` class used on the content wrapper below.
const TRANSITION_MS = 250;

// adding shaders
// const ShaderSphereBackground = dynamic(() => import('@/app/ShaderSphereBackground'), { ssr: false });

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionKey>('about');
  const [displayedSection, setDisplayedSection] = useState<SectionKey>('about');
  const [isVisible, setIsVisible] = useState(true);

  function handleNavigate(section: SectionKey) {
    if (section === activeSection) return;

    setActiveSection(section);
    setIsVisible(false); // start fade out

    window.setTimeout(() => {
      setDisplayedSection(section); // swap content while invisible
      setIsVisible(true); // fade back in
    }, TRANSITION_MS);
  }

  return (

<main className="min-h-screen w-full flex flex-col md:flex-row bg-white/0 text-neutral-900">
        <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      <div className="flex-1 px-8 py-10 md:px-20 md:py-16 flex items-start md:items-center justify-end">
        <div
          className={`w-full max-w-2xl transition-opacity duration-[250ms] ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <SectionRenderer section={displayedSection} />
        </div>
      </div>
    </main>

  );
}