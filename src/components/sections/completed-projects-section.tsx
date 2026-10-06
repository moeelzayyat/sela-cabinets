import Image from 'next/image'

import { completedProjects } from '@/config/social-proof'

export function CompletedProjectsSection({ city }: { city?: string } = {}) {
  const projects = city
    ? completedProjects.filter((project) => project.city === city)
    : completedProjects

  if (projects.length === 0) return null

  return (
    <section className="section-padding bg-white" aria-labelledby="completed-projects-title">
      <div className="container-wide">
        <h2 id="completed-projects-title" className="font-display text-3xl font-bold text-charcoal-900 md:text-4xl">
          Completed SELA Projects{city ? ` in ${city}` : ''}
        </h2>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {projects.map((project) => (
            <article key={project.slug} className="overflow-hidden rounded-2xl border border-charcoal-200 bg-charcoal-50">
              <div className="grid grid-cols-2">
                <Image src={project.beforeImage} alt={`Before: ${project.imageAlt}`} width={800} height={600} className="aspect-[4/3] h-full w-full object-cover" />
                <Image src={project.afterImage} alt={`After: ${project.imageAlt}`} width={800} height={600} className="aspect-[4/3] h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{project.city} · {project.cabinetStyle}</p>
                <p className="mt-3 leading-7 text-charcoal-700">{project.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
