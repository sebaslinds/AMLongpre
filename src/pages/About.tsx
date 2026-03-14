import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Instagram, Facebook, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-24"
    >
      <Helmet>
        <title>{t('about.title')}</title>
        <meta name="description" content={t('about.bio.p1')} />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="lg:col-span-5 relative"
        >
          <div className="aspect-[3/4] overflow-hidden bg-stone-200 shadow-xl">
            <img
              src="/IMG_1269.jpg"
              alt="Portrait de l'artiste"
              className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="mt-8 flex justify-center gap-6 text-stone-400">
            <a href="https://www.instagram.com/annemarie.longpre.9/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href="https://www.facebook.com/annemarie.longpre.9" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors" aria-label="Facebook">
              <Facebook size={24} />
            </a>
            <a href="mailto:am.longpre@me.com?subject=Demande%20d'information%20-%20A.M%20Longpr%C3%A9&body=Bonjour%2C%0A%0AJe%20souhaiterais%20obtenir%20plus%20d'informations%20sur%20l'oeuvre%20suivante%3A%0A%0ANom%3A%20%0A%0AMerci%20d'avance%2C" className="hover:text-stone-900 transition-colors" aria-label="Email">
              <Mail size={24} />
            </a>
          </div>
        </motion.div>

        {/* Content Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="lg:col-span-7 flex flex-col"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-12 tracking-wide">{t('about.heading')}</h1>

          <div className="space-y-16">
            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-6 font-medium">{t('about.bio.title')}</h2>
              <div className="prose prose-stone prose-lg text-stone-600 leading-relaxed">
                <p>{t('about.bio.p1')}</p>
                <p>{t('about.bio.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-6 font-medium">{t('about.approach.title')}</h2>
              <div className="prose prose-stone prose-lg text-stone-600 leading-relaxed">
                <p>{t('about.approach.p1')}</p>
                <p>{t('about.approach.p2')}</p>
              </div>
            </section>

            <section>
              <h2 className="text-xs uppercase tracking-widest text-stone-400 mb-6 font-medium">{t('about.inspirations.title')}</h2>
              <div className="prose prose-stone prose-lg text-stone-600 leading-relaxed">
                <p>{t('about.inspirations.p1')}</p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
