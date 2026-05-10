import { motion } from 'framer-motion';

export default function Testimonials({ testimonials = [] }) {
  if (!testimonials.length) return null;

  return (
    <section id="testimonials" className="py-24 bg-dark-900 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((item, index) => (
            <motion.article
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="glass rounded-2xl p-6 border border-white/5"
            >
              <p className="text-slate-300 text-sm leading-relaxed font-body">"{item.quote}"</p>
              <div className="mt-5">
                <h3 className="text-white font-display font-semibold">{item.name}</h3>
                <p className="text-slate-500 text-xs font-mono">{[item.role, item.company].filter(Boolean).join(', ')}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
