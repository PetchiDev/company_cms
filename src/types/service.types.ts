export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  category: ServiceCategory;
  features: string[];
  technologies?: string[];
  image?: string;
}

export type ServiceCategory =
  | 'it-transformation'
  | 'data-intelligence'
  | 'ai-ml'
  | 'cloud-consulting'
  | 'ui-ux';

export interface ServiceCategoryGroup {
  id: ServiceCategory;
  title: string;
  services: ServiceItem[];
}
