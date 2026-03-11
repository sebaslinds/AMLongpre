export interface Painting {
  id?: string;
  title: string;
  imageURL: string;
  width: number;
  height: number;
  technique: string;
  year: string;
  description: string;
  price?: number;
  status: 'disponible' | 'réservé';
  createdAt: string; // Supabase timestamp
}
