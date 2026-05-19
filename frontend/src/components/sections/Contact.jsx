import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, MapPin, Github, Linkedin, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';
import { socialUrl } from '../../utils/cms';

export default function Contact({ cms }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const contact = cms?.contactInfo || {};
  const socials = [
    { href: socialUrl(cms?.socialLinks, 'github'), icon: Github, label: 'GitHub' },
    { href: socialUrl(cms?.socialLinks, 'linkedin'), icon: Linkedin, label: 'LinkedIn' },
  ].filter(item => item.href);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required';
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post('/messages', form);
      setSent(true);
      toast.success('Message sent! I\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send. Try emailing directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  return (
    <section id="contact" className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-[500px] sm:h-[500px] rounded-full bg-accent-500/5 blur-3xl" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent-500/20 text-accent-400 text-xs font-mono mb-4">
            contact.send(message)
          </div>
          <h2 className="section-heading text-white mb-4">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="section-subheading mx-auto text-center">
            Have a project in mind or just want to say hello? My inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            <div>
              <h3 className="text-white font-display font-semibold text-xl mb-4">Get in touch</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-body">
                {contact.description}
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
                { icon: MapPin, label: 'Location', value: contact.location, href: null },
              ].map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4 group min-w-0">
                  <div className="p-3 glass rounded-xl text-accent-400 border border-accent-500/20 group-hover:border-accent-500/40 transition-colors">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-500 text-xs font-mono">{label}</p>
                    {href ? (
                      <a href={href} className="text-slate-300 hover:text-accent-400 transition-colors text-sm font-body break-all">{value}</a>
                    ) : (
                      <p className="text-slate-300 text-sm font-body break-words">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="text-slate-500 text-xs font-mono mb-3">// Find me online</p>
              <div className="flex gap-3">
                {socials.map(({ href, icon: Icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="p-3 glass rounded-xl text-slate-400 hover:text-accent-400 border border-white/10 hover:border-accent-500/30 transition-all"
                  >
                    <Icon size={18} />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-6 sm:p-12 text-center gradient-border"
              >
                <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
                <h3 className="text-white font-display font-semibold text-xl mb-2">Message Sent!</h3>
                <p className="text-slate-400 text-sm font-body">Thanks for reaching out. I'll get back to you within 24-48 hours.</p>
                <button onClick={() => setSent(false)} className="mt-6 btn-outline text-sm">
                  Send another
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 sm:p-8 gradient-border space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 rounded-xl bg-dark-800 border text-white placeholder-slate-600 text-sm font-body
                                  focus:outline-none focus:ring-1 focus:ring-accent-500 transition-all ${
                        errors.name ? 'border-red-500/50' : 'border-white/10 focus:border-accent-500/50'
                      }`}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1 font-mono">{errors.name}</p>}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 rounded-xl bg-dark-800 border text-white placeholder-slate-600 text-sm font-body
                                  focus:outline-none focus:ring-1 focus:ring-accent-500 transition-all ${
                        errors.email ? 'border-red-500/50' : 'border-white/10 focus:border-accent-500/50'
                      }`}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 font-mono">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project Collaboration"
                    className="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10 text-white placeholder-slate-600 text-sm font-body
                               focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500/50 transition-all"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Share your message..."
                    className={`w-full px-4 py-3 rounded-xl bg-dark-800 border text-white placeholder-slate-600 text-sm font-body resize-none
                                focus:outline-none focus:ring-1 focus:ring-accent-500 transition-all ${
                      errors.message ? 'border-red-500/50' : 'border-white/10 focus:border-accent-500/50'
                    }`}
                  />
                  {errors.message && <p className="text-red-400 text-xs mt-1 font-mono">{errors.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
