import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Painting } from '../types';

export default function PaintingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [painting, setPainting] = useState<Painting | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    async function fetchPainting() {
      if (!db || !id) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'paintings', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPainting({ id: docSnap.id, ...docSnap.data() } as Painting);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching painting:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPainting();
  }, [id]);

  const handleReserveClick = () => {
    setShowForm(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paintingTitle: painting?.title,
          paintingDimensions: `${painting?.width} x ${painting?.height} cm`,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setShowForm(false);
      } else {
        const data = await response.json();
        setSubmitError(data.error || 'Une erreur est survenue.');
      }
    } catch (error) {
      setSubmitError('Erreur de connexion au serveur.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-900"></div>
      </div>
    );
  }

  if (!painting) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-stone-500">
        <h1 className="text-3xl font-serif mb-4">Œuvre introuvable</h1>
        <button onClick={() => navigate('/gallery')} className="text-sm uppercase tracking-widest border-b border-stone-500 pb-1 hover:text-stone-900 hover:border-stone-900 transition-colors">
          Retour à la galerie
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-6 py-12 md:py-24"
    >
      <Helmet>
        <title>{painting.title} | A.M Longpré</title>
        <meta name="description" content={painting.description} />
      </Helmet>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative group"
        >
          <div className="bg-stone-200 overflow-hidden shadow-xl">
            <img
              src={painting.imageURL}
              alt={painting.title}
              className="w-full h-auto object-contain max-h-[80vh]"
              referrerPolicy="no-referrer"
            />
          </div>
          {painting.status === 'réservé' && (
            <div className="absolute top-6 right-6 bg-stone-900/80 text-stone-50 px-4 py-2 text-sm uppercase tracking-widest backdrop-blur-sm">
              Réservé
            </div>
          )}
        </motion.div>

        {/* Details Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col"
        >
          <button 
            onClick={() => navigate('/gallery')}
            className="self-start text-xs uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors mb-8"
          >
            ← Retour à la galerie
          </button>

          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6">{painting.title}</h1>
          
          <div className="space-y-4 text-stone-600 mb-10 border-b border-stone-200 pb-10">
            <p className="flex justify-between">
              <span className="uppercase text-xs tracking-widest text-stone-400">Dimensions</span>
              <span className="font-medium">{painting.width} x {painting.height} cm</span>
            </p>
            <p className="flex justify-between">
              <span className="uppercase text-xs tracking-widest text-stone-400">Technique</span>
              <span className="font-medium">{painting.technique}</span>
            </p>
            <p className="flex justify-between">
              <span className="uppercase text-xs tracking-widest text-stone-400">Année</span>
              <span className="font-medium">{painting.year}</span>
            </p>
            {painting.price && painting.status === 'disponible' && (
              <p className="flex justify-between items-center mt-6 pt-6 border-t border-stone-100">
                <span className="uppercase text-xs tracking-widest text-stone-400">Prix</span>
                <span className="text-2xl font-serif text-stone-900">{painting.price} $</span>
              </p>
            )}
          </div>

          <div className="prose prose-stone mb-12">
            <h3 className="text-sm uppercase tracking-widest text-stone-400 mb-4 font-normal">À propos de l'œuvre</h3>
            <p className="text-stone-600 leading-relaxed whitespace-pre-line">{painting.description}</p>
          </div>

          {painting.status === 'disponible' && !showForm && !submitSuccess && (
            <button
              onClick={handleReserveClick}
              className="w-full py-4 bg-stone-900 text-stone-50 uppercase tracking-widest text-sm font-medium hover:bg-stone-800 transition-colors"
            >
              Réserver cette toile
            </button>
          )}

          {submitSuccess && (
            <div className="bg-stone-100 p-6 text-center border border-stone-200">
              <h3 className="font-serif text-xl text-stone-900 mb-2">Demande envoyée</h3>
              <p className="text-stone-600 text-sm">Merci pour votre intérêt. L'artiste vous contactera sous peu.</p>
            </div>
          )}

          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-stone-50 p-8 border border-stone-200"
            >
              <h3 className="font-serif text-2xl text-stone-900 mb-6">Demande de réservation</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Nom complet</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleFormChange}
                    className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Courriel</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors resize-none"
                    placeholder="Précisez vos questions ou intentions d'achat..."
                  ></textarea>
                </div>
                
                {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
                
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-stone-300 text-stone-600 uppercase tracking-widest text-xs font-medium hover:bg-stone-100 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-stone-900 text-stone-50 uppercase tracking-widest text-xs font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Envoi...' : 'Envoyer'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
