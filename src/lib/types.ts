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
  warehouseIds: string[];
}

export interface Category {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
}

export interface Warehouse {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  cityAr: string;
  cityEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  sortOrder: number;
  active: boolean;
}

export interface SiteSettings {
  heroDescriptionAr: string; heroDescriptionEn: string;
  newDescriptionAr: string; newDescriptionEn: string;
  bestDescriptionAr: string; bestDescriptionEn: string;
  libraryDescriptionAr: string; libraryDescriptionEn: string;
  phone: string; whatsapp: string; email: string;
  instagram: string; facebook: string; tiktok: string; linkedin: string;
}
