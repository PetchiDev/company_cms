import type { Testimonial, CaseStudy, BlogArticle } from '@/types/contact.types';

/* ─── Company Info ─── */
export const COMPANY = {
  name: 'Kryptos Info Sys',
  legalName: 'Kryptos Technologies',
  website: 'https://www.kryptosinfosys.com',
  tagline: 'Revolutionizing Business with Smart IT Solutions',
  motto: 'Make IT Simple',
  vision:
    'Deliver services in a simple, easy to use and competitive manner for integrated partnership and growth. Be the partner of choice by being transparent & ethical.',
  mission:
    "'Make IT Simple' — Value customers with quality of work. Value employees for their quality of work.",
  logo: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/kryptos-logo.png',
  copyright: `© ${new Date().getFullYear()} Kryptos`,
};

/* ─── Contact ─── */
export const CONTACT_INFO = {
  phone: '+1 201-201-7138',
  email: 'sales@kryptosinfosys.com',
  usOffice: {
    label: 'US Office',
    address:
      'Skymark Tower Suite, 214, 1521 North Cooper Street, Arlington, TX – 76011',
  },
  indiaOffice: {
    label: 'India Office',
    address:
      "B' Wing, 1st floor, Narayana Complex, No 29, Sarathy Nagar, Velachery, Chennai, Tamil Nadu – 600042",
  },
};

/* ─── Social Links ─── */
export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/kryptos-technologies/',
  facebook:
    'https://www.facebook.com/people/Kryptos-Technologies/100064887494336/',
  instagram: 'https://www.instagram.com/kryptos_technologies/',
  twitter: 'https://twitter.com/Kryptos_Tech06',
};

/* ─── Stats ─── */
export const STATS = [
  { label: 'Hours of Experience', value: 250000, suffix: '+', display: '2.5 Lakh' },
  { label: 'Happy Clients', value: 100, suffix: '+', display: '100+' },
  { label: 'Projects', value: 500, suffix: '+', display: '500+' },
  { label: 'Client Retention Rate', value: 95, suffix: '%', display: '95%' },
];

/* ─── Client Logos ─── */
export const CLIENT_LOGOS = [
  {
    name: 'Docuf.AI',
    url: 'http://kryptosinfosys.com/wp-content/uploads/2024/01/1.png',
  },
  {
    name: 'Film.io',
    url: 'http://kryptosinfosys.com/wp-content/uploads/2024/01/2.png',
  },
  {
    name: 'Winjit',
    url: 'http://kryptosinfosys.com/wp-content/uploads/2024/01/3.png',
  },
  {
    name: 'Vlead',
    url: 'http://kryptosinfosys.com/wp-content/uploads/2024/01/4.png',
  },
  {
    name: 'Lubbock Auto Spa',
    url: 'http://kryptosinfosys.com/wp-content/uploads/2024/01/5.png',
  },
];

