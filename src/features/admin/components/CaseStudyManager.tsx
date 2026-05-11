import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { caseStudyService } from '@/api/services/cmsService';
import type { CaseStudyRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Download } from 'lucide-react';

const CaseStudyManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CaseStudyRecord | null>(null);

  /* Form Fields */
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [pdfLink, setPdfLink] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const { data: studies = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CASE_STUDIES],
    queryFn: caseStudyService.fetchAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (record: Partial<CaseStudyRecord>) => caseStudyService.upsert(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CASE_STUDIES] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => caseStudyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CASE_STUDIES] });
    },
  });

  const openEditModal = (record: CaseStudyRecord) => {
    setEditingRecord(record);
    setTitle(record.title);
    setCategory(record.category);
    setDescription(record.description);
    setThumbnail(record.thumbnail);
    setPdfLink(record.pdf_link || '');
    setSortOrder(record.sort_order.toString());
    setIsActive(record.is_active);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setTitle('');
    setCategory('Application Modernization');
    setDescription('');
    setThumbnail('');
    setPdfLink('');
    setSortOrder(studies.length.toString());
    setIsActive(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<CaseStudyRecord> = {
      title,
      category,
      description,
      thumbnail,
      pdf_link: pdfLink || null,
      sort_order: Number(sortOrder),
      is_active: isActive,
    };
    if (editingRecord) {
      payload.id = editingRecord.id;
    }
    await upsertMutation.mutateAsync(payload);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: CaseStudyRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Case Studies Manager</h1>
        <button onClick={openCreateModal} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Case Study
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {studies.map((study) => (
          <div
            key={study.id}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              opacity: study.is_active ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src={study.thumbnail} alt={study.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--primary-blue)', color: 'white', fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>
                  {study.category}
                </span>
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  Order: {study.sort_order}
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark-navy)' }}>{study.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-text)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {study.description}
                </p>
                {study.pdf_link && (
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.8rem', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
                    <Download size={12} /> PDF Attached
                  </p>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <button onClick={() => openEditModal(study)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleToggleActive(study)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {study.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {study.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(study.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
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
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingRecord ? 'Edit Case Study' : 'Add Case Study'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Case Study Title</label>
                <input type="text" required placeholder="e.g. Migration - SharePoint Online" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-select" style={{ width: '100%' }}>
                    <option value="Migration">Migration</option>
                    <option value="Insights & Intelligence">Insights & Intelligence</option>
                    <option value="Application Modernization">Application Modernization</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                  <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Brief Description</label>
                <textarea required placeholder="Write a brief overview of the work done..." value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" rows={3} style={{ width: '100%', resize: 'none' }} />
              </div>

              <ImageInputWithUpload
                label="Thumbnail Image"
                value={thumbnail}
                onChange={setThumbnail}
                category="cases"
                placeholder="e.g. https://..."
              />

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Briefing PDF Attachment Link</label>
                <input type="url" placeholder="e.g. https://... (optional)" value={pdfLink} onChange={(e) => setPdfLink(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {upsertMutation.isPending ? 'Saving...' : 'Save Case Study'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyManager;
