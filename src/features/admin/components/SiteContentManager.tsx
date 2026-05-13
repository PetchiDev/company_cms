import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { siteContentService } from '@/api/services/cmsService';
import type { SiteContent } from '@/types/cms.types';
import { Save, Loader2, Phone, Share2, Building2, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';
import ImageInputWithUpload from '@/features/admin/components/ImageInputWithUpload';

type TabKey = 'profile' | 'contact' | 'social' | 'pages';

const DEFAULT_SITE_CONTENT: Record<string, string> = {
  /* ── Company Profile ── */
  company_name: '',
  company_legal_name: '',
  company_tagline: '',
  company_motto: '',
  company_vision: '',
  company_mission: '',
  about_vision_image: '',
  about_mission_image: '',
  /* ── Contact ── */
  contact_phone: '',
  contact_email: '',
  office_us_label: 'US Office',
  office_us_address: '',
  office_india_label: 'India Office',
  office_india_address: '',
  /* ── Social ── */
  social_linkedin: '',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  job_portal_url: '',
  /* ── Home Page ── */
  hero_title_line1: 'Revolutionizing',
  hero_title_line2: 'Business with Smart',
  hero_title_line3: 'IT Solutions',
  clients_heading: 'Elevating Experiences for Our Esteemed Clients',
  clients_subheading: 'Trusted by global industry leaders to deliver excellence and innovation.',
  services_section_label: 'What We Do',
  services_section_title: 'Our Services',
  services_section_subtitle: 'Comprehensive IT solutions to transform your business',
  testimonials_section_label: 'Testimonials',
  testimonials_section_title: 'What Our Clients Say',
  casestudies_section_label: 'Our Work',
  casestudies_section_title: 'Case Studies',
  certifications_section_label: 'Certifications',
  certifications_section_title: 'Our Credentials',
  contact_cta_label: 'Get Started',
  contact_cta_title: "Let's Build Something Great Together",
  contact_cta_desc: "Have a project in mind? We'd love to hear about it. Drop us a message and we'll get back to you as soon as possible.",
  /* ── About Page ── */
  about_hero_label: 'Who We Are',
  about_vision_badge: 'Future-Focused',
  about_vision_subtitle: 'Aspiration & Direction',
  about_vision_pillar1_title: 'Integrated Growth Partnership',
  about_vision_pillar1_desc: 'Delivering mutual success with a strong emphasis on client trust and transparency.',
  about_vision_pillar2_title: 'Ethical & Transparent Standards',
  about_vision_pillar2_desc: 'Setting the gold standard of partnership by prioritizing corporate ethics and honesty.',
  about_mission_badge: 'Action-Oriented',
  about_mission_subtitle: 'Execution & Deliverables',
  about_mission_pillar1_title: 'Value with Quality of Work',
  about_mission_pillar1_desc: 'Creating highly robust application portfolios using top-tier, modern software standards.',
  about_mission_pillar2_title: 'Empowering Employee Quality',
  about_mission_pillar2_desc: 'Fostering an inclusive workspace environment where premium talent can thrive and innovate.',
  about_values_label: 'What Drives Us',
  about_values_title: 'Core Values',
  about_value_1_title: 'Customer Focus',
  about_value_1_desc: 'Value customers with quality of work.',
  about_value_2_title: 'Transparency',
  about_value_2_desc: 'Be the partner of choice by being transparent & ethical.',
  about_value_3_title: 'Innovation',
  about_value_3_desc: 'Constantly explore new technologies and methodologies.',
  about_value_4_title: 'Team Work',
  about_value_4_desc: 'Value employees for their quality of work.',
  about_value_5_title: 'Agility',
  about_value_5_desc: 'Adapt quickly to changing business needs.',
  about_value_6_title: 'Fun Place To Work',
  about_value_6_desc: 'Creating an enjoyable and engaging work environment.',
  about_approach_label: 'How We Work',
  about_approach_title: 'Our Approach',
  about_approach_1_title: 'Listen',
  about_approach_1_desc: 'Listen to your concerns, needs, challenges, and goals.',
  about_approach_2_title: 'Understand',
  about_approach_2_desc: 'Understand your business, market sector, and competitors.',
  about_approach_3_title: 'Deliver',
  about_approach_3_desc: 'Combine with technical expertise to deliver optimal, cost-effective solutions.',
  /* ── Services Page ── */
  services_hero_label: 'Our Expertise',
  services_hero_title: 'Business & Services',
  services_hero_subtitle: 'Comprehensive IT solutions to transform your business and accelerate digital growth',
  /* ── Careers Page ── */
  careers_hero_label: 'Join Our Team',
  careers_hero_title: 'Build Your Career',
  careers_cta_title: 'Ready to Join?',
  careers_cta_desc: 'Explore our current openings and find the perfect role for you.',
  /* ── Case Studies Page ── */
  casestudies_hero_label: 'Our Work',
  casestudies_hero_title: 'Case Studies',
  /* ── Contact Page ── */
  contact_hero_label: 'Get in Touch',
  contact_hero_title: 'Contact Us',
  contact_section_title: "Let's Talk",
  contact_section_desc: "We'd love to hear about your project. Reach out and let's build something great together.",
};

const SiteContentManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');

  const { data: content = [], isLoading } = useQuery<SiteContent[]>({
    queryKey: [QUERY_KEYS.SITE_CONTENT],
    queryFn: siteContentService.fetchAll,
  });

  const [formState, setFormState] = useState<Record<string, string>>(DEFAULT_SITE_CONTENT);
  const [savingSection, setSavingSection] = useState(false);

  useEffect(() => {
    const state: Record<string, string> = { ...DEFAULT_SITE_CONTENT };
    if (content && content.length > 0) {
      content.forEach((item) => {
        state[item.key] = item.value;
      });
    }
    setFormState(state);
  }, [content]);

  const getTabKeys = (tab: TabKey): string[] => {
    if (tab === 'profile') {
      return ['company_name', 'company_legal_name', 'company_tagline', 'company_motto', 'company_vision', 'company_mission', 'about_vision_image', 'about_mission_image'];
    }
    if (tab === 'contact') {
      return ['contact_phone', 'contact_email', 'office_us_label', 'office_us_address', 'office_india_label', 'office_india_address'];
    }
    if (tab === 'social') {
      return ['social_linkedin', 'social_facebook', 'social_instagram', 'social_twitter', 'job_portal_url'];
    }
    /* pages tab — everything else */
    return Object.keys(DEFAULT_SITE_CONTENT).filter(
      (k) =>
        !['company_', 'about_vision_image', 'about_mission_image', 'contact_', 'office_', 'social_', 'job_portal_url'].some((prefix) => k.startsWith(prefix))
    );
  };

  const isTabDirty = () => {
    const keys = getTabKeys(activeTab);
    return keys.some((key) => {
      const dbVal = content?.find((item) => item.key === key)?.value;
      return formState[key] !== (dbVal !== undefined ? dbVal : DEFAULT_SITE_CONTENT[key]);
    });
  };

  const handleChange = (key: string, value: string) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSection = async () => {
    setSavingSection(true);
    try {
      const keys = getTabKeys(activeTab);
      const promises = keys.map((key) => {
        const val = formState[key] || '';
        return siteContentService.update(key, val);
      });
      await Promise.all(promises);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITE_CONTENT] });
      showToast('Site settings updated and synced!', 'success');
    } catch (err) {
      showToast('Failed to save settings.', 'error');
    } finally {
      setSavingSection(false);
    }
  };

  if (isLoading && content.length === 0) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} color="var(--primary-orange)" />
      </div>
    );
  }

  const renderField = (key: string, label: string, type: 'text' | 'textarea' = 'text', Icon?: React.ComponentType<{ size?: number }>) => {
    const dbVal = content?.find((item) => item.key === key)?.value;
    const isDirty = formState[key] !== (dbVal !== undefined ? dbVal : DEFAULT_SITE_CONTENT[key]);

    return (
      <div className={`form-group ${isDirty ? 'is-dirty' : ''}`} key={key}>
        <div className="flex-between">
          <label>{label}</label>
          {isDirty && <span className="dirty-indicator">MODIFIED</span>}
        </div>
        <div className="input-with-icon">
           {Icon && <div className="input-icon"><Icon size={16} /></div>}
           {type === 'textarea' ? (
            <textarea
              value={formState[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className="admin-input"
              rows={3}
              style={{ resize: 'vertical' }}
            />
          ) : (
            <input
              type="text"
              value={formState[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className="admin-input"
            />
          )}
        </div>
      </div>
    );
  };

  const tabTitle: Record<TabKey, string> = {
    profile: 'Profile Configuration',
    contact: 'Contact Configuration',
    social: 'Social Configuration',
    pages: 'Page Content Configuration',
  };

  return (
    <div className="admin-content-area">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page__title">Global Settings</h1>
          <p className="admin-page__subtitle">Control company identifiers, addresses, social connectivity, and page content</p>
        </div>
      </div>

      <div className="admin-tabs" style={{ flexWrap: 'wrap' }}>
        <button onClick={() => setActiveTab('profile')} className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}>
          <Building2 size={18} /> <span>Company Profile</span>
        </button>
        <button onClick={() => setActiveTab('contact')} className={`admin-tab ${activeTab === 'contact' ? 'active' : ''}`}>
          <Phone size={18} /> <span>Contact Channels</span>
        </button>
        <button onClick={() => setActiveTab('social')} className={`admin-tab ${activeTab === 'social' ? 'active' : ''}`}>
          <Share2 size={18} /> <span>Social & Links</span>
        </button>
        <button onClick={() => setActiveTab('pages')} className={`admin-tab ${activeTab === 'pages' ? 'active' : ''}`}>
          <FileText size={18} /> <span>Page Content</span>
        </button>
      </div>

      <div className="admin-card-v2 slide-in-up" style={{ minHeight: '400px' }}>
        <div className="admin-card-v2__header">
           <h3>{tabTitle[activeTab]}</h3>
           <button
            onClick={handleSaveSection}
            disabled={savingSection || !isTabDirty()}
            className="creative-btn creative-btn--sliding parallelogram"
            style={{ 
              background: isTabDirty() ? 'var(--primary-orange)' : 'var(--bg-light)', 
              color: isTabDirty() ? 'white' : 'var(--muted-text)',
              padding: '0.6rem 2rem',
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {savingSection ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
            <span>{savingSection ? 'SAVING...' : 'SAVE CHANGES'}</span>
          </button>
        </div>
        <div className="admin-card-v2__body">
           <AnimatePresence mode="wait">
             <motion.div
               key={activeTab}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.2 }}
               className="modal-form"
               style={{ padding: 0 }}
             >
                {activeTab === 'profile' && (
                  <div className="form-grid-2">
                    {renderField('company_name', 'Brand Name')}
                    {renderField('company_legal_name', 'Legal Entity Name')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('company_tagline', 'Strategic Tagline', 'textarea')}
                    </div>
                    {renderField('company_motto', 'Corporate Motto')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('company_vision', 'Vision Statement', 'textarea')}
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('company_mission', 'Mission Statement', 'textarea')}
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                       <div className="form-separator">About Us Concept Illustrations</div>
                     </div>
                     <div style={{ gridColumn: 'span 1' }}>
                       <ImageInputWithUpload
                         value={formState.about_vision_image || ''}
                         onChange={(url) => handleChange('about_vision_image', url)}
                         label="Corporate Vision Illustration"
                         placeholder="Paste image URL or click Upload"
                         category="about"
                       />
                     </div>
                     <div style={{ gridColumn: 'span 1' }}>
                       <ImageInputWithUpload
                         value={formState.about_mission_image || ''}
                         onChange={(url) => handleChange('about_mission_image', url)}
                         label="Corporate Mission Illustration"
                         placeholder="Paste image URL or click Upload"
                         category="about"
                       />
                     </div>
                  </div>
                )}

                {activeTab === 'contact' && (
                  <div className="form-grid-2">
                    {renderField('contact_phone', 'Primary Contact Number')}
                    {renderField('contact_email', 'Sales / Support Email')}
                    <div style={{ gridColumn: 'span 2' }}>
                       <div className="form-separator">Corporate Offices</div>
                    </div>
                    {renderField('office_us_label', 'US Office Label')}
                    {renderField('office_us_address', 'US Office Address', 'textarea')}
                    {renderField('office_india_label', 'India Office Label')}
                    {renderField('office_india_address', 'India Office Address', 'textarea')}
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="form-grid-2">
                    {renderField('social_linkedin', 'LinkedIn Profile URL')}
                    {renderField('social_facebook', 'Facebook Page URL')}
                    {renderField('social_instagram', 'Instagram Account')}
                    {renderField('social_twitter', 'Twitter / X Handle')}
                    <div style={{ gridColumn: 'span 2' }}>
                       <div className="form-separator">External Portals</div>
                    </div>
                    {renderField('job_portal_url', 'Careers/Job Portal URL')}
                  </div>
                )}

                {activeTab === 'pages' && (
                  <div className="form-grid-2">
                    {/* ── HOME PAGE ── */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Home Page — Hero Section</div>
                    </div>
                    {renderField('hero_title_line1', 'Hero Title Line 1')}
                    {renderField('hero_title_line2', 'Hero Title Line 2')}
                    {renderField('hero_title_line3', 'Hero Title Line 3 (Gradient)')}
                    <div style={{ gridColumn: 'span 2' }}></div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Home Page — Client Logos Section</div>
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('clients_heading', 'Client Logos Heading')}
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('clients_subheading', 'Client Logos Subheading')}
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Home Page — Section Headings</div>
                    </div>
                    {renderField('services_section_label', 'Services Label')}
                    {renderField('services_section_title', 'Services Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('services_section_subtitle', 'Services Subtitle')}
                    </div>
                    {renderField('testimonials_section_label', 'Testimonials Label')}
                    {renderField('testimonials_section_title', 'Testimonials Title')}
                    {renderField('casestudies_section_label', 'Case Studies Label')}
                    {renderField('casestudies_section_title', 'Case Studies Title')}
                    {renderField('certifications_section_label', 'Certifications Label')}
                    {renderField('certifications_section_title', 'Certifications Title')}

                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Home Page — Contact CTA</div>
                    </div>
                    {renderField('contact_cta_label', 'CTA Label')}
                    {renderField('contact_cta_title', 'CTA Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('contact_cta_desc', 'CTA Description', 'textarea')}
                    </div>

                    {/* ── ABOUT PAGE ── */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">About Page — Hero & Vision</div>
                    </div>
                    {renderField('about_hero_label', 'About Hero Label')}
                    {renderField('about_vision_badge', 'Vision Badge Text')}
                    {renderField('about_vision_subtitle', 'Vision Subtitle')}
                    {renderField('about_vision_pillar1_title', 'Vision Pillar 1 Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('about_vision_pillar1_desc', 'Vision Pillar 1 Description')}
                    </div>
                    {renderField('about_vision_pillar2_title', 'Vision Pillar 2 Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('about_vision_pillar2_desc', 'Vision Pillar 2 Description')}
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">About Page — Mission</div>
                    </div>
                    {renderField('about_mission_badge', 'Mission Badge Text')}
                    {renderField('about_mission_subtitle', 'Mission Subtitle')}
                    {renderField('about_mission_pillar1_title', 'Mission Pillar 1 Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('about_mission_pillar1_desc', 'Mission Pillar 1 Description')}
                    </div>
                    {renderField('about_mission_pillar2_title', 'Mission Pillar 2 Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('about_mission_pillar2_desc', 'Mission Pillar 2 Description')}
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">About Page — Core Values</div>
                    </div>
                    {renderField('about_values_label', 'Values Section Label')}
                    {renderField('about_values_title', 'Values Section Title')}
                    {[1,2,3,4,5,6].map((n) => (
                      <div key={`val-${n}`} style={{ gridColumn: 'span 1' }}>
                        {renderField(`about_value_${n}_title`, `Value ${n} Title`)}
                        {renderField(`about_value_${n}_desc`, `Value ${n} Description`)}
                      </div>
                    ))}

                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">About Page — Our Approach</div>
                    </div>
                    {renderField('about_approach_label', 'Approach Section Label')}
                    {renderField('about_approach_title', 'Approach Section Title')}
                    {[1,2,3].map((n) => (
                      <div key={`app-${n}`} style={{ gridColumn: 'span 1' }}>
                        {renderField(`about_approach_${n}_title`, `Approach Step ${n} Title`)}
                        {renderField(`about_approach_${n}_desc`, `Approach Step ${n} Description`)}
                      </div>
                    ))}

                    {/* ── SERVICES PAGE ── */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Services Page</div>
                    </div>
                    {renderField('services_hero_label', 'Hero Label')}
                    {renderField('services_hero_title', 'Hero Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('services_hero_subtitle', 'Hero Subtitle')}
                    </div>

                    {/* ── CAREERS PAGE ── */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Careers Page</div>
                    </div>
                    {renderField('careers_hero_label', 'Hero Label')}
                    {renderField('careers_hero_title', 'Hero Title')}
                    {renderField('careers_cta_title', 'CTA Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('careers_cta_desc', 'CTA Description')}
                    </div>

                    {/* ── CASE STUDIES PAGE ── */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Case Studies Page</div>
                    </div>
                    {renderField('casestudies_hero_label', 'Hero Label')}
                    {renderField('casestudies_hero_title', 'Hero Title')}

                    {/* ── CONTACT PAGE ── */}
                    <div style={{ gridColumn: 'span 2' }}>
                      <div className="form-separator">Contact Page</div>
                    </div>
                    {renderField('contact_hero_label', 'Hero Label')}
                    {renderField('contact_hero_title', 'Hero Title')}
                    {renderField('contact_section_title', 'Section Title')}
                    <div style={{ gridColumn: 'span 2' }}>
                      {renderField('contact_section_desc', 'Section Description', 'textarea')}
                    </div>
                  </div>
                )}
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SiteContentManager;
