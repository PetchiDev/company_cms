import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { testimonialService } from '@/api/services/cmsService';
import type { TestimonialRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Quote, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const TestimonialManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
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
      showToast('Testimonial saved!', 'success');
      closeModal();
    },
    onError: () => showToast('Failed to save testimonial.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => testimonialService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TESTIMONIALS] });
      showToast('Testimonial deleted.', 'info');
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
    const isConfirmed = await confirm({
      title: 'Delete Testimonial',
      message: 'Are you sure you want to delete this testimonial? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: TestimonialRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  const columns = [
    {
      header: 'Logo',
      accessor: (test: TestimonialRecord) => (
        <div style={{ height: '32px', width: '60px', background: 'var(--bg-light)', borderRadius: '4px', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={test.logo_url || undefined} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      ),
      width: '80px'
    },
    {
      header: 'Client',
      accessor: 'client_name' as keyof TestimonialRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Company',
      accessor: 'company' as keyof TestimonialRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Quote',
      accessor: (test: TestimonialRecord) => (
        <span style={{ fontSize: '0.8rem', color: 'var(--muted-text)', display: 'block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          "{test.quote}"
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (test: TestimonialRecord) => (
        <span className={`status-badge ${test.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {test.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '100px'
    }
  ];

  if (isLoading && testimonials.length === 0) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} color="var(--primary-orange)" />
      </div>
    );
  }

  return (
    <div className="admin-content-area">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page__title">Testimonials</h1>
          <p className="admin-page__subtitle">Manage client feedback and success stories</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="admin-toggle-group">
            <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}><TableIcon size={18} /></button>
            <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={18} /></button>
          </div>
          <button onClick={openCreateModal} className="creative-btn creative-btn--sliding parallelogram" style={{ 
            background: 'var(--primary-orange)', 
            color: 'white', 
            padding: '0.8rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700
          }}>
            <Plus size={18} /> <span>ADD REVIEW</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdminTable
          data={testimonials}
          columns={columns}
          title="All Testimonials"
          actions={(test) => (
            <div className="table-actions">
              <button onClick={() => openEditModal(test)} className="admin-icon-btn" title="Edit">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleToggleActive(test)} className="admin-icon-btn" title={test.is_active ? 'Deactivate' : 'Activate'}>
                {test.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(test.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      ) : (
        <div className="admin-card-grid slide-in-up">
          {testimonials.map((test) => (
            <div key={test.id} className="modern-card" style={{ opacity: test.is_active ? 1 : 0.6, padding: '1.5rem' }}>
              <Quote size={32} style={{ color: 'var(--primary-orange)', opacity: 0.2, position: 'absolute', top: '1rem', right: '1rem' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'var(--bg-light)', padding: '4px', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={test.logo_url || undefined} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{test.client_name}</h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-text)' }}>{test.company}</p>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--dark-text)', lineHeight: 1.6, flex: 1 }}>
                "{test.quote}"
              </p>
              <div className="modern-card__footer" style={{ borderTop: 'none', padding: 0 }}>
                 <div className="table-actions" style={{ width: '100%', marginTop: '1rem' }}>
                  <button onClick={() => openEditModal(test)} className="admin-icon-btn" style={{ flex: 1 }}><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(test.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up">
            <div className="modal-header">
              <h3 className="modal-title">{editingRecord ? 'Edit Testimonial' : 'New Testimonial'}</h3>
              <button onClick={closeModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name</label>
                  <input type="text" required placeholder="e.g. John Doe" value={clientName} onChange={(e) => setClientName(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Title/Role</label>
                  <input type="text" placeholder="e.g. CEO (optional)" value={clientTitle} onChange={(e) => setClientTitle(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Quote Content</label>
                <textarea required rows={4} value={quote} onChange={(e) => setQuote(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
              </div>

              <ImageInputWithUpload
                label="Company Logo"
                value={logoUrl}
                onChange={setLogoUrl}
                category="testimonials"
              />

              <div className="flex-between">
                <label className="toggle-switch">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                  <span className="toggle-slider"></span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active</span>
                </label>
                <button type="submit" className="creative-btn creative-btn--sliding" style={{ 
                  background: 'var(--primary-orange)', 
                  color: 'white', 
                  padding: '1rem 3rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700
                }}>
                  {upsertMutation.isPending ? 'SAVING...' : (editingRecord ? 'UPDATE TESTIMONIAL' : 'CREATE TESTIMONIAL')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialManager;
