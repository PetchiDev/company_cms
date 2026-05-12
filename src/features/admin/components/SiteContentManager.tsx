import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { siteContentService } from '@/api/services/cmsService';
import type { SiteContent } from '@/types/cms.types';
import { Save, Loader2, Phone, Share2, Building2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SITE_CONTENT: Record<string, string> = {
  company_name: '',
  company_legal_name: '',
  company_tagline: '',
  company_motto: '',
  company_vision: '',
  company_mission: '',
  contact_phone: '',
  contact_email: '',
  office_us_label: 'US Office',
  office_us_address: '',
  office_india_label: 'India Office',
  office_india_address: '',
  social_linkedin: '',
  social_facebook: '',
  social_instagram: '',
  social_twitter: '',
  job_portal_url: '',
};

const SiteContentManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'contact' | 'social'>('profile');

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

  const getTabKeys = (tab: 'profile' | 'contact' | 'social') => {
    if (tab === 'profile') {
      return ['company_name', 'company_legal_name', 'company_tagline', 'company_motto', 'company_vision', 'company_mission'];
    }
    if (tab === 'contact') {
      return ['contact_phone', 'contact_email', 'office_us_label', 'office_us_address', 'office_india_label', 'office_india_address'];
    }
    return ['social_linkedin', 'social_facebook', 'social_instagram', 'social_twitter', 'job_portal_url'];
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

  return (
    <div className="admin-content-area">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page__title">Global Settings</h1>
          <p className="admin-page__subtitle">Control company identifiers, addresses, and social connectivity</p>
        </div>
      </div>

      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('profile')}
          className={`admin-tab ${activeTab === 'profile' ? 'active' : ''}`}
        >
          <Building2 size={18} /> <span>Company Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`admin-tab ${activeTab === 'contact' ? 'active' : ''}`}
        >
          <Phone size={18} /> <span>Contact Channels</span>
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`admin-tab ${activeTab === 'social' ? 'active' : ''}`}
        >
          <Share2 size={18} /> <span>Social & Links</span>
        </button>
      </div>

      <div className="admin-card-v2 slide-in-up" style={{ minHeight: '400px' }}>
        <div className="admin-card-v2__header">
           <h3 style={{ textTransform: 'capitalize' }}>{activeTab} Configuration</h3>
           <button
            onClick={handleSaveSection}
            disabled={savingSection || !isTabDirty()}
            className="creative-btn creative-btn--sliding parallelogram"
            style={{ 
              background: isTabDirty() ? 'var(--primary-orange)' : 'var(--bg-light)', 
              color: isTabDirty() ? 'white' : 'var(--muted-text)',
              padding: '0.6rem 2rem',
              fontSize: '0.85rem'
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
             </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SiteContentManager;
