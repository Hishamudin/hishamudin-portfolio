import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Github, Star, GitFork, ExternalLink, Loader2, Code2 } from 'lucide-react';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'alexchen';

const LANG_COLORS = {
  JavaScript: '#F7DF1E',
  TypeScript: '#3178C6',
  Python: '#3776AB',
  Rust: '#CE422B',
  Go: '#00ADD8',
  Java: '#ED8B00',
  CSS: '#563D7C',
  HTML: '#E34F26',
  Shell: '#89E051',
  Vue: '#42B883',
  Ruby: '#CC342D',
  'C++': '#F34B7D',
};

function RepoCard({ repo, index }) {
  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass rounded-xl p-5 border border-white/5 hover:border-accent-500/30 transition-all duration-300
                 hover:-translate-y-1 hover:shadow-glow-sm group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-accent-400 shrink-0" />
          <h3 className="text-white font-medium text-sm font-body group-hover:text-accent-400 transition-colors truncate">
            {repo.name}
          </h3>
        </div>
        <ExternalLink size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors shrink-0 ml-2" />
      </div>

      <p className="text-slate-500 text-xs font-body leading-relaxed mb-4 line-clamp-2 min-h-[32px]">
        {repo.description || 'No description provided.'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: LANG_COLORS[repo.language] || '#6366f1' }}
              />
              <span className="text-slate-500 text-xs font-mono">{repo.language}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          {repo.stargazers_count > 0 && (
            <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
              <Star size={11} className="text-yellow-500" />
              {repo.stargazers_count >= 1000
                ? `${(repo.stargazers_count / 1000).toFixed(1)}k`
                : repo.stargazers_count}
            </div>
          )}
          {repo.forks_count > 0 && (
            <div className="flex items-center gap-1 text-slate-500 text-xs font-mono">
              <GitFork size={11} />
              {repo.forks_count}
            </div>
          )}
        </div>
      </div>
    </motion.a>
  );
}

export default function GitHubRepos() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=6&type=public`
        );
        if (!res.ok) throw new Error('GitHub API error');
        const data = await res.json();
        setRepos(data.filter(r => !r.fork).slice(0, 6));
      } catch (err) {
        setError('Could not load GitHub repos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  if (error || (!loading && repos.length === 0)) return null;

  return (
    <section className="py-16 bg-dark-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <Github size={20} className="text-slate-400" />
            <h3 className="text-white font-display font-semibold text-xl">
              Open Source on GitHub
            </h3>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-400 hover:text-accent-300 text-sm font-mono flex items-center gap-1.5 transition-colors"
          >
            View all repos <ExternalLink size={12} />
          </a>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 size={24} className="text-accent-500 animate-spin" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo, i) => (
              <RepoCard key={repo.id} repo={repo} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
