import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Maximize2, Star, X } from 'lucide-react';
import { cacheBustAsset, normalizeExternalUrl } from '../../utils/cms';

const CATEGORIES = ['all', 'fullstack', 'frontend', 'backend', 'mobile', 'ai/ml', 'data', 'other'];

const CATEGORY_COLORS = {
  frontend: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  backend: 'text-green-400 bg-green-400/10 border-green-400/20',
  fullstack: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  mobile: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'ai/ml': 'text-pink-400 bg-pink-400/10 border-pink-400/20',
  data: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  devops: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  other: 'text-slate-400 bg-slate-400/10 border-slate-400/20',
};

const normalizeProject = (project) => ({
  ...project,
  technologies: project.technologies?.length ? project.technologies : project.techStack || [],
  image: project.image || project.images?.[0] || '',
  githubUrl: normalizeExternalUrl(project.githubUrl || project.githubLink || project.github || ''),
  liveDemoUrl: normalizeExternalUrl(project.liveDemoUrl || project.liveDemo || project.demoUrl || ''),
});

function ProjectImage({ project, large = false }) {
  const image = cacheBustAsset(project.image, project.updatedAt);
  return (
    <div className={`${large ? 'h-64 sm:h-80' : 'h-48'} relative overflow-hidden bg-gradient-to-br from-dark-700 to-dark-800`}>
      {image ? (
        <img
          src={image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading={large ? 'eager' : 'lazy'}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl opacity-20 font-display font-bold text-accent-400 select-none">
            {project.title?.charAt(0)}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/10 to-transparent" />
    </div>
  );
}

function ProjectLinks({ project, compact = false }) {
  return (
    <div className={`flex flex-col min-[420px]:flex-row flex-wrap gap-2 ${compact ? '' : 'pt-4 border-t border-white/5'}`}>
      {project.liveDemoUrl && (
        <a
          href={project.liveDemoUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-500 px-3 py-2 text-xs font-medium text-white hover:bg-accent-600 transition-colors"
        >
          <ExternalLink size={14} />
          Live Demo
        </a>
      )}
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 hover:border-accent-500/50 hover:text-accent-300 transition-colors"
        >
          <Github size={14} />
          GitHub Repository
        </a>
      )}
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      onClick={() => onOpen(project)}
      className="group relative glass rounded-2xl overflow-hidden border border-white/5 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:border-accent-500/30 hover:shadow-glow"
    >
      {project.featured && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-accent-500/20 border border-accent-500/30 text-accent-200 text-xs font-mono backdrop-blur">
          <Star size={11} fill="currentColor" /> Featured
        </div>
      )}

      <ProjectImage project={project} />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-start justify-between gap-3 mb-3">
          <h3 className="font-display font-semibold text-white text-xl leading-snug group-hover:text-accent-100 transition-colors break-words">
            {project.title}
          </h3>
          <span className={`w-fit text-xs px-2 py-1 rounded-full border font-mono capitalize shrink-0 ${CATEGORY_COLORS[project.category] || CATEGORY_COLORS.other}`}>
            {project.category || 'other'}
          </span>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-5 line-clamp-3 font-body">
          {project.shortDescription || project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.slice(0, 5).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {project.technologies.length > 5 && (
            <span className="tech-tag text-slate-500">+{project.technologies.length - 5}</span>
          )}
        </div>

        <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-3">
          <ProjectLinks project={project} compact />
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onOpen(project); }}
            className="min-[420px]:ml-auto inline-flex items-center justify-center gap-1.5 text-xs font-mono text-slate-500 hover:text-accent-300 transition-colors"
          >
            <Maximize2 size={13} />
            Details
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-4 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl bg-dark-800 border border-white/10 shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 p-2 rounded-lg bg-black/40 text-slate-300 hover:text-white hover:bg-black/60 transition-colors"
          aria-label="Close project details"
        >
          <X size={18} />
        </button>

        <ProjectImage project={project} large />

        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white break-words">{project.title}</h3>
              <p className="text-slate-500 text-xs font-mono mt-2 capitalize">{project.category} · {project.status}</p>
            </div>
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent-500/15 border border-accent-500/30 text-accent-300 text-xs font-mono">
                <Star size={12} fill="currentColor" /> Featured
              </span>
            )}
          </div>

          <p className="text-slate-300 leading-relaxed font-body whitespace-pre-wrap break-words mb-6">
            {project.detailedDescription || project.description}
          </p>

          <div className="mb-6">
            <h4 className="text-white font-display font-semibold mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => <span key={tech} className="tech-tag">{tech}</span>)}
            </div>
          </div>

          <ProjectLinks project={project} />
        </div>
      </motion.div>
    </div>
  );
}

export default function Projects({ projects = [] }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const normalizedProjects = useMemo(() => projects.map(normalizeProject), [projects]);
  const visibleCategories = CATEGORIES.filter(cat => cat === 'all' || normalizedProjects.some(project => project.category === cat));
  const filtered = activeFilter === 'all'
    ? normalizedProjects
    : normalizedProjects.filter(project => project.category === activeFilter);

  return (
    <section id="projects" className="py-24 bg-dark-950 relative">
      <div className="absolute inset-0 grid-bg opacity-15" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
            Featured Projects
          </div>
          <h2 className="section-heading text-white mb-4">
            Things I've <span className="text-gradient">Built</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            A recruiter-friendly view of practical systems, automation work, and full-stack builds.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {visibleCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-mono capitalize transition-all duration-200 border ${
                activeFilter === cat
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'glass border-white/10 text-slate-400 hover:text-white hover:border-accent-500/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => (
              <ProjectCard
                key={project._id || project.title}
                project={project}
                index={index}
                onOpen={setSelectedProject}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="font-mono">No projects in this category yet.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
