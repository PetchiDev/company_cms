import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { certificationService } from '@/api/services/cmsService';
import type { CertificationRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react';

const CertificationManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CertificationRecord | null>(null);

  /* Form Fields */
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const { data: certs = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.CERTIFICATIONS],
    queryFn: certificationService.fetchAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (record: Partial<CertificationRecord>) => certificationService.upsert(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CERTIFICATIONS] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CERTIFICATIONS] });
    },
  });

  const openEditModal = (record: CertificationRecord) => {
    setEditingRecord(record);
    setName(record.name);
    setUrl(record.url);
    setSortOrder(record.sort_order.toString());
    setIsActive(record.is_active);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setName('');
    setUrl('');
    setSortOrder(certs.length.toString());
    setIsActive(true);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<CertificationRecord> = {
      name,
      url,
      sort_order: Number(sortOrder),
      is_active: isActive,
    };
    if (editingRecord) {
      payload.id = editingRecord.id;
    }
    await upsertMutation.mutateAsync(payload);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: CertificationRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  if (isLoading && certs.length === 0) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Certifications Manager</h1>
        <button onClick={openCreateModal} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Certification
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {certs.map((cert) => (
          <div
            key={cert.id}
            style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              opacity: cert.is_active ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ height: '60px', width: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={cert.url || undefined} alt={cert.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '0.75rem', background: 'var(--bg-light)', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', color: 'var(--muted-text)' }}>
                  Order: {cert.sort_order}
                </span>
              </div>
              <h4 style={{ fontSize: '1rem', color: 'var(--dark-navy)', margin: '1rem 0 0.5rem', fontWeight: 700 }}>
                {cert.name}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-text)', wordBreak: 'break-all' }}>
                Image Link: {cert.url}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
              <button onClick={() => openEditModal(cert)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleToggleActive(cert)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {cert.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {cert.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(cert.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
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
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingRecord ? 'Edit Certification' : 'Add Certification'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Certification Name</label>
                <input type="text" required placeholder="e.g. AWS Advanced Partner" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <ImageInputWithUpload
                label="Logo Image"
                value={url}
                onChange={setUrl}
                category="certs"
                placeholder="e.g. https://..."
              />

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                <input type="number" placeholder="e.g. 0, 1, 2" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {upsertMutation.isPending ? 'Saving...' : 'Save Certification'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationManager;
