import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-stone-50"
    >
      <Helmet>
        <title>A.M Longpré | Artiste Peintre Contemporaine</title>
        <meta name="description" content="Bienvenue dans l’univers artistique de A.M Longpré. Chaque toile est une exploration de la couleur, de la matière et de l’émotion." />
      </Helmet>

      <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=2000&auto=format&fit=crop"
            alt="Toile en vedette"
            className="w-full h-full object-cover object-center opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-stone-900/30 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-serif text-stone-50 mb-6 tracking-wide"
          >
            A.M Longpré
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-stone-200 font-light mb-12 leading-relaxed"
          >
            Bienvenue dans l’univers artistique de A.M Longpré. <br className="hidden md:block" />
            Chaque toile est une exploration de la couleur, de la matière et de l’émotion.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/gallery"
              className="inline-block px-8 py-4 bg-stone-50 text-stone-900 uppercase tracking-widest text-sm font-medium hover:bg-stone-200 transition-colors shadow-lg"
            >
              Voir la galerie
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
