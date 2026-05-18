import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { cultureService } from '@/api/services/cmsService';
import type { CultureHighlightRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Table as TableIcon, LayoutGrid } from 'lucide-react';
import * as AllLucideIcons from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const CultureManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingRecord, setEditingRecord] = useState<CultureHighlightRecord | null>(null);

  /* Form Fields */
  const [icon, setIcon] = useState('Heart');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const { data: items = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CULTURE_HIGHLIGHTS],
    queryFn: cultureService.fetchAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (rec: Partial<CultureHighlightRecord>) => cultureService.upsert(rec),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CULTURE_HIGHLIGHTS] });
      showToast('Culture card saved!', 'success');
      closeModal();
    },
    onError: () => showToast('Failed to save highlight.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cultureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CULTURE_HIGHLIGHTS] });
      showToast('Culture card removed.', 'info');
    },
  });

  const openEditModal = (rec: CultureHighlightRecord) => {
    setEditingRecord(rec);
    setIcon(rec.icon);
    setTitle(rec.title);
    setDescription(rec.description);
    setSortOrder(rec.sort_order.toString());
    setIsActive(rec.is_active);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setIcon('Heart');
    setTitle('');
    setDescription('');
    setSortOrder(items.length.toString());
    setIsActive(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<CultureHighlightRecord> = {
      icon,
      title,
      description,
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
      title: 'Delete Highlight',
      message: 'Are you sure you want to delete this culture highlight? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (rec: CultureHighlightRecord) => {
    await upsertMutation.mutateAsync({ ...rec, is_active: !rec.is_active });
  };

  const columns = [
    {
      header: 'Title',
      accessor: 'title' as keyof CultureHighlightRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Description',
      accessor: (rec: CultureHighlightRecord) => (
        <span style={{ fontSize: '0.85rem', color: 'var(--muted-text)', display: 'block', maxWidth: '350px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {rec.description}
        </span>
      ),
    },
    {
      header: 'Icon',
      accessor: (rec: CultureHighlightRecord) => {
        const IconComponent = (AllLucideIcons as any)[rec.icon] || AllLucideIcons.HelpCircle;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-orange)' }}>
            <div style={{ background: 'var(--admin-accent-soft)', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IconComponent size={16} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-navy)' }}>{rec.icon}</span>
          </div>
        );
      },
      width: '140px'
    },
    {
      header: 'Order',
      accessor: 'sort_order' as keyof CultureHighlightRecord,
      sortable: true,
      width: '80px'
    },
    {
      header: 'Status',
      accessor: (rec: CultureHighlightRecord) => (
        <span className={`status-badge ${rec.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {rec.is_active ? 'Active' : 'Hidden'}
        </span>
      ),
      width: '100px'
    }
  ];

  if (isLoading && items.length === 0) {
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
          <h1 className="admin-page__title">Culture Highlights</h1>
          <p className="admin-page__subtitle">Manage the "Why Work With Us" section on the careers page</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="admin-toggle-group">
            <button className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}><TableIcon size={18} /></button>
            <button className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}><LayoutGrid size={18} /></button>
          </div>
          <button onClick={openCreateModal} className="creative-btn creative-btn--sliding parallelogram" style={{ 
            background: 'var(--primary-orange)', 
            color: 'white', 
            padding: '0.8rem 3.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700
          }}>
            <Plus size={18} /> <span>ADD HIGHLIGHT</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdminTable
          data={items}
          columns={columns}
          title="Culture Cards Inventory"
          actions={(rec) => (
            <div className="table-actions">
              <button onClick={() => openEditModal(rec)} className="admin-icon-btn" title="Edit">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleToggleActive(rec)} className="admin-icon-btn" title={rec.is_active ? 'Hide' : 'Show'}>
                {rec.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(rec.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      ) : (
        <div className="admin-card-grid slide-in-up">
          {items.map((item) => (
            <div key={item.id} className="modern-card" style={{ opacity: item.is_active ? 1 : 0.6, padding: '1.5rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                 <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--admin-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-orange)' }}>
                   {(() => {
                     const DynamicCardIcon = (AllLucideIcons as any)[item.icon] || AllLucideIcons.Heart;
                     return <DynamicCardIcon size={20} />;
                   })()}
                 </div>
                 <span className="admin-tag">#{item.sort_order}</span>
               </div>
               <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>{item.title}</h4>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-text)', lineHeight: 1.6, flex: 1 }}>{item.description}</p>
               <div className="modern-card__footer" style={{ borderTop: 'none', padding: 0 }}>
                 <div className="table-actions" style={{ width: '100%', marginTop: '1.5rem' }}>
                  <button onClick={() => openEditModal(item)} className="admin-icon-btn" style={{ flex: 1 }}><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(item.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingRecord ? 'Edit Highlight' : 'New Highlight'}</h3>
              <button onClick={closeModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Lucide Icon Name</label>
                  <input type="text" required placeholder="e.g. Heart, Coffee" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Highlight Title</label>
                <input type="text" required placeholder="e.g. Work-Life Balance" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
              </div>

              <div className="form-group">
                <label>Description (Brief)</label>
                <textarea required rows={3} placeholder="Summarize this culture point..." value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
              </div>

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
                  {upsertMutation.isPending ? 'SAVING...' : 'SAVE HIGHLIGHT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultureManager;
