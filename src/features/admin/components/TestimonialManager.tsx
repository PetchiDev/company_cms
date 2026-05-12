import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { testimonialService } from '@/api/services/cmsService';
import type { TestimonialRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Quote } from 'lucide-react';

const TestimonialManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TestimonialRecord | null>(null);

  /* Form Fields */
  const [clientName, setClientName] = useState('');
  const [clientTitle, setClientTitle] = useState('');
  const [company, setCompany] = useState('');
  const [quote, setQuote] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.TESTIMONIALS],
    queryFn: testimonialService.fetchAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (record: Partial<TestimonialRecord>) => testimonialService.upsert(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIALS] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIALS] });
    },
  });

  const openEditModal = (record: TestimonialRecord) => {
    setEditingRecord(record);
    setClientName(record.client_name);
    setClientTitle(record.client_title || '');
    setCompany(record.company);
    setQuote(record.quote);
    setLogoUrl(record.logo_url);
    setSortOrder(record.sort_order.toString());
    setIsActive(record.is_active);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setClientName('');
    setClientTitle('');
    setCompany('');
    setQuote('');
    setLogoUrl('');
    setSortOrder(testimonials.length.toString());
    setIsActive(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<TestimonialRecord> = {
      client_name: clientName,
      client_title: clientTitle,
      company,
      quote,
      logo_url: logoUrl,
      sort_order: Number(sortOrder),
      is_active: isActive,
    };
    if (editingRecord) {
      payload.id = editingRecord.id;
    }
    await upsertMutation.mutateAsync(payload);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: TestimonialRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  if (isLoading && testimonials.length === 0) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Testimonials Manager</h1>
        <button onClick={openCreateModal} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {testimonials.map((test) => (
          <div
            key={test.id}
            style={{
              background: 'white',
              padding: '1.75rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              opacity: test.is_active ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <div>
              <Quote size={40} className="text-orange" style={{ opacity: 0.1, position: 'absolute', top: '1rem', right: '1rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '50px', height: '50px', background: 'var(--bg-light)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <img src={test.logo_url || undefined} alt={test.company} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>{test.client_name || 'Anonymous'}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-text)' }}>
                    {test.client_title ? `${test.client_title}, ` : ''}{test.company}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, fontStyle: 'italic', color: 'var(--dark-text)' }}>
                "{test.quote}"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
              <button onClick={() => openEditModal(test)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleToggleActive(test)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {test.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {test.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(test.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingRecord ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Client Name</label>
                  <input type="text" required placeholder="e.g. John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Client Title</label>
                  <input type="text" placeholder="e.g. CEO (optional)" value={clientTitle} onChange={(e) => setClientTitle(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Company Name</label>
                  <input type="text" required placeholder="e.g. Acme Corp" value={company} onChange={(e) => setCompany(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                  <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Quote / Review</label>
                <textarea required placeholder="Write the testimonial review text..." value={quote} onChange={(e) => setQuote(e.target.value)} className="admin-input" rows={4} style={{ width: '100%', resize: 'none' }} />
              </div>

              <ImageInputWithUpload
                label="Company Logo"
                value={logoUrl}
                onChange={setLogoUrl}
                category="testimonials"
                placeholder="e.g. https://..."
              />

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {upsertMutation.isPending ? 'Saving...' : 'Save Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManager;
