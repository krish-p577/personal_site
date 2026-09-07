import { experience } from '@/lib/data';

export default function Experience() {
  return (
    <section className="text-right">
      {/* <h2 className="text-2xl font-semibold mb-6">Experience</h2> */}
      <div className="space-y-8 whitespace-pre-line">
        {experience.map((item) => (
          <div key={`${item.company}-${item.period}`}>
            <h3 className="font-medium">
              {item.role} <span className="text-neutral-700 whitespace-pre-line">· {item.company}</span>
            </h3>
            <p className="text-sb text-neutral-400">{item.period}</p>
            <ul className="mt-2 space-y-1 text-neutral-600 text-sm">
              {item.bullets.map((bullet, i) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}