import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { NAV_LINKS, resolveResumeUrl } from '../../utils/cms';

export default function Navbar({ cms }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const ownerName = cms?.settings?.ownerName || cms?.hero?.name || '';
  const resumeUrl = resolveResumeUrl(cms?.resume?.fileUrl || cms?.settings?.resumeUrl || cms?.hero?.resumeUrl);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 max-w-full overflow-x-hidden transition-all duration-300 ${
          scrolled ? 'glass-dark shadow-lg shadow-black/20' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            {/* Logo */}
            <motion.a
              href="/"
              className="min-w-0 truncate font-mono text-accent-400 font-semibold text-lg tracking-tight"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-slate-400">&lt;</span>
              {(ownerName.split(' ')[0] || 'portfolio').toLowerCase()}
              <span className="text-slate-400">/&gt;</span>
            </motion.a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group ${
                    activeSection === href.slice(1)
                      ? 'text-accent-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {label}
                  {activeSection === href.slice(1) && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-accent-500/10 rounded-lg border border-accent-500/20"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 btn-outline text-sm py-2">
                <Download size={14} />
                Resume
              </a>

              <button
                className="md:hidden p-2 text-slate-400 hover:text-white"
                onClick={() => setMobileOpen(p => !p)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 max-w-full overflow-x-hidden glass-dark border-b border-white/10 p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <button
                  key={label}
                  onClick={() => handleNavClick(href)}
                  className="text-left px-4 py-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  {label}
                </button>
              ))}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 mt-2 btn-primary text-sm justify-center"
              >
                <Download size={14} />
                Download Resume
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
