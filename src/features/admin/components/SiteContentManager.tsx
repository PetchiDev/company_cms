import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { siteContentService } from '@/api/services/cmsService';
import { Save, Loader2, Info, Phone, Share2, CheckCircle2 } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'profile' | 'contact' | 'social'>('profile');

  const { data: content, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.SITE_CONTENT],
    queryFn: siteContentService.fetchAll,
  });

  const [formState, setFormState] = useState<Record<string, string>>(DEFAULT_SITE_CONTENT);
  const [savingSection, setSavingSection] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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
    setSuccessMsg(null);
    try {
      const keys = getTabKeys(activeTab);
      // Only upsert modified keys to avoid redundant writes
      const promises = keys.map((key) => {
        const val = formState[key] || '';
        return siteContentService.update(key, val);
      });
      await Promise.all(promises);
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SITE_CONTENT] });
      
      setSuccessMsg(`${activeTab === 'profile' ? 'Company Profile' : activeTab === 'contact' ? 'Contact Details' : 'Social Links'} updated successfully and synced with the live site!`);
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error('Error saving section:', err);
    } finally {
      setSavingSection(false);
    }
  };

  if (isLoading && (!content || content.length === 0)) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  const renderField = (key: string, label: string, type: 'text' | 'textarea' = 'text') => {
    const dbVal = content?.find((item) => item.key === key)?.value;
    const isDirty = formState[key] !== (dbVal !== undefined ? dbVal : DEFAULT_SITE_CONTENT[key]);

    return (
      <div className="admin-content-field" key={key} style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-text)' }}>
            {label} {isDirty && <span style={{ color: 'var(--primary-orange)', fontSize: '0.75rem', fontWeight: 600, marginLeft: '0.5rem' }}>(edited)</span>}
          </label>
        </div>
        {type === 'textarea' ? (
          <textarea
            value={formState[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className="admin-input"
            rows={4}
            style={{ width: '100%', resize: 'vertical', background: 'white', border: isDirty ? '1px solid var(--primary-orange)' : '1px solid rgba(0,0,0,0.1)' }}
          />
        ) : (
          <input
            type="text"
            value={formState[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className="admin-input"
            style={{ width: '100%', background: 'white', border: isDirty ? '1px solid var(--primary-orange)' : '1px solid rgba(0,0,0,0.1)' }}
          />
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Toast Notification */}
      {successMsg && (
        <div style={{
          position: 'fixed',
          top: '2rem',
          right: '2rem',
          background: 'var(--dark-navy)',
          borderLeft: '4px solid #10b981',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1100,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease',
        }}>
          <CheckCircle2 size={18} style={{ color: '#10b981' }} />
          <span>{successMsg}</span>
        </div>
      )}

      <h1 className="admin-page__title">Site Content Manager</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('profile')}
          className="btn"
          style={{
            background: activeTab === 'profile' ? 'var(--primary-blue)' : 'transparent',
            color: activeTab === 'profile' ? 'white' : 'var(--dark-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Info size={16} /> Company Profile
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className="btn"
          style={{
            background: activeTab === 'contact' ? 'var(--primary-blue)' : 'transparent',
            color: activeTab === 'contact' ? 'white' : 'var(--dark-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Phone size={16} /> Contact Details
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className="btn"
          style={{
            background: activeTab === 'social' ? 'var(--primary-blue)' : 'transparent',
            color: activeTab === 'social' ? 'white' : 'var(--dark-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Share2 size={16} /> Social & Portals
        </button>
      </div>

      <div style={{ background: 'var(--bg-light)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
        {activeTab === 'profile' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--dark-navy)' }}>General Profile Settings</h3>
            {renderField('company_name', 'Company Name')}
            {renderField('company_legal_name', 'Legal Entity Name')}
            {renderField('company_tagline', 'Tagline', 'textarea')}
            {renderField('company_motto', 'Motto / Theme Statement')}
            {renderField('company_vision', 'Vision Statement', 'textarea')}
            {renderField('company_mission', 'Mission Statement', 'textarea')}
          </div>
        )}

        {activeTab === 'contact' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--dark-navy)' }}>Corporate Offices & Communication</h3>
            {renderField('contact_phone', 'Primary Contact Phone Number')}
            {renderField('contact_email', 'Sales/Corporate Email Address')}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)', margin: '2rem 0' }} />
            <h4 style={{ marginBottom: '1rem', color: 'var(--dark-navy)' }}>US Corporate Office</h4>
            {renderField('office_us_label', 'Office Name (Label)')}
            {renderField('office_us_address', 'Full Postal Address', 'textarea')}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)', margin: '2rem 0' }} />
            <h4 style={{ marginBottom: '1rem', color: 'var(--dark-navy)' }}>India Corporate Office</h4>
            {renderField('office_india_label', 'Office Name (Label)')}
            {renderField('office_india_address', 'Full Postal Address', 'textarea')}
          </div>
        )}

        {activeTab === 'social' && (
          <div>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--dark-navy)' }}>Social Links & Integrations</h3>
            {renderField('social_linkedin', 'LinkedIn Handle')}
            {renderField('social_facebook', 'Facebook Page URL')}
            {renderField('social_instagram', 'Instagram Profile')}
            {renderField('social_twitter', 'Twitter Account')}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.05)', margin: '2rem 0' }} />
            <h4 style={{ marginBottom: '1rem', color: 'var(--dark-navy)' }}>Talent Acquisition / Portals</h4>
            {renderField('job_portal_url', 'Candidate Application Portal URL')}
          </div>
        )}

        {/* Unified Save Button at the Bottom of the Section */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSaveSection}
            disabled={savingSection || !isTabDirty()}
            style={{
              padding: '0.75rem 2rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: isTabDirty() ? '#EE4F29' : 'rgba(0, 0, 0, 0.1)',
              color: '#FFFFFF',
              fontWeight: 600,
              border: 'none',
              borderRadius: 'var(--radius-md)',
              opacity: isTabDirty() ? 1 : 0.45,
              cursor: isTabDirty() ? 'pointer' : 'not-allowed',
              boxShadow: isTabDirty() ? 'var(--shadow-md)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {savingSection ? <Loader2 className="spin" size={16} /> : <Save size={16} />}
            {savingSection ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiteContentManager;
