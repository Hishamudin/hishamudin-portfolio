import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Loader2, Terminal } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 grid-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-accent-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-primary-500/8 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass border border-accent-500/30 mb-4">
            <Terminal size={28} className="text-accent-400" />
          </div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Admin Portal</h1>
          <p className="text-slate-500 text-sm font-body">Sign in to manage your portfolio</p>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-8 gradient-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Email address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="admin@yoursite.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm font-body
                             focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-12 py-3 bg-dark-800 border border-white/10 rounded-xl text-white placeholder-slate-600 text-sm font-body
                             focus:outline-none focus:ring-1 focus:ring-accent-500 focus:border-accent-500/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Authenticating...</>
              ) : (
                <><Lock size={16} /> Sign In</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <a href="/" className="text-sm text-slate-500 hover:text-accent-400 transition-colors font-body">
              ← Back to Portfolio
            </a>
          </div>
        </div>

        {/* Setup hint */}
        <p className="text-center text-slate-600 text-xs font-mono mt-4">
          First time? POST to /api/auth/register to create admin account
        </p>
      </motion.div>
    </div>
  );
}
