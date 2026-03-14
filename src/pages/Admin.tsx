import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabase';
import { Upload, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Painting } from '../types';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    width: '',
    height: '',
    technique: '',
    year: new Date().getFullYear().toString(),
    description: '',
    description_en: '',
    price: '',
    status: 'disponible' as 'disponible' | 'réservé',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [paintings, setPaintings] = useState<Painting[]>([]);
  const [loadingPaintings, setLoadingPaintings] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPaintings();
    }
  }, [isAuthenticated]);

  const fetchPaintings = async () => {
    if (!supabase) return;
    setLoadingPaintings(true);
    try {
      const { data, error } = await supabase
        .from('paintings')
        .select('*')
        .order('createdAt', { ascending: false });
        
      if (error) throw error;
      if (data) setPaintings(data as Painting[]);
    } catch (err) {
      console.error("Error fetching paintings:", err);
    } finally {
      setLoadingPaintings(false);
    }
  };

  const handleDelete = async (id: string, imageURL: string) => {
    if (!supabase) return;
    if (!window.confirm(t('admin.manage.delete.confirm'))) return;

    try {
      // 1. Delete from database
      const { error: dbError } = await supabase
        .from('paintings')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // 2. Try to delete image from storage
      try {
        const urlParts = imageURL.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from('paintings').remove([fileName]);
        }
      } catch (storageErr) {
        console.error("Error deleting image from storage:", storageErr);
        // We continue even if storage deletion fails
      }

      setPaintings(paintings.filter(p => p.id !== id));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error deleting painting:", err);
      setError(t('admin.manage.delete.error'));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    // Allow 'admin' as a fallback if the env var is not set or if they explicitly type 'admin'
    if (password.trim() === (adminPassword || 'admin') || password.trim() === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError(t('admin.login.error'));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !supabase) {
      setError(t('admin.add.error'));
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      // Just a warning, we still allow it but it might take time
      console.warn("Large file detected, upload might take a while.");
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Upload image to Supabase Storage
      // Sanitize file name to avoid issues with special characters
      const sanitizedName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${Date.now()}_${sanitizedName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('paintings')
        .upload(fileName, imageFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('paintings')
        .getPublicUrl(fileName);

      // 2. Save data to Supabase Database
      const { error: insertError } = await supabase
        .from('paintings')
        .insert([
          {
            title: formData.title,
            imageURL: publicUrl,
            width: Number(formData.width),
            height: Number(formData.height),
            technique: formData.technique,
            year: formData.year,
            description: formData.description,
            description_en: formData.description_en || null,
            price: formData.price ? Number(formData.price) : null,
            status: formData.status,
            createdAt: new Date().toISOString(),
          }
        ] as any);

      if (insertError) throw insertError;

      setSuccess(true);
      // Refresh paintings list
      fetchPaintings();
      // Reset form
      setFormData({
        title: '',
        width: '',
        height: '',
        technique: '',
        year: new Date().getFullYear().toString(),
        description: '',
        description_en: '',
        price: '',
        status: 'disponible',
      });
      setImageFile(null);
      setImagePreview(null);
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error("Error adding document: ", err);
      const errorMessage = err?.message || err?.error_description || t('admin.add.error.generic');
      setError(`Erreur: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-stone-50 px-6">
        <Helmet>
          <title>{t('admin.login.title')} | A.M Longpré</title>
        </Helmet>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 shadow-xl border border-stone-100"
        >
          <h1 className="text-2xl font-serif text-stone-900 mb-6 text-center">{t('admin.login.title')}</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.login.password')}</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-stone-900 text-stone-50 uppercase tracking-widest text-xs font-medium hover:bg-stone-800 transition-colors"
            >
              {t('admin.login.submit')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      <Helmet>
        <title>{t('admin.add.title')} | A.M Longpré</title>
      </Helmet>

      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif text-stone-900">{t('admin.add.title')}</h1>
        <button 
          onClick={() => setIsAuthenticated(false)}
          className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-900 transition-colors"
        >
          {t('admin.add.logout')}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-8">
          {t('admin.add.success')}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow-sm border border-stone-100">
        {/* Image Upload */}
        <div className="border-2 border-dashed border-stone-300 p-8 text-center relative hover:bg-stone-50 transition-colors cursor-pointer group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            required
          />
          {imagePreview ? (
            <div className="flex flex-col items-center">
              <img src={imagePreview} alt="Aperçu" className="max-h-64 object-contain mb-4" />
              <span className="text-xs uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">{t('admin.form.image.change')}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center py-12">
              <Upload size={32} className="text-stone-400 mb-4 group-hover:text-stone-900 transition-colors" />
              <span className="text-sm uppercase tracking-widest text-stone-500 group-hover:text-stone-900 transition-colors">{t('admin.form.image.empty')}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.title')}</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleFormChange}
              required
              className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.width')}</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleFormChange}
                required
                className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.height')}</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleFormChange}
                required
                className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.technique')}</label>
            <input
              type="text"
              name="technique"
              value={formData.technique}
              onChange={handleFormChange}
              required
              className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.year')}</label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleFormChange}
              required
              className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.price')}</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleFormChange}
              className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.status')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full bg-transparent border-b border-stone-300 py-2 focus:outline-none focus:border-stone-900 transition-colors"
            >
              <option value="disponible">{t('gallery.status.available')}</option>
              <option value="réservé">{t('gallery.status.reserved')}</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.description')}</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            required
            rows={4}
            className="w-full bg-transparent border border-stone-300 p-4 focus:outline-none focus:border-stone-900 transition-colors resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-stone-500 mb-2">{t('admin.form.description_en') || 'Description (English)'}</label>
          <textarea
            name="description_en"
            value={formData.description_en}
            onChange={handleFormChange}
            rows={4}
            className="w-full bg-transparent border border-stone-300 p-4 focus:outline-none focus:border-stone-900 transition-colors resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 bg-stone-900 text-stone-50 uppercase tracking-widest text-sm font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
        >
          {submitting ? t('admin.form.submitting') : t('admin.form.submit')}
        </button>
      </form>

      {/* Manage Artworks Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-serif text-stone-900 mb-8">{t('admin.manage.title')}</h2>
        
        {loadingPaintings ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-stone-200 border-t-stone-800 rounded-full animate-spin"></div>
          </div>
        ) : paintings.length === 0 ? (
          <p className="text-stone-500 italic">{t('admin.manage.empty')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paintings.map((painting) => (
              <div key={painting.id} className="bg-white border border-stone-200 overflow-hidden flex flex-col">
                <div className="aspect-square relative overflow-hidden bg-stone-100">
                  <img 
                    src={painting.imageURL} 
                    alt={painting.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-serif text-lg text-stone-900 mb-1">{painting.title}</h3>
                  <p className="text-sm text-stone-500 mb-4">{painting.width} × {painting.height} cm</p>
                  
                  <div className="mt-auto pt-4 border-t border-stone-100 flex justify-end">
                    <button
                      onClick={() => painting.id && handleDelete(painting.id, painting.imageURL)}
                      className="flex items-center text-red-600 hover:text-red-800 transition-colors text-sm font-medium"
                    >
                      <Trash2 size={16} className="mr-2" />
                      {t('admin.manage.delete')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
