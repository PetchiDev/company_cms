import { useQuery } from '@tanstack/react-query';
import { imageService } from '@/api/services/imageService';
import { COMPANY, CLIENT_LOGOS } from '@/constants/companyData';

export const useClientLogos = () => {
  const { data: images = [], isLoading } = useQuery({
    queryKey: ['images', 'client_logo'],
    queryFn: () => imageService.fetchByCategory('client_logo'),
    staleTime: 5 * 60 * 1000, /* 5 minutes */
  });

  /* Find if there is an image named 'logo' (exact case-insensitive) or containing 'logo' (e.g. 'crayon_logo') */
  const logoImage = images.find(
    (img) => img.name.toLowerCase() === 'logo'
  ) || images.find(
    (img) => img.name.toLowerCase().includes('logo')
  );

  const logoUrl = logoImage ? logoImage.url : COMPANY.logo;

  /* The rest of the images are client logos (excluding the selected main site logo) */
  const clientLogosFromDb = images.filter(
    (img) => img.id !== logoImage?.id
  );

  /* Fallback to static CLIENT_LOGOS if DB has no other client logos */
  const clientLogos = clientLogosFromDb.length > 0
    ? clientLogosFromDb.map((img) => ({ name: img.name, url: img.url }))
    : CLIENT_LOGOS;

  return {
    logoUrl,
    clientLogos,
    isLoading,
  };
};
