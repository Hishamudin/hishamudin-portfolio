import { motion } from 'framer-motion';
import { MapPin, Mail, Calendar, ExternalLink } from 'lucide-react';
import { useInView, useCountUp } from '../../hooks';
import { cacheBustAsset, socialUrl } from '../../utils/cms';

function StatCard({ value, label, index }) {
  const [ref, inView] = useInView();
  const count = useCountUp(Number(value) || 0, 1600, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="text-center p-6 glass rounded-2xl gradient-border"
    >
      <div className="text-3xl font-bold text-gradient font-display">{count}</div>
      <div className="text-slate-400 text-sm mt-1 font-body">{label}</div>
    </motion.div>
  );
}

export default function About({ cms }) {
  const [ref, inView] = useInView();
  const about = cms?.about || {};
  const hero = cms?.hero || {};
  const contact = cms?.contactInfo || {};
  const github = socialUrl(cms?.socialLinks, 'github');
  const profileImage = cacheBustAsset(hero.profileImage, hero.updatedAt);
  const initials = (hero.name || '').split(' ').map(part => part[0]).join('').slice(0, 2);

  return (
    <section id="about" className="py-24 relative bg-dark-900">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 mx-auto lg:mx-0">
              <div className="absolute inset-0 rounded-full border border-accent-500/20 animate-spin-slow" />
              <div className="absolute inset-4 rounded-full border border-primary-400/15" />
              <div className="absolute inset-8 rounded-full glass overflow-hidden flex items-center justify-center bg-gradient-to-br from-accent-500/20 to-primary-500/20">
                {profileImage ? (
                  <img src={profileImage} alt={hero.name || 'Profile'} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="text-7xl select-none font-display font-bold text-accent-300">{initials}</div>
                )}
              </div>

              {hero.availability && (
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-2 -right-4 glass px-3 py-2 rounded-xl text-sm border border-green-500/30"
                >
                  <span className="text-green-400">● </span>
                  <span className="text-slate-300 font-mono text-xs">{hero.availability}</span>
                </motion.div>
              )}

              {hero.location && (
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute -bottom-2 -left-4 glass px-3 py-2 rounded-xl text-sm border border-accent-500/30"
                >
                  <span className="text-accent-400 font-mono text-xs">{hero.location}</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
              about_me.json
            </div>

            <h2 className="section-heading text-white mb-6">
              {about.heading || 'About'} <span className="text-gradient">Profile</span>
            </h2>

            <div className="space-y-4 text-slate-400 font-body leading-relaxed">
              {(about.body || '').split('\n\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              {[
                { icon: MapPin, text: contact.location || hero.location },
                { icon: Mail, text: contact.email },
                { icon: Calendar, text: hero.availability },
              ].filter(item => item.text).map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-slate-400">
                  <div className="p-1.5 rounded-md bg-accent-500/10 text-accent-400">
                    <Icon size={14} />
                  </div>
                  <span className="text-sm font-body">{text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {github && (
                <a href={github} target="_blank" rel="noopener noreferrer" className="btn-primary flex items-center gap-2 text-sm">
                  <ExternalLink size={14} />
                  GitHub Profile
                </a>
              )}
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="btn-outline text-sm">
                  Say Hello
                </a>
              )}
            </div>
          </motion.div>
        </div>

        {(about.stats || []).length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
            {about.stats.map((s, i) => (
              <StatCard key={s.label} value={s.value} label={s.label} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
