import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { statsService } from '@/api/services/cmsService';
import type { StatRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, BarChart, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const StatsManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingRecord, setEditingRecord] = useState<StatRecord | null>(null);

  /* Form Fields */
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [suffix, setSuffix] = useState('');
  const [display, setDisplay] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const { data: stats = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.STATS],
    queryFn: statsService.fetchAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (record: Partial<StatRecord>) => statsService.upsert(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
      showToast('Stat card saved!', 'success');
      closeModal();
    },
    onError: () => showToast('Failed to save stat.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => statsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
      showToast('Stat card deleted.', 'info');
    },
  });

  const openEditModal = (record: StatRecord) => {
    setEditingRecord(record);
    setLabel(record.label);
    setValue(record.value.toString());
    setSuffix(record.suffix);
    setDisplay(record.display);
    setSortOrder(record.sort_order.toString());
    setIsActive(record.is_active);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setLabel('');
    setValue('');
    setSuffix('+');
    setDisplay('');
    setSortOrder(stats.length.toString());
    setIsActive(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<StatRecord> = {
      label,
      value: Number(value),
      suffix,
      display,
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
      title: 'Delete Stat',
      message: 'Are you sure you want to delete this stat? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: StatRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  const columns = [
    {
      header: 'Label',
      accessor: 'label' as keyof StatRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Display Value',
      accessor: (stat: StatRecord) => (
        <span style={{ fontWeight: 800, color: 'var(--primary-orange)', fontSize: '1.1rem' }}>
          {stat.display}
        </span>
      ),
      sortable: true,
      width: '150px'
    },
    {
      header: 'Value',
      accessor: 'value' as keyof StatRecord,
      sortable: true,
      width: '100px'
    },
    {
      header: 'Order',
      accessor: 'sort_order' as keyof StatRecord,
      sortable: true,
      width: '80px'
    },
    {
      header: 'Status',
      accessor: (stat: StatRecord) => (
        <span className={`status-badge ${stat.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {stat.is_active ? 'Active' : 'Hidden'}
        </span>
      ),
      width: '100px'
    }
  ];

  if (isLoading && stats.length === 0) {
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
          <h1 className="admin-page__title">Homepage Stats</h1>
          <p className="admin-page__subtitle">Manage the highlight metrics shown on the main landing page</p>
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
            <Plus size={18} /> <span>ADD STAT</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdminTable
          data={stats}
          columns={columns}
          title="Metric Cards Inventory"
          actions={(stat) => (
            <div className="table-actions">
              <button onClick={() => openEditModal(stat)} className="admin-icon-btn" title="Edit">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleToggleActive(stat)} className="admin-icon-btn" title={stat.is_active ? 'Deactivate' : 'Activate'}>
                {stat.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(stat.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      ) : (
        <div className="admin-card-grid slide-in-up">
          {stats.map((stat) => (
            <div key={stat.id} className="modern-card" style={{ opacity: stat.is_active ? 1 : 0.6, padding: '1.5rem' }}>
               <BarChart size={32} style={{ color: 'var(--primary-orange)', opacity: 0.1, position: 'absolute', top: '1rem', right: '1rem' }} />
               <div style={{ marginBottom: '1rem' }}>
                 <span className="admin-tag">Order: {stat.sort_order}</span>
               </div>
               <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--dark-navy)', margin: '0.5rem 0' }}>{stat.display}</h2>
               <p style={{ fontWeight: 700, color: 'var(--muted-text)', marginBottom: '1.5rem' }}>{stat.label}</p>
               <div className="modern-card__footer" style={{ borderTop: 'none', padding: 0 }}>
                 <div className="table-actions" style={{ width: '100%' }}>
                  <button onClick={() => openEditModal(stat)} className="admin-icon-btn" style={{ flex: 1 }}><Edit2 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(stat.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
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
              <h3 className="modal-title">{editingRecord ? 'Edit Stat' : 'New Stat'}</h3>
              <button onClick={closeModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Stat Label</label>
                <input type="text" required placeholder="e.g. Projects Delivered" value={label} onChange={(e) => setLabel(e.target.value)} className="admin-input" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Database Value</label>
                  <input type="number" required placeholder="150" value={value} onChange={(e) => setValue(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Suffix</label>
                  <input type="text" placeholder="+" value={suffix} onChange={(e) => setSuffix(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Display Value (As seen on site)</label>
                <input type="text" required placeholder="e.g. 150+" value={display} onChange={(e) => setDisplay(e.target.value)} className="admin-input" />
              </div>

              <div className="form-group">
                <label>Sort Order</label>
                <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" />
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
                  {upsertMutation.isPending ? 'SAVING...' : 'PUBLISH STAT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsManager;
