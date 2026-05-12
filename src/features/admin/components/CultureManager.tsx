import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { cultureService } from '@/api/services/cmsService';
import type { CultureHighlightRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Heart } from 'lucide-react';

const CultureManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
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
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => cultureService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CULTURE_HIGHLIGHTS] });
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
    if (confirm('Are you sure you want to delete this highlight?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (rec: CultureHighlightRecord) => {
    await upsertMutation.mutateAsync({ ...rec, is_active: !rec.is_active });
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Culture & Careers CMS</h1>
        <button onClick={openCreateModal} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Culture Card
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              opacity: item.is_active ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(253,101,31,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Heart className="text-orange" size={20} />
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--muted-text)' }}>
                  Order: {item.sort_order}
                </span>
              </div>
              <h4 style={{ fontSize: '1.05rem', color: 'var(--dark-navy)', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                {item.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--muted-text)', lineHeight: 1.5, margin: 0 }}>
                {item.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
              <button onClick={() => openEditModal(item)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleToggleActive(item)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {item.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {item.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(item.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingRecord ? 'Edit Culture Card' : 'Add Culture Card'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Lucide Icon</label>
                  <input type="text" required placeholder="e.g. MapPin, Coffee, Heart" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                  <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Card Title</label>
                <input type="text" required placeholder="e.g. Flexible Work" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Card Description</label>
                <textarea required placeholder="Write a short summary sentence..." value={description} onChange={(e) => setDescription(e.target.value)} className="admin-input" rows={3} style={{ width: '100%', resize: 'none' }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {upsertMutation.isPending ? 'Saving...' : 'Save Culture Card'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CultureManager;
