import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { ArrowDown, Github, Linkedin, Mail, Sparkles, Download } from 'lucide-react';
import { cacheBustAsset, resolveResumeUrl, socialUrl } from '../../utils/cms';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
});

const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  duration: Math.random() * 20 + 10,
  delay: Math.random() * 5,
}));

export default function Hero({ cms }) {
  const canvasRef = useRef(null);
  const hero = cms?.hero || {};
  const contact = cms?.contactInfo || {};
  const resumeUrl = resolveResumeUrl(cms?.resume?.fileUrl || hero.resumeUrl || cms?.settings?.resumeUrl);
  const nameParts = (hero.name || '').split(' ').filter(Boolean);
  const firstName = nameParts[0] || '';
  const restName = nameParts.slice(1).join(' ');
  const profileImage = cacheBustAsset(hero.profileImage, hero.updatedAt);
  const typingSequence = (hero.typingRoles?.length ? hero.typingRoles : [hero.title].filter(Boolean))
    .flatMap(role => [role, 2500]);
  const socials = [
    { href: socialUrl(cms?.socialLinks, 'github'), icon: Github, label: 'GitHub' },
    { href: socialUrl(cms?.socialLinks, 'linkedin'), icon: Linkedin, label: 'LinkedIn' },
    { href: contact.email ? `mailto:${contact.email}` : socialUrl(cms?.socialLinks, 'email'), icon: Mail, label: 'Email' },
  ].filter(item => item.href);

  // Subtle floating particles canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(139,92,246,${0.05 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  const scrollToAbout = () => document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-56 h-56 sm:w-96 sm:h-96 rounded-full bg-accent-500/10 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-52 h-52 sm:w-80 sm:h-80 rounded-full bg-primary-500/8 blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[600px] sm:h-[600px] rounded-full bg-accent-600/5 blur-3xl" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {profileImage && (
          <motion.div {...fadeUp(0.1)} className="mx-auto mb-6 h-32 w-32 sm:h-40 sm:w-40 rounded-full p-1 bg-gradient-to-br from-accent-400 via-primary-400 to-neon-cyan shadow-glow">
            <img
              src={profileImage}
              alt={hero.name || 'Profile'}
              className="h-full w-full rounded-full object-cover bg-dark-900"
              loading="eager"
            />
          </motion.div>
        )}

        {/* Badge */}
        <motion.div {...fadeUp(0.2)} className="inline-flex max-w-full items-center gap-2 px-4 py-2 rounded-full glass border border-accent-500/30 text-sm text-accent-300 mb-8">
          <Sparkles size={14} className="text-accent-400" />
          <span className="font-mono break-words">{hero.availability}</span>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        </motion.div>

        {/* Name */}
        <motion.h1 {...fadeUp(0.35)} className="text-4xl min-[360px]:text-5xl sm:text-7xl md:text-8xl font-display font-bold tracking-tight leading-none mb-4 break-words">
          <span className="block text-white">{firstName}</span>
          <span className="block text-gradient">{restName}</span>
        </motion.h1>

        {/* Typing animation */}
        <motion.div {...fadeUp(0.5)} className="text-base sm:text-2xl text-slate-300 font-mono mb-6 min-h-8">
          {typingSequence.length > 0 && (
            <TypeAnimation sequence={typingSequence} wrapper="span" speed={50} repeat={Infinity} cursor />
          )}
        </motion.div>

        {/* Tagline */}
        <motion.p {...fadeUp(0.65)} className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 break-words">
          {hero.summary}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div {...fadeUp(0.8)} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-16">
          <motion.button
            onClick={() => document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary flex items-center justify-center gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Sparkles size={16} />
            View My Work
          </motion.button>
          <motion.a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center justify-center gap-2 text-base px-8 py-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Download size={16} />
            Download Resume
          </motion.a>
        </motion.div>

        {/* Social links */}
        <motion.div {...fadeUp(0.95)} className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {socials.map(({ href, icon: Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-3 glass rounded-xl text-slate-400 hover:text-accent-400 hover:border-accent-500/40 transition-all duration-200"
              whileHover={{ scale: 1.1, y: -2 }}
            >
              <Icon size={20} />
            </motion.a>
          ))}

          <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-transparent via-slate-600 to-transparent" />

          <a
            href={`mailto:${contact.email || cms?.settings?.contactEmail || ''}`}
            className="max-w-full break-all text-sm font-mono text-slate-500 hover:text-accent-400 transition-colors"
          >
            {contact.email || cms?.settings?.contactEmail}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
