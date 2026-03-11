export interface Painting {
  id?: string;
  title: string;
  imageURL: string;
  width: number;
  height: number;
  technique: string;
  year: number;
  description: string;
  price?: number;
  status: 'disponible' | 'réservé';
  createdAt: any; // Firestore Timestamp
}
