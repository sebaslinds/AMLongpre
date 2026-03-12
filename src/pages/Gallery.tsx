import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabase';
import { Painting } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export default function Gallery() {
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { t } = useLanguage();

  useEffect(() => {
    async function fetchPaintings() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('paintings')
          .select('*')
          .order('createdAt', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setPaintings(data as Painting[]);
        }
      } catch (error) {
        console.error("Error fetching paintings:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPaintings();
  }, []);

  const filteredPaintings = paintings.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'available') return p.status === 'disponible';
    if (filter === 'reserved') return p.status === 'réservé';
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12"
    >
      <Helmet>
        <title>{t('gallery.title')} | A.M Longpré</title>
        <meta name="description" content="Découvrez les œuvres originales de A.M Longpré. Peintures contemporaines, abstraites et figuratives." />
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h1 className="text-4xl font-serif tracking-widest uppercase text-stone-900">{t('gallery.title')}</h1>
        
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${filter === 'all' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
          >
            {t('gallery.filter.all')}
          </button>
          <button
            onClick={() => setFilter('available')}
            className={`px-4 py-2 text-sm uppercase tracking-wider transition-colors ${filter === 'available' ? 'border-b-2 border-stone-900 text-stone-900' : 'text-stone-500 hover:text-stone-900'}`}
          >
            {t('gallery.filter.available')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
        </div>
      ) : filteredPaintings.length === 0 ? (
        <div className="text-center text-stone-500 py-20">
          <p className="text-xl font-serif">{t('gallery.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredPaintings.map((painting, index) => (
            <motion.div
              key={painting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={`/painting/${painting.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-200 mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                  <img
                    src={painting.imageURL}
                    alt={painting.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {painting.status === 'réservé' && (
                    <div className="absolute top-4 right-4 bg-stone-900/80 text-stone-50 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur-sm">
                      {t('gallery.status.reserved')}
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-serif text-stone-900 mb-2">{painting.title}</h2>
                  <p className="text-sm text-stone-500 mb-1">
                    {painting.width} x {painting.height} cm
                  </p>
                  {painting.price && painting.status === 'disponible' && (
                    <p className="text-sm font-medium text-stone-900">{painting.price} $</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
