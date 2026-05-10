import { motion } from 'framer-motion';
import { Award, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { useInView } from '../../hooks';

function TimelineItem({ item, index }) {
  const [ref, inView] = useInView();
  const isEducation = item.type === 'education';

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`relative flex gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-row`}
    >
      <div className="relative flex-shrink-0">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
          isEducation ? 'bg-primary-500/15 border-primary-500/30 text-primary-400' : 'bg-accent-500/15 border-accent-500/30 text-accent-400'
        }`}>
          {isEducation ? <GraduationCap size={20} /> : <Briefcase size={20} />}
        </div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-accent-500/30 to-transparent" />
      </div>

      <div className="flex-1 pb-10 md:max-w-md">
        <div className="glass rounded-2xl p-6 gradient-border hover:shadow-glow-sm transition-all duration-300">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-1">
            <h3 className="font-display font-semibold text-white text-lg">{item.title}</h3>
            <span className="text-accent-400 font-mono text-xs px-2 py-1 rounded-md bg-accent-500/10 border border-accent-500/20">
              {item.period}
            </span>
          </div>

          <p className="text-slate-400 font-medium text-sm mb-3 flex items-center gap-1.5">
            <MapPin size={12} className="text-accent-500" />
            {item.company}
          </p>

          {item.role && <p className="text-slate-300 text-sm font-body mb-2">{item.role}</p>}
          {item.description && <p className="text-slate-400 text-sm leading-relaxed mb-4 font-body">{item.description}</p>}

          {item.bullets?.length > 0 && (
            <ul className="space-y-2 mb-4">
              {item.bullets.map(bullet => (
                <li key={bullet} className="text-slate-400 text-sm font-body flex gap-2">
                  <span className="text-accent-400 mt-1">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="flex flex-wrap gap-2">
            {item.tags?.map(tag => <span key={tag} className="tech-tag">{tag}</span>)}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Experience({ cms }) {
  const timeline = [
    ...(cms?.experience || []),
    ...(cms?.education || []).map(edu => ({
      _id: edu._id,
      type: 'education',
      title: edu.degree,
      company: edu.institution,
      period: edu.period,
      description: edu.grade,
      bullets: edu.details,
      tags: [edu.grade].filter(Boolean),
      order: edu.order,
    })),
  ].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section id="experience" className="py-24 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary-500/5 blur-3xl" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
            career.timeline()
          </div>
          <h2 className="section-heading text-white mb-4">
            Journey & <span className="text-gradient">Education</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Professional experience, academic background, and certifications.
          </p>
        </motion.div>

        <div className="space-y-2">
          {timeline.map((item, i) => (
            <TimelineItem key={item._id || `${item.title}-${i}`} item={item} index={i} />
          ))}
        </div>

        {cms?.certifications?.length > 0 && (
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {cms.certifications.map(cert => (
              <div key={cert._id} className="glass rounded-2xl p-5 border border-white/5">
                <Award size={20} className="text-accent-400 mb-3" />
                <h3 className="text-white font-display font-semibold">{cert.title}</h3>
                <p className="text-slate-500 text-sm font-body mt-1">{cert.issuer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
