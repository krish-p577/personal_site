'use client';

import type { SectionKey } from '@/lib/types';
import { aboutMe } from '@/lib/data';

const NAV_ITEMS: { key: SectionKey; label: string }[] = [
  { key: 'about', label: 'About' },
  { key: 'education', label: 'Education' },
  { key: 'experience', label: 'Experience' },
  { key: 'projects', label: 'Projects' },
  { key: 'blog', label: 'Blog' },
];

type SidebarProps = {
  activeSection: SectionKey;
  onNavigate: (section: SectionKey) => void;
};

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 shrink-0 px-8 py-10 md:pl-16 md:pr-8 md:py-16 flex md:flex-col gap-8 md:gap-12">
      <div>
        <h2 className="text-4xl font-normal leading-tight text-neutral-900 whitespace-nowrap">
          {aboutMe.name}
        </h2>
      </div>

      <nav
        className="flex md:flex-col md:flex-1 md:justify-center md:-translate-y-19 gap-5 -ml-1"
        aria-label="Section navigation"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`text-left pl-3 py-1.5 text-sm md:text-base border-l-2
                          transition-colors duration-200 focus-visible:outline
                          focus-visible:outline-2 focus-visible:outline-offset-2
                          focus-visible:outline-neutral-900
                          ${
                            isActive
                              ? 'border-neutral-900 text-neutral-900 font-medium'
                              : 'border-transparent text-neutral-400 hover:text-neutral-600'
                          }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}