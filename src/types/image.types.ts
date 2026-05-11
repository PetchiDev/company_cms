export interface ImageRecord {
  id: string;
  url: string;
  name: string;
  category: ImageCategory;
  alt_text: string;
  sort_order: number;
  is_active: boolean;
  uploaded_by: string;
  created_at: string;
}

export type ImageCategory =
  | 'banner'
  | 'client_logo'
  | 'gallery'
  | 'team'
  | 'case_study'
  | 'certification';

export interface ImageUploadPayload {
  file: File;
  name: string;
  category: ImageCategory;
  alt_text: string;
}
