-- ─── 1. DROP EXISTING TABLES IF THEY CONFLICT ───
-- Note: Do NOT drop 'admins' or 'images' if they already exist with data.
-- We are creating new tables for our CMS.

-- ─── 2. CREATE SERVICE CATEGORIES & SERVICES TABLES ───
CREATE TABLE IF NOT EXISTS public.service_categories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category_id TEXT REFERENCES public.service_categories(id) ON DELETE CASCADE,
    features TEXT[] DEFAULT '{}'::TEXT[],
    technologies TEXT[] DEFAULT '{}'::TEXT[],
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ─── 3. CREATE BLOG, TESTIMONIALS, CASE STUDIES & OTHER TABLES ───
CREATE TABLE IF NOT EXISTS public.site_content (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    section TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    value BIGINT NOT NULL,
    suffix TEXT NOT NULL DEFAULT '+',
    display TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name TEXT NOT NULL,
    client_title TEXT,
    company TEXT NOT NULL,
    quote TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.case_studies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    pdf_link TEXT,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.blog_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image TEXT NOT NULL,
    content TEXT, -- built-in editor rich text/HTML content
    link TEXT, -- external link fallback
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.culture_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);


-- ─── 4. ENABLE ROW LEVEL SECURITY (RLS) ON ALL TABLES ───
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.culture_highlights ENABLE ROW LEVEL SECURITY;


-- ─── 5. CREATE PUBLIC READ POLICIES (ANONYMOUS & PUBLIC USERS CAN SELECT) ───
CREATE POLICY "Allow public select" ON public.service_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.site_content FOR SELECT USING (TRUE);
CREATE POLICY "Allow public select" ON public.stats FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.certifications FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.testimonials FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.case_studies FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.blog_articles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Allow public select" ON public.culture_highlights FOR SELECT USING (is_active = TRUE);


-- ─── 6. CREATE FULL ADMIN WRITE POLICIES (AUTHENTICATED ADMINS CAN DO ALL) ───
CREATE POLICY "Allow admin manage" ON public.service_categories FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.services FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.site_content FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.stats FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.certifications FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.testimonials FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.case_studies FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.blog_articles FOR ALL TO authenticated USING (TRUE);
CREATE POLICY "Allow admin manage" ON public.culture_highlights FOR ALL TO authenticated USING (TRUE);


-- ─── 7. INSERT INITIAL SEED DATA FROM STATIC CONFIGS ───

