import { education } from '@/lib/data';

export default function Education() {
  return (
    <section className="text-right">
      {/* <h2 className="text-2xl font-semibold mb-6">Education</h2> */}
      <div className="space-y-6">
        {education.map((item) => (
          <div key={item.school}>
            <h3 className="font-medium">{item.school}</h3>
            <p className="text-sm text-neutral-400">{item.period}</p>
            <p className="text-neutral-600">{item.degree}</p>
            {item.details && (
              <p className="text-sm text-neutral-500 mt-1">{item.details}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}