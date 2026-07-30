export interface CatalogImage {
  id: string;
  url: string;
  width: number;
  height: number;
  alt?: string;
  sortOrder: number;
}

export interface Catalog {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  category: string;
  coverUrl: string;
  images: CatalogImage[];
  productCount: number;
  updatedAt: string; // ISO date
  featured: boolean;
  isNew: boolean;
  bestSeller: boolean;
  sortOrder: number;
  pdfUrl?: string;
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}
