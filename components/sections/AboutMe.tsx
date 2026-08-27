import { aboutMe } from '@/lib/data';

export default function AboutMe() {
  return (
    <section className="text-right">
      {/* <h1 className="text-3xl font-semibold mb-1">{aboutMe.name}</h1> */}
      {/* <p className="text-neutral-500 mb-6">{aboutMe.role}</p> */}

      <div className="space-y-4 text-neutral-700 leading-relaxed">
        {aboutMe.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 mt-8 justify-end">
        {aboutMe.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm underline underline-offset-4 text-neutral-600 hover:text-neutral-900"
          >
            {link.label}
          </a>
        ))}
      </div>
    </section>
  );
}