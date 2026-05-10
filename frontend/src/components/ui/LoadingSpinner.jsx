export default function LoadingSpinner({ fullscreen = false, size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className={`${sizes[size]} relative`}>
      <div className="absolute inset-0 rounded-full border-2 border-accent-500/20" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-2 border-accent-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-500 animate-spin" />
            <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-primary-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-slate-400 font-mono text-sm animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
