import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'fr' | 'en';

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  fr: {
    'nav.home': 'Accueil',
    'nav.gallery': 'Galerie',
    'nav.about': 'À propos',
    'nav.admin': 'Accès Artiste',
    'footer.subtitle': 'Artiste Peintre Contemporaine',
    'footer.rights': 'Tous droits réservés.',
    'home.hero.title': 'A.M Longpré',
    'home.hero.subtitle': 'Bienvenue dans l’univers artistique de A.M Longpré. Chaque toile est une exploration de la couleur, de la matière et de l’émotion.',
    'home.hero.cta': 'Voir la galerie',
    'home.featured.title': 'Œuvres Récentes',
    'home.featured.cta': 'Voir toute la collection',
    'gallery.title': 'Galerie',
    'gallery.filter.all': 'Toutes',
    'gallery.filter.available': 'Disponibles',
    'gallery.filter.reserved': 'Réservées',
    'gallery.empty': 'Aucune œuvre trouvée dans cette catégorie.',
    'gallery.status.available': 'Disponible',
    'gallery.status.reserved': 'Réservé',
    'detail.back': 'Retour à la galerie',
    'detail.dimensions': 'Dimensions',
    'detail.technique': 'Technique',
    'detail.year': 'Année',
    'detail.price': 'Prix',
    'detail.status': 'Statut',
    'detail.contact': 'Demander des informations',
    'detail.notfound': 'Œuvre introuvable',
    'detail.about': 'À propos de l\'œuvre',
    'detail.reserve': 'Réserver cette toile',
    'detail.success.title': 'Demande envoyée',
    'detail.success.desc': 'Merci pour votre intérêt. L\'artiste vous contactera sous peu.',
    'detail.form.title': 'Demande de réservation',
    'detail.form.name': 'Nom complet',
    'detail.form.email': 'Courriel',
    'detail.form.message': 'Message',
    'detail.form.placeholder': 'Précisez vos questions ou intentions d\'achat...',
    'detail.form.cancel': 'Annuler',
    'detail.form.submit': 'Envoyer',
    'detail.form.submitting': 'Envoi...',
    'detail.error.server': 'Une erreur est survenue.',
    'detail.error.network': 'Erreur de connexion au serveur.',
    'about.title': 'À propos | A.M Longpré',
    'about.heading': 'L\'Artiste',
    'about.bio.title': 'Biographie',
    'about.bio.p1': 'Née avec une passion innée pour les formes et les couleurs, A.M Longpré a développé son langage visuel à travers des années d\'exploration et de pratique. Son travail se situe à la frontière entre l\'abstraction et la figuration, cherchant toujours à capturer l\'essence émotionnelle de son sujet plutôt que sa représentation littérale.',
    'about.bio.p2': 'Ancienne entrepreneure, elle a perfectionné sa technique en autodidacte et dans divers ateliers avant d\'établir son propre studio. Ses œuvres font aujourd\'hui partie de plusieurs collections privées.',
    'about.approach.title': 'Démarche artistique',
    'about.approach.p1': 'La démarche de l\'artiste est profondément intuitive. Chaque toile commence par une impulsion, une émotion ou un souvenir qui guide les premiers coups de pinceau. Le processus est un dialogue constant avec la matière : l\'acrylique, l\'huile, les textures s\'entremêlent pour créer une profondeur visuelle.',
    'about.approach.p2': 'Elle privilégie les grands formats qui permettent un engagement physique avec l\'œuvre, transformant l\'acte de peindre en une véritable chorégraphie.',
    'about.inspirations.title': 'Inspirations',
    'about.inspirations.p1': 'La nature, dans ses formes organiques et ses contrastes saisissants, demeure sa source d\'inspiration première. Les paysages urbains, l\'architecture et les interactions humaines nourrissent également sa réflexion sur l\'espace et la lumière.',
    'admin.login.title': 'Accès Artiste',
    'admin.login.password': 'Mot de passe',
    'admin.login.submit': 'Se connecter',
    'admin.login.error': 'Mot de passe incorrect',
    'admin.add.title': 'Ajouter une œuvre',
    'admin.add.logout': 'Déconnexion',
    'admin.add.success': 'L\'œuvre a été ajoutée avec succès à la galerie.',
    'admin.add.error': 'Veuillez sélectionner une image et vérifier la configuration Supabase.',
    'admin.add.error.generic': 'Erreur lors de l\'ajout de l\'œuvre.',
    'admin.form.image.change': 'Changer l\'image',
    'admin.form.image.empty': 'Cliquez ou glissez une image ici',
    'admin.form.title': 'Titre',
    'admin.form.width': 'Largeur (cm)',
    'admin.form.height': 'Hauteur (cm)',
    'admin.form.technique': 'Technique',
    'admin.form.year': 'Année',
    'admin.form.price': 'Prix ($) - Optionnel',
    'admin.form.status': 'Statut',
    'admin.form.description': 'Description',
    'admin.form.submit': 'Publier l\'œuvre',
    'admin.form.submitting': 'Publication en cours... (Veuillez patienter)',
    'admin.manage.title': 'Gérer les œuvres',
    'admin.manage.delete': 'Supprimer',
    'admin.manage.delete.confirm': 'Êtes-vous sûr de vouloir supprimer cette œuvre ?',
    'admin.manage.delete.success': 'Œuvre supprimée avec succès.',
    'admin.manage.delete.error': 'Erreur lors de la suppression.',
    'admin.manage.empty': 'Aucune œuvre dans la galerie.',
    'chat.welcome': 'Bonjour ! Je suis l\'assistant virtuel de la galerie. Comment puis-je vous aider aujourd\'hui ?',
    'chat.title': 'Assistant Galerie',
    'chat.placeholder': 'Posez votre question...',
    'chat.error.generate': 'Désolé, je n\'ai pas pu générer de réponse.',
    'chat.error.network': 'Désolé, une erreur est survenue lors de la communication avec l\'assistant.',
    'chat.error.quota': 'Désolé, le quota d\'utilisation de l\'assistant est dépassé pour le moment. Veuillez réessayer plus tard.',
  },
  en: {
    'nav.home': 'Home',
    'nav.gallery': 'Gallery',
    'nav.about': 'About',
    'nav.admin': 'Artist Access',
    'footer.subtitle': 'Contemporary Painter',
    'footer.rights': 'All rights reserved.',
    'home.hero.title': 'A.M Longpré',
    'home.hero.subtitle': 'Welcome to the artistic universe of A.M Longpré. Each canvas is an exploration of color, material, and emotion.',
    'home.hero.cta': 'View the gallery',
    'home.featured.title': 'Recent Works',
    'home.featured.cta': 'View the full collection',
    'gallery.title': 'Gallery',
    'gallery.filter.all': 'All',
    'gallery.filter.available': 'Available',
    'gallery.filter.reserved': 'Reserved',
    'gallery.empty': 'No artworks found in this category.',
    'gallery.status.available': 'Available',
    'gallery.status.reserved': 'Reserved',
    'detail.back': 'Back to gallery',
    'detail.dimensions': 'Dimensions',
    'detail.technique': 'Technique',
    'detail.year': 'Year',
    'detail.price': 'Price',
    'detail.status': 'Status',
    'detail.contact': 'Request information',
    'detail.notfound': 'Artwork not found',
    'detail.about': 'About the artwork',
    'detail.reserve': 'Reserve this canvas',
    'detail.success.title': 'Request sent',
    'detail.success.desc': 'Thank you for your interest. The artist will contact you shortly.',
    'detail.form.title': 'Reservation request',
    'detail.form.name': 'Full name',
    'detail.form.email': 'Email',
    'detail.form.message': 'Message',
    'detail.form.placeholder': 'Specify your questions or purchase intentions...',
    'detail.form.cancel': 'Cancel',
    'detail.form.submit': 'Send',
    'detail.form.submitting': 'Sending...',
    'detail.error.server': 'An error occurred.',
    'detail.error.network': 'Server connection error.',
    'about.title': 'About | A.M Longpré',
    'about.heading': 'The Artist',
    'about.bio.title': 'Biography',
    'about.bio.p1': 'Born with an innate passion for shapes and colors, A.M Longpré has developed her visual language through years of exploration and practice. Her work lies on the border between abstraction and figuration, always seeking to capture the emotional essence of her subject rather than its literal representation.',
    'about.bio.p2': 'A former entrepreneur, she perfected her technique self-taught and in various workshops before establishing her own studio. Her works are now part of several private collections.',
    'about.approach.title': 'Artistic Approach',
    'about.approach.p1': 'The artist\'s approach is deeply intuitive. Each canvas begins with an impulse, an emotion, or a memory that guides the first brushstrokes. The process is a constant dialogue with the material: acrylic, oil, and textures intertwine to create visual depth.',
    'about.approach.p2': 'She favors large formats that allow for physical engagement with the work, transforming the act of painting into a true choreography.',
    'about.inspirations.title': 'Inspirations',
    'about.inspirations.p1': 'Nature, in its organic forms and striking contrasts, remains her primary source of inspiration. Urban landscapes, architecture, and human interactions also nourish her reflection on space and light.',
    'admin.login.title': 'Artist Access',
    'admin.login.password': 'Password',
    'admin.login.submit': 'Login',
    'admin.login.error': 'Incorrect password',
    'admin.add.title': 'Add an Artwork',
    'admin.add.logout': 'Logout',
    'admin.add.success': 'The artwork was successfully added to the gallery.',
    'admin.add.error': 'Please select an image and check the Supabase configuration.',
    'admin.add.error.generic': 'Error adding the artwork.',
    'admin.form.image.change': 'Change image',
    'admin.form.image.empty': 'Click or drag an image here',
    'admin.form.title': 'Title',
    'admin.form.width': 'Width (cm)',
    'admin.form.height': 'Height (cm)',
    'admin.form.technique': 'Technique',
    'admin.form.year': 'Year',
    'admin.form.price': 'Price ($) - Optional',
    'admin.form.status': 'Status',
    'admin.form.description': 'Description',
    'admin.form.submit': 'Publish artwork',
    'admin.form.submitting': 'Publishing... (Please wait)',
    'admin.manage.title': 'Manage Artworks',
    'admin.manage.delete': 'Delete',
    'admin.manage.delete.confirm': 'Are you sure you want to delete this artwork?',
    'admin.manage.delete.success': 'Artwork successfully deleted.',
    'admin.manage.delete.error': 'Error deleting artwork.',
    'admin.manage.empty': 'No artworks in the gallery.',
    'chat.welcome': 'Hello! I am the gallery\'s virtual assistant. How can I help you today?',
    'chat.title': 'Gallery Assistant',
    'chat.placeholder': 'Ask your question...',
    'chat.error.generate': 'Sorry, I could not generate a response.',
    'chat.error.network': 'Sorry, an error occurred while communicating with the assistant.',
    'chat.error.quota': 'Sorry, the assistant\'s usage quota has been exceeded for now. Please try again later.',
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('fr');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
