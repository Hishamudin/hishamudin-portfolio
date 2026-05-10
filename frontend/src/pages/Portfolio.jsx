import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/ui/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Skills from '../components/sections/Skills';
import Experience from '../components/sections/Experience';
import Contact from '../components/sections/Contact';
import Testimonials from '../components/sections/Testimonials';
import Footer from '../components/ui/Footer';
import { useMousePosition } from '../hooks';
import api from '../utils/api';
import { applySeo } from '../utils/cms';

function CursorGlow() {
  const { x, y } = useMousePosition();
  return (
    <div
      className="cursor-glow"
      style={{ left: x, top: y }}
    />
  );
}

function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-dark-950 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 border-accent-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
          <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-primary-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <p className="text-slate-500 font-mono text-sm">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Initializing...
          </motion.span>
        </p>
      </div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [loading, setLoading] = useState(true);
  const [cms, setCms] = useState(null);

  const loadCms = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true);
    const { data } = await api.get('/cms/public');
    setCms(data);
    applySeo(data);
  }, []);

  useEffect(() => {
    let alive = true;
    loadCms(true)
      .catch(() => {})
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [loadCms]);

  useEffect(() => {
    const refresh = () => loadCms(false).catch(() => {});
    const onStorage = (event) => {
      if (event.key === 'portfolio_cms_updated') refresh();
    };
    window.addEventListener('portfolio:cms-updated', refresh);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('portfolio:cms-updated', refresh);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
    };
  }, [loadCms]);

  return (
    <>
      <AnimatePresence>{loading && <PageLoader />}</AnimatePresence>

      <CursorGlow />

      <div className="relative min-h-screen bg-dark-950">
        <Navbar cms={cms} />

        <main>
          <Hero cms={cms} />
          <About cms={cms} />
          <Projects projects={cms?.projects || []} />
          <Skills cms={cms} />
          <Experience cms={cms} />
          <Testimonials testimonials={cms?.testimonials || []} />
          <Contact cms={cms} />
        </main>

        <Footer cms={cms} />
      </div>
    </>
  );
}
