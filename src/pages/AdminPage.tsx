import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Upload, Eye, EyeOff, Trash2, Image as ImageIcon, MessageSquare, LayoutDashboard, X } from 'lucide-react';
import { imageService } from '@/api/services/imageService';
import { contactService } from '@/api/services/contactService';
import { IMAGE_CATEGORIES } from '@/constants/appConstants';
import type { ImageRecord, ImageCategory } from '@/types/image.types';
import type { ContactSubmission } from '@/types/contact.types';
import './AdminPage.css';

import SiteContentManager from '@/features/admin/components/SiteContentManager';
import ServicesManager from '@/features/admin/components/ServicesManager';
import BlogManager from '@/features/admin/components/BlogManager';
import CaseStudyManager from '@/features/admin/components/CaseStudyManager';
import TestimonialManager from '@/features/admin/components/TestimonialManager';
import StatsManager from '@/features/admin/components/StatsManager';
import CertificationManager from '@/features/admin/components/CertificationManager';
import CultureManager from '@/features/admin/components/CultureManager';

const AdminPage = () => {
  const location = useLocation();
  const path = location.pathname;

  if (path.includes('content')) return <SiteContentManager />;
  if (path.includes('services')) return <ServicesManager />;
  if (path.includes('blog')) return <BlogManager />;
  if (path.includes('case-studies')) return <CaseStudyManager />;
  if (path.includes('testimonials')) return <TestimonialManager />;
  if (path.includes('stats')) return <StatsManager />;
  if (path.includes('certs')) return <CertificationManager />;
  if (path.includes('culture')) return <CultureManager />;
  if (path.includes('images')) return <ImageManager />;
  if (path.includes('contacts')) return <ContactManager />;
  return <Dashboard />;
};

const Dashboard = () => {
  const [imgCount, setImgCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  useEffect(() => {
    imageService.fetchAllAdmin().then((d) => setImgCount(d.length)).catch(() => {});
    contactService.fetchAll().then((d) => setContactCount(d.length)).catch(() => {});
  }, []);
  return (
    <div>
      <h1 className="admin-page__title">Dashboard</h1>
      <div className="admin-stats">
        <div className="admin-stat-card"><ImageIcon size={24} /><div className="admin-stat-card__value">{imgCount}</div><div className="admin-stat-card__label">Images</div></div>
        <div className="admin-stat-card"><MessageSquare size={24} /><div className="admin-stat-card__value">{contactCount}</div><div className="admin-stat-card__label">Submissions</div></div>
        <div className="admin-stat-card"><LayoutDashboard size={24} /><div className="admin-stat-card__value">Active</div><div className="admin-stat-card__label">Status</div></div>
      </div>
    </div>
  );
};

const ImageManager = () => {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cat, setCat] = useState<ImageCategory>('banner');
  const [name, setName] = useState('');
  const [drag, setDrag] = useState(false);
  const fetch = useCallback(async () => { try { setImages(await imageService.fetchAllAdmin()); } finally { setLoading(false); } }, []);
  useEffect(() => { fetch(); }, [fetch]);
  const upload = async (files: FileList | null) => {
    if (!files) return;
    setUploading(true);
    try { for (const f of Array.from(files)) await imageService.upload({ file: f, name: name || f.name, category: cat, alt_text: name || f.name }); setName(''); await fetch(); } finally { setUploading(false); }
  };
  return (
    <div>
      <h1 className="admin-page__title">Image Manager</h1>
      <div className="admin-upload-section">
        <div className="admin-upload-controls">
          <select value={cat} onChange={(e) => setCat(e.target.value as ImageCategory)} className="admin-select">{Object.entries(IMAGE_CATEGORIES).map(([k,v]) => <option key={k} value={v}>{k.replace('_',' ')}</option>)}</select>
          <input type="text" placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
        </div>
        <div className={`admin-dropzone ${drag ? 'admin-dropzone--active' : ''}`} onDragOver={(e) => {e.preventDefault(); setDrag(true);}} onDragLeave={() => setDrag(false)} onDrop={(e) => {e.preventDefault(); setDrag(false); upload(e.dataTransfer.files);}}>
          <Upload size={32} /><p>{uploading ? 'Uploading...' : 'Drag & drop or click'}</p>
          <input type="file" multiple accept="image/*" onChange={(e) => upload(e.target.files)} className="admin-dropzone__input" />
        </div>
      </div>
      {loading ? <p>Loading...</p> : <div className="admin-image-grid">
        {images.map((img) => (
          <div key={img.id} className={`admin-image-card ${!img.is_active ? 'admin-image-card--inactive' : ''}`}>
            <div className="admin-image-card__img"><img src={img.url || undefined} alt={img.alt_text} /></div>
            <div className="admin-image-card__info"><p className="admin-image-card__name">{img.name}</p><span className="admin-image-card__category">{img.category}</span></div>
            <div className="admin-image-card__actions">
              <button onClick={() => { imageService.toggleActive(img.id, !img.is_active).then(fetch); }} className="admin-icon-btn">{img.is_active ? <Eye size={16}/> : <EyeOff size={16}/>}</button>
              <button onClick={() => { if(confirm('Delete?')) imageService.delete(img).then(fetch); }} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={16}/></button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
};

const ContactManager = () => {
  const [subs, setSubs] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { contactService.fetchAll().then((d) => { setSubs(d); setLoading(false); }).catch(() => setLoading(false)); }, []);
  return (
    <div>
      <h1 className="admin-page__title">Contact Submissions</h1>
      {loading ? <p>Loading...</p> : subs.map((s) => (
        <div key={s.id} className={`admin-submission ${!s.is_read ? 'admin-submission--unread' : ''}`}>
          <div className="admin-submission__header"><strong>{s.name}</strong> — {s.company} {!s.is_read && <span className="admin-badge">New</span>}</div>
          <p style={{fontSize:'0.85rem',margin:'0.5rem 0'}}>{s.email} | {s.phone} | {s.budget}</p>
          <p style={{fontSize:'0.85rem',color:'var(--muted-text)'}}>{s.message}</p>
          <div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem'}}>
            {!s.is_read && <button onClick={() => {contactService.markAsRead(s.id); setSubs(p=>p.map(x=>x.id===s.id?{...x,is_read:true}:x));}} className="btn" style={{padding:'0.4rem 1rem',fontSize:'0.8rem',background:'var(--primary-blue)',color:'white'}}>Mark Read</button>}
            <button onClick={() => {if(confirm('Delete?')){contactService.deleteSubmission(s.id); setSubs(p=>p.filter(x=>x.id!==s.id));}}} className="btn" style={{padding:'0.4rem 1rem',fontSize:'0.8rem',background:'#ff4d4d',color:'white'}}><X size={14}/> Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
