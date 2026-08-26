import { projects } from '@/lib/data';

export default function Projects() {
  return (
    <section className="text-right">
      <h2 className="text-2xl font-semibold mb-6">Projects</h2>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.title}>
            <h3 className="font-medium">{project.title}</h3>
            <p className="text-neutral-600 text-sm mt-1">{project.description}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-end">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600"
                >
                  {tech}
                </span>
              ))}
            </div>
            {project.link && (
              <a
                href={project.link}
                className="text-sm underline underline-offset-4 text-neutral-500 hover:text-neutral-900 mt-2 inline-block"
              >
                View →
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}