/* ─── Certification Badges ─── */
export const CERTIFICATIONS = [
  { name: 'Microsoft Partner', url: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/01.png' },
  { name: 'Certified Azure', url: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/02.png' },
  { name: 'AWS Partner', url: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/03.png' },
];

/* ─── Testimonials ─── */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    clientName: 'Lubbock Auto Spa',
    clientTitle: '',
    company: 'Lubbock Auto Spa',
    quote:
      'Kryptos revolutionized our operations with a mobile app for car VIN scanning, QR codes, and QuickBooks integration. Truly transformative!',
    logo: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/laslogo.png',
  },
  {
    id: '2',
    clientName: 'Mr. Kareem Merritt',
    clientTitle: 'Founder & CEO',
    company: 'Intras Cloud Services',
    quote:
      'The ticketing, provision, and Zoho API integration delivered a level of efficiency that has greatly improved our day-to-day operations.',
    logo: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/intrascloudservices_logo.jpg',
  },
  {
    id: '3',
    clientName: 'Mr. Marcus',
    clientTitle: 'CEO',
    company: 'VLead',
    quote:
      'Azure lift-and-shift, .NET 2.0 to .NET Core, AngularJS to Angular on Linux — substantial cost savings and modernization achieved.',
    logo: 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/images.jpg',
  },
];

/* ─── Case Studies ─── */
export const CASE_STUDIES: CaseStudy[] = [
  {
    id: '1',
    title: 'Migration - SharePoint Online',
    category: 'Migration',
    description: 'Complete SharePoint Online migration with zero downtime.',
    thumbnail:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Migration-SharePoint-Online-Im.png-V2.png',
  },
  {
    id: '2',
    title: 'Power BI Virtualization',
    category: 'Insights & Intelligence',
    description: 'Advanced Power BI dashboards for business intelligence.',
    thumbnail:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation-Im.png-V2.png',
  },
  {
    id: '3',
    title: 'Power Apps Expense Tracking App',
    category: 'Application Modernization',
    description: 'Custom expense tracking with Power Apps integration.',
    thumbnail:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-Apps-Expense-Tracking-Apps-Im.png-V2.png',
    pdfLink:
      'http://kryptosinfosys.com/wp-content/uploads/2024/02/Power-Apps-Expense-Tracking-App.pdf',
  },
  {
    id: '4',
    title: 'Power of Cloud for Digital Transformation',
    category: 'Application Modernization',
    description: 'Leveraging cloud technologies for complete digital transformation.',
    thumbnail:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation-Im.png-V2.png',
    pdfLink:
      'http://kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation.pdf',
  },
  {
    id: '5',
    title: 'Speech to Text Recognition',
    category: 'AI & Machine Learning',
    description: 'AI-powered speech recognition system implementation.',
    thumbnail:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation-Im.png-V2.png',
  },
  {
    id: '6',
    title: 'Cloud Migration and VDI Implementation',
    category: 'Cloud',
    description: 'Cloud migration and VDI setup for health & wellness client.',
    thumbnail:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Migration-SharePoint-Online-Im.png-V2.png',
  },
];

/* ─── Blog Articles ─── */
export const BLOG_ARTICLES: BlogArticle[] = [
  {
    id: '1',
    title: 'Platform Engineering Services. Use it to gain a Competitive Advantage',
    excerpt:
      'Discover how platform engineering services can give your business a strategic edge in the market.',
    image:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Application-Platform-Engineering.webp',
    link: 'https://www.kryptosinfosys.com/platform-engineering-services-use-it-to-gain-a-competitive-advantage/',
    date: '2024-03-15',
  },
  {
    id: '2',
    title: 'Benefits of Implementing Custom IT Solutions to Your Business',
    excerpt:
      'Learn why custom IT solutions outperform off-the-shelf software for enterprise growth.',
    image:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/WhatsApp-Image-2022-12-21-at-8.35.09-PM.webp',
    link: 'https://www.kryptosinfosys.com/benefits-of-implementing-custom-it-solutions-to-your-business/',
    date: '2024-02-20',
  },
  {
    id: '3',
    title: 'Build Intelligent Business Empowered with AI & ML Services',
    excerpt:
      'How AI and Machine Learning can transform your business operations and decision making.',
    image:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/AI-Machine-Learning-Services-Kryptos.webp',
    link: 'https://www.kryptosinfosys.com/build-intelligent-business-empowered-with-ai-machine-learning-services/',
    date: '2024-01-10',
  },
  {
    id: '4',
    title: 'Why Do Businesses Need to Adopt Application Maintenance & Support Services?',
    excerpt:
      'The critical importance of ongoing application maintenance for business continuity.',
    image:
      'https://www.kryptosinfosys.com/wp-content/uploads/2023/03/GettyImages-1157345255.jpg',
    link: 'https://www.kryptosinfosys.com/blog/',
    date: '2023-12-05',
  },
  {
    id: '5',
    title: 'Best Practices for SharePoint Document Management',
    excerpt:
      'Optimize your SharePoint environment for efficient document management and collaboration.',
    image:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Application-Platform-Engineering.webp',
    link: 'https://www.kryptosinfosys.com/blog/',
    date: '2023-11-15',
  },
  {
    id: '6',
    title: 'Benefits of Using Power BI in Your Business',
    excerpt:
      'Unlock data-driven insights with Microsoft Power BI for smarter business decisions.',
    image:
      'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/WhatsApp-Image-2022-12-21-at-8.35.09-PM.webp',
    link: 'https://www.kryptosinfosys.com/blog/',
    date: '2023-10-20',
  },
];

/* ─── Careers Culture ─── */
export const CULTURE_HIGHLIGHTS = [
  {
    icon: 'MapPin',
    title: 'Work Where You Live',
    description: 'City-based work with flexible locations.',
  },
  {
    icon: 'BookOpen',
    title: 'Feed Your Curiosity',
    description: 'Flexible learning with paid certifications.',
  },
  {
    icon: 'TrendingUp',
    title: 'Choose Your Career',
    description: 'No up-or-out pressure — grow at your own pace.',
  },
  {
    icon: 'Heart',
    title: 'Cultivate Well-being',
    description: 'Holistic benefits for mind and body.',
  },
  {
    icon: 'Sparkles',
    title: 'Find the Fun',
    description: 'Book clubs, speaking events, resort retreats.',
  },
  {
    icon: 'Coffee',
    title: 'Love Your Workspace',
    description: 'Modern offices with free snacks and amenities.',
  },
];

export const JOB_PORTAL_URL = 'https://app695.workline.hr/Candidate/GeneralOpening.aspx';
