import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, ArrowUp } from 'lucide-react';
import { NAV_LINKS, socialUrl } from '../../utils/cms';

export default function Footer({ cms }) {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const ownerName = cms?.settings?.ownerName || cms?.hero?.name || '';
  const email = cms?.contactInfo?.email || cms?.settings?.contactEmail || '';
  const socials = [
    { href: socialUrl(cms?.socialLinks, 'github'), icon: Github, label: 'GitHub' },
    { href: socialUrl(cms?.socialLinks, 'linkedin'), icon: Linkedin, label: 'LinkedIn' },
    { href: email ? `mailto:${email}` : socialUrl(cms?.socialLinks, 'email'), icon: Mail, label: 'Email' },
  ].filter(item => item.href);

  return (
    <footer className="bg-dark-950 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="font-mono text-accent-400 font-semibold text-xl mb-3 break-all">
              <span className="text-slate-500">&lt;</span>
              {(ownerName.split(' ')[0] || 'portfolio').toLowerCase()}
              <span className="text-slate-500">/&gt;</span>
            </div>
            <p className="text-slate-500 text-sm font-body leading-relaxed max-w-xs break-words">
              {cms?.hero?.summary}
            </p>
          </div>

          <div>
            <h4 className="text-slate-300 font-mono text-xs uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <button
                    onClick={() => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-slate-500 hover:text-accent-400 text-sm transition-colors font-body"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-300 font-mono text-xs uppercase tracking-widest mb-4">Connect</h4>
            <div className="flex gap-3 mb-4">
              {socials.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-2.5 glass rounded-lg text-slate-400 hover:text-accent-400 border border-white/10 hover:border-accent-500/30 transition-all"
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </div>
            <p className="text-slate-500 text-sm font-body break-all">{email}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/5 gap-4">
          <p className="text-slate-600 text-sm font-body flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-center sm:text-left">
            Built with <Heart size={12} className="text-red-500/70" fill="currentColor" /> by {ownerName} · {new Date().getFullYear()}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-slate-700 text-xs font-mono">React · Node.js · MongoDB</span>
            <motion.button
              onClick={scrollTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 glass rounded-lg text-slate-400 hover:text-accent-400 border border-white/10 hover:border-accent-500/30 transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
