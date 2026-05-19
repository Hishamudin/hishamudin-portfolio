import { motion } from 'framer-motion';
import { useInView } from '../../hooks';
import { groupSkills } from '../../utils/cms';

function SkillBar({ name, level, icon, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-slate-300 text-sm font-medium font-body break-words">{name}</span>
        </div>
        <span className="text-accent-400 text-xs font-mono font-semibold">{level}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="skill-bar-fill"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1.2, delay: index * 0.07 + 0.3, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills({ cms }) {
  const [ref, inView] = useInView();
  const skillGroups = groupSkills(cms?.skills || []);
  const techStack = cms?.techStack || [];

  return (
    <section id="skills" className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-0 right-0 w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-accent-500/5 blur-3xl" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
            skills.map(proficiency)
          </div>
          <h2 className="section-heading text-white mb-4">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Technologies and tools managed from the portfolio CMS.
          </p>
        </motion.div>

        <div ref={ref} className="grid md:grid-cols-3 gap-8 mb-20">
          {skillGroups.map((category, ci) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: ci * 0.15 }}
              className="glass rounded-2xl p-6 gradient-border"
            >
              <h3 className="text-white font-display font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-500" />
                <span className="break-words">{category.category}</span>
              </h3>
              <div className="space-y-5">
                {category.items.map((skill, i) => (
                  <SkillBar key={`${category.category}-${skill.name}`} {...skill} index={i} inView={inView} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <p className="text-slate-500 text-sm font-mono mb-8">// Also proficient with</p>
            <div className="flex flex-wrap justify-center gap-3">
              {techStack.map((tech, i) => (
                <motion.div
                  key={tech._id || tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="glass px-4 py-2.5 rounded-xl border border-white/10 hover:border-accent-500/30 cursor-default flex items-center gap-2 transition-all duration-200 group"
                >
                  <span className="text-base" style={{ color: tech.color }}>{tech.symbol || tech.name?.slice(0, 2)}</span>
                  <span className="text-slate-300 text-sm font-body group-hover:text-white transition-colors break-words">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
