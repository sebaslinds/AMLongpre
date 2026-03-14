import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { Menu, X, Instagram, Facebook, Mail, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useLanguage } from '../contexts/LanguageContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navLinks = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.gallery', path: '/gallery' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.admin', path: '/admin' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200 flex flex-col">
      <header className="fixed top-0 w-full z-50 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-end">
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm tracking-widest uppercase transition-colors text-stone-500 hover:text-stone-900"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'text-sm tracking-widest uppercase transition-colors hover:text-stone-500',
                  location.pathname === link.path ? 'text-stone-900 font-medium' : 'text-stone-500'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="text-sm tracking-widest uppercase transition-colors text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <Globe size={16} />
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
            <button
              className="p-2 -mr-2 text-stone-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-20 left-0 w-full bg-stone-50 border-b border-stone-200/50 py-4 px-6 flex flex-col gap-4 shadow-lg"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  'text-lg tracking-wider uppercase py-2',
                  location.pathname === link.path ? 'text-stone-900 font-medium' : 'text-stone-500'
                )}
              >
                {t(link.key)}
              </Link>
            ))}
          </motion.nav>
        )}
      </header>

      <main className="flex-grow pt-20">
        {children}
      </main>

      <footer className="bg-stone-100 py-12 mt-20 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-serif text-lg tracking-widest uppercase mb-2">A.M Longpré</h3>
            <p className="text-sm text-stone-500">{t('footer.subtitle')}</p>
          </div>
          
          <div className="flex items-center gap-6 text-stone-500">
            <a href="https://www.instagram.com/annemarie.longpre.9/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="https://www.facebook.com/annemarie.longpre.9" target="_blank" rel="noopener noreferrer" className="hover:text-stone-900 transition-colors" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="mailto:am.longpre@me.com?subject=Demande%20d'information%20-%20A.M%20Longpr%C3%A9&body=Bonjour%2C%0A%0AJe%20souhaiterais%20obtenir%20plus%20d'informations%20sur%20l'oeuvre%20suivante%3A%0A%0ANom%3A%20%0A%0AMerci%20d'avance%2C" className="hover:text-stone-900 transition-colors" aria-label="Email">
              <Mail size={20} />
            </a>
          </div>

          <div className="text-sm text-stone-400 text-center md:text-right">
            &copy; {new Date().getFullYear()} A.M Longpré. {t('footer.rights')}
          </div>
        </div>
      </footer>
    </div>
  );
}
