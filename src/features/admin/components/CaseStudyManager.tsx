import { useState, useEffect } from 'react';
import AssetInputWithUpload from './AssetInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { caseStudyService } from '@/api/services/cmsService';
import { useScrollLock } from '@/hooks/useScrollLock';
import type { CaseStudyRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, FileText, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const CaseStudyManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingRecord, setEditingRecord] = useState<CaseStudyRecord | null>(null);
  
  /* Scroll Lock Logic */
  useScrollLock(modalOpen);

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
      showToast('Case study saved successfully!', 'success');
      closeModal();
    },
    onError: () => showToast('Failed to save case study.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => caseStudyService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CASE_STUDIES] });
      showToast('Case study deleted.', 'info');
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
    const isConfirmed = await confirm({
      title: 'Delete Case Study',
      message: 'Are you sure you want to delete this case study? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: CaseStudyRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  const columns = [
    {
      header: 'Thumbnail',
      accessor: (study: CaseStudyRecord) => (
        <div style={{ height: '40px', width: '70px', borderRadius: '4px', overflow: 'hidden', background: '#f1f5f9' }}>
          <img src={study.thumbnail || undefined} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ),
      width: '90px'
    },
    {
      header: 'Title',
      accessor: 'title' as keyof CaseStudyRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof CaseStudyRecord,
      sortable: true,
      filterable: true,
      width: '180px'
    },
    {
      header: 'PDF',
      accessor: (study: CaseStudyRecord) => study.pdf_link ? <FileText size={16} color="var(--primary-orange)" /> : <span style={{ opacity: 0.3 }}>—</span>,
      width: '60px'
    },
    {
      header: 'Status',
      accessor: (study: CaseStudyRecord) => (
        <span className={`status-badge ${study.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {study.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '100px'
    }
  ];

  if (isLoading && studies.length === 0) {
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
          <h1 className="admin-page__title">Case Studies</h1>
          <p className="admin-page__subtitle">Showcase successful projects and client transformations</p>
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
            <Plus size={18} /> <span>NEW CASE</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdminTable
          data={studies}
          columns={columns}
          title="Case Study Inventory"
          actions={(study) => (
            <div className="table-actions">
              <button onClick={() => openEditModal(study)} className="admin-icon-btn" title="Edit">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleToggleActive(study)} className="admin-icon-btn" title={study.is_active ? 'Deactivate' : 'Activate'}>
                {study.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(study.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      ) : (
        <div className="admin-card-grid slide-in-up">
          {studies.map((study) => (
            <div key={study.id} className="modern-card" style={{ opacity: study.is_active ? 1 : 0.6 }}>
              <div className="modern-card__img" style={{ height: '140px' }}>
                <img src={study.thumbnail || undefined} alt="" />
                <div className="modern-card__badge" style={{ background: 'var(--primary-blue)' }}>{study.category}</div>
              </div>
              <div className="modern-card__body">
                <h4 className="modern-card__title" style={{ fontSize: '1rem' }}>{study.title}</h4>
                <p className="modern-card__excerpt" style={{ fontSize: '0.8rem' }}>{study.description}</p>
                <div className="modern-card__footer">
                   <div className="table-actions" style={{ width: '100%' }}>
                    <button onClick={() => openEditModal(study)} className="admin-icon-btn" style={{ flex: 1 }}><Edit2 size={14} /> Edit</button>
                    <button onClick={() => handleDelete(study.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingRecord ? 'Edit Case Study' : 'New Case Study'}</h3>
              <button onClick={closeModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Case Study Title</label>
                <input type="text" required placeholder="e.g. Migration - SharePoint Online" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="admin-input">
                    <option value="Migration">Migration</option>
                    <option value="Insights & Intelligence">Insights & Intelligence</option>
                    <option value="Application Modernization">Application Modernization</option>
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="Cloud">Cloud</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" />
                </div>
              </div>
              <div className="form-group">
                <label>Overview Description</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
              </div>


              <AssetInputWithUpload
                label="Thumbnail Image"
                value={thumbnail}
                onChange={setThumbnail}
                category="cases"
                fileType="image"
                accept="image/*"
              />

              <AssetInputWithUpload
                label="Briefing PDF (Link or Upload)"
                value={pdfLink}
                onChange={setPdfLink}
                category="case-documents"
                fileType="pdf"
                accept="application/pdf"
                placeholder="https://... or upload local file"
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
                  {upsertMutation.isPending ? 'SAVING...' : (editingRecord ? 'UPDATE CASE STUDY' : 'CREATE CASE STUDY')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseStudyManager;
