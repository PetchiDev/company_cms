import type { ServiceCategoryGroup } from '@/types/service.types';

export const SERVICE_CATEGORIES: ServiceCategoryGroup[] = [
  {
    id: 'it-transformation',
    title: 'IT Transformation & Automation',
    services: [
      {
        id: 'app-modernization',
        slug: 'application-modernization',
        title: 'Application Modernization',
        shortDescription:
          'Modernize legacy apps for the digital era with cutting-edge technologies.',
        fullDescription:
          'Legacy apps-a modernize panni digital era-kku ready pannuvom. We transform outdated applications into modern, scalable solutions.',
        icon: 'RefreshCw',
        category: 'it-transformation',
        features: [
          'App Development',
          'Modernization',
          'Performance Management',
          'Support & Maintenance',
        ],
        technologies: ['.NET', 'Python', 'Angular', 'Node.js', 'JavaScript', 'React Native', 'React JS'],
      },
      {
        id: 'app-operations',
        slug: 'application-operations',
        title: 'Application Operations',
        shortDescription:
          'Traditional and cloud-native operational models for optimal performance.',
        fullDescription:
          'Provide benefits of both traditional and cloud-native models with agile environment management.',
        icon: 'Settings',
        category: 'it-transformation',
        features: [
          'Agile Environment Management',
          'Application Intelligence & Monitoring',
          'Migration Factory',
          'SAP on Cloud',
          'Platform Management as a Service',
        ],
      },
      {
        id: 'devops',
        slug: 'devops-containerization',
        title: 'DevOps & Containerization',
        shortDescription:
          '6-stage DevOps process from analysis to deployment.',
        fullDescription:
          'Complete DevOps pipeline with containerization — from analysis to building, publishing, container deployment, testing, and final deployment.',
        icon: 'Container',
        category: 'it-transformation',
        features: [
          'Azure DevOps',
          'AWS DevOps',
          'CI/CD',
          'Infrastructure Automation',
          'DevOps Consulting',
        ],
      },
      {
        id: 'rpa',
        slug: 'robotic-process-automation',
        title: 'Robotic Process Automation',
        shortDescription:
          'Automate repetitive processes with intelligent RPA solutions.',
        fullDescription:
          'End-to-end RPA services from assessment to implementation and managed services.',
        icon: 'Bot',
        category: 'it-transformation',
        features: [
          'RPA Assessment',
          'Process Mining',
          'Consulting',
          'Development',
          'Implementation',
          'Support & Managed Services',
        ],
      },
      {
        id: 'testing',
        slug: 'application-testing',
        title: 'Application Testing',
        shortDescription:
          'Comprehensive testing services for quality assurance.',
        fullDescription:
          'Full spectrum testing services ensuring quality, performance, and security.',
        icon: 'TestTube',
        category: 'it-transformation',
        features: [
          'Functional Testing',
          'Performance Testing',
          'Security Testing',
          'Web App Testing',
          'Automated Testing',
          'Regression Testing',
          'QA Testing as a Service',
        ],
      },
    ],
  },
  {
    id: 'data-intelligence',
    title: 'Data Intelligence',
    services: [
      {
        id: 'data-modernization',
        slug: 'data-modernization',
        title: 'Data Modernization',
        shortDescription:
          'Azure-focused data engineering and migration solutions.',
        fullDescription:
          'Modern data infrastructure with Azure Synapse, Databricks, Snowflake, and Power BI.',
        icon: 'Database',
        category: 'data-intelligence',
        features: [
          'Data Engineering',
          'Data Migration',
          'Cloud Data Warehouse',
          'Power BI Reporting',
          'Advanced Analytics',
        ],
        technologies: ['Azure Synapse', 'Databricks', 'Snowflake', 'Power BI'],
      },
      {
        id: 'analytics',
        slug: 'analytics-and-business-insights',
        title: 'Analytics & Business Insights',
        shortDescription:
          'Turn data into actionable business intelligence.',
        fullDescription:
          'Cross-platform analytics with Azure, AWS, and Google Cloud for deep business insights.',
        icon: 'BarChart3',
        category: 'data-intelligence',
        features: [
          'Azure Synapse Analytics',
          'Azure Databricks',
          'AWS Lake Formation',
          'Amazon SageMaker',
          'Google BigQuery',
          'Google Dataflow',
        ],
        technologies: ['Azure', 'AWS', 'Google Cloud'],
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'Artificial Intelligence & Machine Learning',
    services: [
      {
        id: 'ai-ml',
        slug: 'artifical-intelligence-and-machine-learning',
        title: 'AI & Machine Learning',
        shortDescription:
          'Build intelligent systems powered by AI and ML.',
        fullDescription:
          'From predictive systems to computer vision, we build AI-powered solutions that transform business operations.',
        icon: 'Brain',
        category: 'ai-ml',
        features: [
          'Predictive Systems',
          'NLP (Chatbots, Speech-to-Text, Sentiment Analysis)',
          'Data Mining',
          'Computer Vision',
          'Deep Learning',
        ],
      },
    ],
  },
  {
    id: 'cloud-consulting',
    title: 'Cloud Consulting',
    services: [
      {
        id: 'cloud-migration',
        slug: 'cloud-migration-app-modernization',
        title: 'Cloud Migration & App Modernization',
        shortDescription:
          'Assess, migrate, and modernize with 30% cost reduction.',
        fullDescription:
          'Complete cloud migration framework — Assess → Migrate → Modernize — with microservices, DevOps, containers, and PaaS.',
        icon: 'CloudUpload',
        category: 'cloud-consulting',
        features: [
          'Microservices Architecture',
          'DevOps Integration',
          'Containerization',
          'PaaS Solutions',
          '30% Cost Reduction',
          '50% Decrease in Effort',
        ],
      },
      {
        id: 'cloud-native',
        slug: 'cloud-native-application-development',
        title: 'Cloud Native Application Development',
        shortDescription:
          'Build scalable SaaS applications from the ground up.',
        fullDescription:
          'Cloud-native development with SaaS architecture, microservices, containerization, and agile methodology.',
        icon: 'Cloud',
        category: 'cloud-consulting',
        features: [
          'SaaS Architecture',
          'Microservices',
          'Containerization',
          'Agile Methodology',
        ],
      },
    ],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Consulting',
    services: [
      {
        id: 'ui-ux',
        slug: 'ui-ux-design-development',
        title: 'UI/UX Design & Development',
        shortDescription:
          'Create engaging user experiences with modern design.',
        fullDescription:
          'End-to-end UI/UX services from consulting and prototyping to development and usability testing.',
        icon: 'Palette',
        category: 'ui-ux',
        features: [
          'UI/UX Consulting',
          'Prototyping',
          'Information Architecture',
          'Usability Testing',
          'Wireframing',
          'UI/UX Development',
        ],
      },
    ],
  },
];

/** Flat list of all services */
export const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((cat) => cat.services);

/** Get service by slug */
export const getServiceBySlug = (slug: string) =>
  ALL_SERVICES.find((s) => s.slug === slug);
