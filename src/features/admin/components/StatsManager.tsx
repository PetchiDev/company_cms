import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { statsService } from '@/api/services/cmsService';
import type { StatRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, BarChart } from 'lucide-react';

const StatsManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
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
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => statsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.STATS] });
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
    if (confirm('Are you sure you want to delete this stat?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: StatRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  if (isLoading && stats.length === 0) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Stats Manager</h1>
        <button onClick={openCreateModal} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Stat Card
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              opacity: stat.is_active ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <BarChart className="text-orange" size={24} />
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--muted-text)' }}>
                  Order: {stat.sort_order}
                </span>
              </div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--dark-navy)', margin: '0.5rem 0 0.25rem' }}>
                {stat.display}
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--dark-text)', fontWeight: 600, marginBottom: '0.5rem' }}>{stat.label}</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-text)' }}>
                Database Value: {stat.value} (Suffix: {stat.suffix})
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
              <button onClick={() => openEditModal(stat)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleToggleActive(stat)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {stat.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {stat.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(stat.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingRecord ? 'Edit Stat Card' : 'Create Stat Card'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Stat Label</label>
                <input type="text" required placeholder="e.g. Happy Clients" value={label} onChange={(e) => setLabel(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Exact Numeric Value (For internal metrics)</label>
                <input type="number" required placeholder="e.g. 100" value={value} onChange={(e) => setValue(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Suffix</label>
                <input type="text" placeholder="e.g. + or %" value={suffix} onChange={(e) => setSuffix(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Display Value (Text representation)</label>
                <input type="text" required placeholder="e.g. 100+ or 2.5 Lakh" value={display} onChange={(e) => setDisplay(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                <input type="number" placeholder="e.g. 0, 1, 2" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {upsertMutation.isPending ? 'Saving...' : 'Save Stat'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsManager;
