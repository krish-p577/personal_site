'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SectionRenderer from '@/components/SectionRenderer';
import VantaBirdsBackground from '@/components/VantaBirdsBackground';
import type { SectionKey } from '@/lib/types';


// transition length, lowkey might break if too short
const TRANSITION_MS = 250;

export default function Home() {
  const [activeSection, setActiveSection] = useState<SectionKey>('about');
  const [displayedSection, setDisplayedSection] = useState<SectionKey>('about');
  const [isVisible, setIsVisible] = useState(true);

  function handleNavigate(section: SectionKey) {
    if (section === activeSection) return;

    // start fade out
    setActiveSection(section);
    setIsVisible(false); 


    //fade in
    window.setTimeout(() => {
      setDisplayedSection(section); 
      setIsVisible(true); 
    }, TRANSITION_MS);
  }

  return (
    <>
      <VantaBirdsBackground />

      {/* bg-white/0 keeps the shell transparent so the Vanta canvas
          (fixed, zIndex: -1) shows through everywhere behind it. */}
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
    </>
  );
}