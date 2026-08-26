import type { SectionKey } from '@/lib/types';
import AboutMe from '@/components/sections/AboutMe';
import Education from '@/components/sections/Education';
import Experience from '@/components/sections/Experience';
import Projects from '@/components/sections/Projects';
import Blog from '@/components/sections/Blog';

export default function SectionRenderer({ section }: { section: SectionKey }) {
  switch (section) {
    case 'about':
      return <AboutMe />;
    case 'education':
      return <Education />;
    case 'experience':
      return <Experience />;
    case 'projects':
      return <Projects />;
    case 'blog':
      return <Blog />;
    default:
      return null;
  }
}