-- Seed Site Content Texts
INSERT INTO public.site_content (key, value, section) VALUES
('company_name', 'Kryptos Info Sys', 'company'),
('company_legal_name', 'Kryptos Technologies', 'company'),
('company_website', 'https://www.kryptosinfosys.com', 'company'),
('company_tagline', 'Revolutionizing Business with Smart IT Solutions', 'company'),
('company_motto', 'Make IT Simple', 'company'),
('company_vision', 'Deliver services in a simple, easy to use and competitive manner for integrated partnership and growth. Be the partner of choice by being transparent & ethical.', 'company'),
('company_mission', '''Make IT Simple'' — Value customers with quality of work. Value employees for their quality of work.', 'company'),
('company_copyright', '© 2026 Kryptos', 'company'),
('contact_phone', '+1 201-201-7138', 'contact'),
('contact_email', 'sales@kryptosinfosys.com', 'contact'),
('office_us_label', 'US Office', 'contact'),
('office_us_address', 'Skymark Tower Suite, 214, 1521 North Cooper Street, Arlington, TX – 76011', 'contact'),
('office_india_label', 'India Office', 'contact'),
('office_india_address', 'B'' Wing, 1st floor, Narayana Complex, No 29, Sarathy Nagar, Velachery, Chennai, Tamil Nadu – 600042', 'contact'),
('social_linkedin', 'https://www.linkedin.com/company/kryptos-technologies/', 'social'),
('social_facebook', 'https://www.facebook.com/people/Kryptos-Technologies/100064887494336/', 'social'),
('social_instagram', 'https://www.instagram.com/kryptos_technologies/', 'social'),
('social_twitter', 'https://twitter.com/Kryptos_Tech06', 'social'),
('job_portal_url', 'https://app695.workline.hr/Candidate/GeneralOpening.aspx', 'careers')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Service Categories
INSERT INTO public.service_categories (id, title, sort_order) VALUES
('it-transformation', 'IT Transformation & Automation', 0),
('data-intelligence', 'Data Intelligence', 1),
('ai-ml', 'Artificial Intelligence & Machine Learning', 2),
('cloud-consulting', 'Cloud Consulting', 3),
('ui-ux', 'UI/UX Consulting', 4)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- Seed Services
INSERT INTO public.services (slug, title, short_description, full_description, icon, category_id, features, technologies, sort_order) VALUES
('application-modernization', 'Application Modernization', 'Modernize legacy apps for the digital era with cutting-edge technologies.', 'Legacy apps-a modernize panni digital era-kku ready pannuvom. We transform outdated applications into modern, scalable solutions.', 'RefreshCw', 'it-transformation', ARRAY['App Development', 'Modernization', 'Performance Management', 'Support & Maintenance'], ARRAY['.NET', 'Python', 'Angular', 'Node.js', 'JavaScript', 'React Native', 'React JS'], 0),
('application-operations', 'Application Operations', 'Traditional and cloud-native operational models for optimal performance.', 'Provide benefits of both traditional and cloud-native models with agile environment management.', 'Settings', 'it-transformation', ARRAY['Agile Environment Management', 'Application Intelligence & Monitoring', 'Migration Factory', 'SAP on Cloud', 'Platform Management as a Service'], ARRAY[]::TEXT[], 1),
('devops-containerization', 'DevOps & Containerization', '6-stage DevOps process from analysis to deployment.', 'Complete DevOps pipeline with containerization — from analysis to building, publishing, container deployment, testing, and final deployment.', 'Container', 'it-transformation', ARRAY['Azure DevOps', 'AWS DevOps', 'CI/CD', 'Infrastructure Automation', 'DevOps Consulting'], ARRAY[]::TEXT[], 2),
('robotic-process-automation', 'Robotic Process Automation', 'Automate repetitive processes with intelligent RPA solutions.', 'End-to-end RPA services from assessment to implementation and managed services.', 'Bot', 'it-transformation', ARRAY['RPA Assessment', 'Process Mining', 'Consulting', 'Development', 'Implementation', 'Support & Managed Services'], ARRAY[]::TEXT[], 3),
('application-testing', 'Application Testing', 'Comprehensive testing services for quality assurance.', 'Full spectrum testing services ensuring quality, performance, and security.', 'TestTube', 'it-transformation', ARRAY['Functional Testing', 'Performance Testing', 'Security Testing', 'Web App Testing', 'Automated Testing', 'Regression Testing', 'QA Testing as a Service'], ARRAY[]::TEXT[], 4),
('data-modernization', 'Data Modernization', 'Azure-focused data engineering and migration solutions.', 'Modern data infrastructure with Azure Synapse, Databricks, Snowflake, and Power BI.', 'Database', 'data-intelligence', ARRAY['Data Engineering', 'Data Migration', 'Cloud Data Warehouse', 'Power BI Reporting', 'Advanced Analytics'], ARRAY['Azure Synapse', 'Databricks', 'Snowflake', 'Power BI'], 5),
('analytics-and-business-insights', 'Analytics & Business Insights', 'Turn data into actionable business intelligence.', 'Cross-platform analytics with Azure, AWS, and Google Cloud for deep business insights.', 'BarChart3', 'data-intelligence', ARRAY['Azure Synapse Analytics', 'Azure Databricks', 'AWS Lake Formation', 'Amazon SageMaker', 'Google BigQuery', 'Google Dataflow'], ARRAY['Azure', 'AWS', 'Google Cloud'], 6),
('artifical-intelligence-and-machine-learning', 'AI & Machine Learning', 'Build intelligent systems powered by AI and ML.', 'From predictive systems to computer vision, we build AI-powered solutions that transform business operations.', 'Brain', 'ai-ml', ARRAY['Predictive Systems', 'NLP (Chatbots, Speech-to-Text, Sentiment Analysis)', 'Data Mining', 'Computer Vision', 'Deep Learning'], ARRAY[]::TEXT[], 7),
('cloud-migration-app-modernization', 'Cloud Migration & App Modernization', 'Assess, migrate, and modernize with 30% cost reduction.', 'Complete cloud migration framework — Assess → Migrate → Modernize — with microservices, DevOps, containers, and PaaS.', 'CloudUpload', 'cloud-consulting', ARRAY['Microservices Architecture', 'DevOps Integration', 'Containerization', 'PaaS Solutions', '30% Cost Reduction', '50% Decrease in Effort'], ARRAY[]::TEXT[], 8),
('cloud-native-application-development', 'Cloud Native Application Development', 'Build scalable SaaS applications from the ground up.', 'Cloud-native development with SaaS architecture, microservices, containerization, and agile methodology.', 'Cloud', 'cloud-consulting', ARRAY['SaaS Architecture', 'Microservices', 'Containerization', 'Agile Methodology'], ARRAY[]::TEXT[], 9),
('ui-ux-design-development', 'UI/UX Design & Development', 'Create engaging user experiences with modern design.', 'End-to-end UI/UX services from consulting and prototyping to development and usability testing.', 'Palette', 'ui-ux', ARRAY['UI/UX Consulting', 'Prototyping', 'Information Architecture', 'Usability Testing', 'Wireframing', 'UI/UX Development'], ARRAY[]::TEXT[], 10)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

-- Seed Stats
INSERT INTO public.stats (label, value, suffix, display, sort_order) VALUES
('Hours of Experience', 250000, '+', '2.5 Lakh', 0),
('Happy Clients', 100, '+', '100+', 1),
('Projects', 500, '+', '500+', 2),
('Client Retention Rate', 95, '%', '95%', 3);

-- Seed Certifications
INSERT INTO public.certifications (name, url, sort_order) VALUES
('Microsoft Partner', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/01.png', 0),
('Certified Azure', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/02.png', 1),
('AWS Partner', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/03.png', 2);

-- Seed Testimonials
INSERT INTO public.testimonials (client_name, client_title, company, quote, logo_url, sort_order) VALUES
('Lubbock Auto Spa', '', 'Lubbock Auto Spa', 'Kryptos revolutionized our operations with a mobile app for car VIN scanning, QR codes, and QuickBooks integration. Truly transformative!', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/laslogo.png', 0),
('Mr. Kareem Merritt', 'Founder & CEO', 'Intras Cloud Services', 'The ticketing, provision, and Zoho API integration delivered a level of efficiency that has greatly improved our day-to-day operations.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/intrascloudservices_logo.jpg', 1),
('Mr. Marcus', 'CEO', 'VLead', 'Azure lift-and-shift, .NET 2.0 to .NET Core, AngularJS to Angular on Linux — substantial cost savings and modernization achieved.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/images.jpg', 2);

-- Seed Case Studies
INSERT INTO public.case_studies (title, category, description, thumbnail, pdf_link, sort_order) VALUES
('Migration - SharePoint Online', 'Migration', 'Complete SharePoint Online migration with zero downtime.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Migration-SharePoint-Online-Im.png-V2.png', NULL, 0),
('Power BI Virtualization', 'Insights & Intelligence', 'Advanced Power BI dashboards for business intelligence.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation-Im.png-V2.png', NULL, 1),
('Power Apps Expense Tracking App', 'Application Modernization', 'Custom expense tracking with Power Apps integration.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-Apps-Expense-Tracking-Apps-Im.png-V2.png', 'http://kryptosinfosys.com/wp-content/uploads/2024/02/Power-Apps-Expense-Tracking-App.pdf', 2),
('Power of Cloud for Digital Transformation', 'Application Modernization', 'Leveraging cloud technologies for complete digital transformation.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation-Im.png-V2.png', 'http://kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation.pdf', 3),
('Speech to Text Recognition', 'AI & Machine Learning', 'AI-powered speech recognition system implementation.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Power-of-Cloud-for-Digital-Transformation-Im.png-V2.png', NULL, 4),
('Cloud Migration and VDI Implementation', 'Cloud', 'Cloud migration and VDI setup for health & wellness client.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Migration-SharePoint-Online-Im.png-V2.png', NULL, 5);

-- Seed Blog Articles
INSERT INTO public.blog_articles (title, excerpt, image, link, date, sort_order) VALUES
('Platform Engineering Services. Use it to gain a Competitive Advantage', 'Discover how platform engineering services can give your business a strategic edge in the market.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Application-Platform-Engineering.webp', 'https://www.kryptosinfosys.com/platform-engineering-services-use-it-to-gain-a-competitive-advantage/', '2024-03-15', 0),
('Benefits of Implementing Custom IT Solutions to Your Business', 'Learn why custom IT solutions outperform off-the-shelf software for enterprise growth.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/WhatsApp-Image-2022-12-21-at-8.35.09-PM.webp', 'https://www.kryptosinfosys.com/benefits-of-implementing-custom-it-solutions-to-your-business/', '2024-02-20', 1),
('Build Intelligent Business Empowered with AI & ML Services', 'How AI and Machine Learning can transform your business operations and decision making.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/AI-Machine-Learning-Services-Kryptos.webp', 'https://www.kryptosinfosys.com/build-intelligent-business-empowered-with-ai-machine-learning-services/', '2024-01-10', 2),
('Why Do Businesses Need to Adopt Application Maintenance & Support Services?', 'The critical importance of ongoing application maintenance for business continuity.', 'https://www.kryptosinfosys.com/wp-content/uploads/2023/03/GettyImages-1157345255.jpg', 'https://www.kryptosinfosys.com/blog/', '2023-12-05', 3),
('Best Practices for SharePoint Document Management', 'Optimize your SharePoint environment for efficient document management and collaboration.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/Application-Platform-Engineering.webp', 'https://www.kryptosinfosys.com/blog/', '2023-11-15', 4),
('Benefits of Using Power BI in Your Business', 'Unlock data-driven insights with Microsoft Power BI for smarter business decisions.', 'https://www.kryptosinfosys.com/wp-content/uploads/2024/02/WhatsApp-Image-2022-12-21-at-8.35.09-PM.webp', 'https://www.kryptosinfosys.com/blog/', '2023-10-20', 5);

-- Seed Culture Highlights
INSERT INTO public.culture_highlights (icon, title, description, sort_order) VALUES
('MapPin', 'Work Where You Live', 'City-based work with flexible locations.', 0),
('BookOpen', 'Feed Your Curiosity', 'Flexible learning with paid certifications.', 1),
('TrendingUp', 'Choose Your Career', 'No up-or-out pressure — grow at your own pace.', 2),
('Heart', 'Cultivate Well-being', 'Holistic benefits for mind and body.', 3),
('Sparkles', 'Find the Fun', 'Book clubs, speaking events, resort retreats.', 4),
('Coffee', 'Love Your Workspace', 'Modern offices with free snacks and amenities.', 5);
