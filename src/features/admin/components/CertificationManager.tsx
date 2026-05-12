import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { certificationService } from '@/api/services/cmsService';
import type { CertificationRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const CertificationManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
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
      showToast(editingRecord ? 'Certification updated successfully!' : 'Certification created successfully!', 'success');
      closeModal();
    },
    onError: () => showToast('Failed to save certification.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => certificationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CERTIFICATIONS] });
      showToast('Certification deleted.', 'info');
    },
    onError: () => showToast('Failed to delete certification.', 'error'),
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
    const isConfirmed = await confirm({
      title: 'Delete Certification',
      message: 'Are you sure you want to delete this certification? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: CertificationRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  const columns = [
    {
      header: 'Logo',
      accessor: (cert: CertificationRecord) => (
        <div style={{ height: '40px', width: '80px', display: 'flex', alignItems: 'center', background: 'var(--bg-light)', borderRadius: 'var(--radius-sm)', padding: '0.25rem' }}>
          <img src={cert.url || undefined} alt={cert.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      ),
      width: '120px'
    },
    {
      header: 'Name',
      accessor: 'name' as keyof CertificationRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Order',
      accessor: 'sort_order' as keyof CertificationRecord,
      sortable: true,
      width: '100px'
    },
    {
      header: 'Status',
      accessor: (cert: CertificationRecord) => (
        <span className={`status-badge ${cert.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {cert.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '120px'
    }
  ];

  if (isLoading && certs.length === 0) {
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
          <h1 className="admin-page__title">Certifications</h1>
          <p className="admin-page__subtitle">Manage professional certifications and partner logos</p>
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
          <Plus size={18} /> <span>ADD NEW</span>
        </button>
      </div>

      <AdminTable
        data={certs}
        columns={columns}
        title="All Certifications"
        actions={(cert) => (
          <div className="table-actions">
            <button onClick={() => openEditModal(cert)} className="admin-icon-btn" title="Edit">
              <Edit2 size={16} />
            </button>
            <button onClick={() => handleToggleActive(cert)} className="admin-icon-btn" title={cert.is_active ? 'Deactivate' : 'Activate'}>
              {cert.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button onClick={() => handleDelete(cert.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      />

      {/* MODAL FORM */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up">
            <div className="modal-header">
              <h3 className="modal-title">{editingRecord ? 'Edit Certification' : 'New Certification'}</h3>
              <button onClick={closeModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Certification Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. AWS Advanced Partner" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="admin-input" 
                />
              </div>

              <ImageInputWithUpload
                label="Logo Image"
                value={url}
                onChange={setUrl}
                category="certs"
                placeholder="Upload or paste image URL"
              />

              <div className="form-row">
                <div className="form-group">
                  <label>Sort Order</label>
                  <input 
                    type="number" 
                    value={sortOrder} 
                    onChange={(e) => setSortOrder(e.target.value)} 
                    className="admin-input" 
                  />
                </div>
                <div className="form-group flex-center" style={{ paddingTop: '1.5rem' }}>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                    <span className="toggle-slider"></span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Active</span>
                  </label>
                </div>
              </div>

              <button type="submit" className="creative-btn creative-btn--sliding" style={{ 
                background: 'var(--primary-orange)', 
                color: 'white', 
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700,
                marginTop: '1rem'
              }}>
                {upsertMutation.isPending ? 'SAVING...' : (editingRecord ? 'UPDATE CERTIFICATION' : 'CREATE CERTIFICATION')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificationManager;
