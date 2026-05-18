import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { servicesService } from '@/api/services/cmsService';
import type { ServiceRecord, ServiceCategoryRecord } from '@/types/cms.types';
import { useScrollLock } from '@/hooks/useScrollLock';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, FolderKanban, Cpu } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const ServicesManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'categories'>('services');

  /* Modals */
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryRecord | null>(null);

  /* Scroll Lock Logic */
  useScrollLock(serviceModalOpen || categoryModalOpen);

  /* Service Form State */
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [icon, setIcon] = useState('Settings');
  const [categoryId, setCategoryId] = useState('');
  const [features, setFeatures] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  /* Category Form State */
  const [catId, setCatId] = useState('');
  const [catTitle, setCatTitle] = useState('');
  const [catSort, setCatSort] = useState('0');

  /* Fetch Queries */
  const { data: categories = [], isLoading: loadingCats } = useQuery({
    queryKey: [QUERY_KEYS.SERVICE_CATEGORIES],
    queryFn: servicesService.fetchCategories,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: [QUERY_KEYS.SERVICES],
    queryFn: servicesService.fetchAll,
  });

  /* Mutations */
  const serviceMutation = useMutation({
    mutationFn: (rec: Partial<ServiceRecord>) => servicesService.upsertService(rec),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES] });
      showToast('Service saved successfully!', 'success');
      closeServiceModal();
    },
    onError: () => showToast('Failed to save service.', 'error'),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES] });
      showToast('Service deleted.', 'info');
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (rec: Partial<ServiceCategoryRecord>) => servicesService.upsertCategory(rec),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_CATEGORIES] });
      showToast('Category saved!', 'success');
      closeCategoryModal();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => servicesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_CATEGORIES] });
      showToast('Category removed.', 'info');
    },
  });

  /* Service Methods */
  const openEditService = (rec: ServiceRecord) => {
    setEditingService(rec);
    setTitle(rec.title);
    setSlug(rec.slug);
    setShortDesc(rec.short_description);
    setFullDesc(rec.full_description);
    setIcon(rec.icon);
    setCategoryId(rec.category_id);
    setFeatures(rec.features.join(', '));
    setTechnologies(rec.technologies.join(', '));
    setSortOrder(rec.sort_order.toString());
    setIsActive(rec.is_active);
    setServiceModalOpen(true);
  };

  const openCreateService = () => {
    setEditingService(null);
    setTitle('');
    setSlug('');
    setShortDesc('');
    setFullDesc('');
    setIcon('Settings');
    setCategoryId(categories[0]?.id || '');
    setFeatures('');
    setTechnologies('');
    setSortOrder(services.length.toString());
    setIsActive(true);
    setServiceModalOpen(true);
  };

  const closeServiceModal = () => {
    setServiceModalOpen(false);
    setEditingService(null);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<ServiceRecord> = {
      slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
      title,
      short_description: shortDesc,
      full_description: fullDesc,
      icon,
      category_id: categoryId,
      features: features.split(',').map((x) => x.trim()).filter(Boolean),
      technologies: technologies.split(',').map((x) => x.trim()).filter(Boolean),
      sort_order: Number(sortOrder),
      is_active: isActive,
    };
    if (editingService) {
      payload.id = editingService.id;
    }
    await serviceMutation.mutateAsync(payload);
  };

  const handleDeleteService = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Service',
      message: 'Are you sure you want to delete this service? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteServiceMutation.mutateAsync(id);
    }
  };

  const handleToggleServiceActive = async (rec: ServiceRecord) => {
    await serviceMutation.mutateAsync({ ...rec, is_active: !rec.is_active });
  };

  /* Category Methods */
  const openEditCategory = (rec: ServiceCategoryRecord) => {
    setEditingCategory(rec);
    setCatId(rec.id);
    setCatTitle(rec.title);
    setCatSort(rec.sort_order.toString());
    setCategoryModalOpen(true);
  };

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCatId('');
    setCatTitle('');
    setCatSort(categories.length.toString());
    setCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<ServiceCategoryRecord> = {
      id: catId.trim().toLowerCase().replace(/\s+/g, '-'),
      title: catTitle,
      sort_order: Number(catSort),
      is_active: true,
    };
    await categoryMutation.mutateAsync(payload);
  };

  const handleDeleteCategory = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Category',
      message: 'Deleting a category will permanently delete all nested services! Are you absolutely sure you want to proceed?',
      type: 'danger',
      confirmText: 'Delete Category'
    });
    if (isConfirmed) {
      await deleteCategoryMutation.mutateAsync(id);
    }
  };

  const serviceColumns = [
    {
      header: 'Title',
      accessor: 'title' as keyof ServiceRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Category',
      accessor: (s: ServiceRecord) => {
        const cat = categories.find(c => c.id === s.category_id);
        return <span className="admin-tag" style={{ background: 'var(--admin-accent-soft)', color: 'var(--primary-orange)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.75rem' }}>{cat?.title || s.category_id}</span>;
      },
      sortable: true,
      filterable: true,
    },
    {
      header: 'Slug',
      accessor: 'slug' as keyof ServiceRecord,
      sortable: true,
      width: '150px'
    },
    {
      header: 'Order',
      accessor: 'sort_order' as keyof ServiceRecord,
      sortable: true,
      width: '80px'
    },
    {
      header: 'Status',
      accessor: (s: ServiceRecord) => (
        <span className={`status-badge ${s.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {s.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '100px'
    }
  ];

  const categoryColumns = [
    {
      header: 'Identifier',
      accessor: 'id' as keyof ServiceCategoryRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Title',
      accessor: 'title' as keyof ServiceCategoryRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Order',
      accessor: 'sort_order' as keyof ServiceCategoryRecord,
      sortable: true,
      width: '100px'
    }
  ];

  if ((loadingCats && categories.length === 0) || (loadingServices && services.length === 0)) {
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
          <h1 className="admin-page__title">Expertise & Services</h1>
          <p className="admin-page__subtitle">Manage your service offerings and logical groupings</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={activeSubTab === 'services' ? openCreateService : openCreateCategory} 
            className="creative-btn creative-btn--sliding parallelogram" 
            style={{ 
              background: 'var(--primary-orange)', 
              color: 'white', 
              padding: '0.8rem 2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700
            }}
          >
            <Plus size={18} /> <span>{activeSubTab === 'services' ? 'ADD SERVICE' : 'ADD CATEGORY'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveSubTab('services')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: activeSubTab === 'services' ? 'var(--dark-navy)' : 'white',
            color: activeSubTab === 'services' ? 'white' : 'var(--dark-navy)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeSubTab === 'services' ? 'var(--shadow-md)' : 'none',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <Cpu size={18} /> Services
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: 'var(--radius-md)',
            background: activeSubTab === 'categories' ? 'var(--dark-navy)' : 'white',
            color: activeSubTab === 'categories' ? 'white' : 'var(--dark-navy)',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeSubTab === 'categories' ? 'var(--shadow-md)' : 'none',
            border: '1px solid rgba(0,0,0,0.05)'
          }}
        >
          <FolderKanban size={18} /> Categories
        </button>
      </div>

      <div>
        {activeSubTab === 'services' ? (
          <AdminTable
            data={services}
            columns={serviceColumns}
            title="Active Services"
            actions={(service) => (
              <div className="table-actions">
                <button onClick={() => openEditService(service)} className="admin-icon-btn" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleToggleServiceActive(service)} className="admin-icon-btn" title={service.is_active ? 'Deactivate' : 'Activate'}>
                  {service.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleDeleteService(service.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        ) : (
          <AdminTable
            data={categories}
            columns={categoryColumns}
            title="Service Groups"
            actions={(cat) => (
              <div className="table-actions">
                <button onClick={() => openEditCategory(cat)} className="admin-icon-btn" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDeleteCategory(cat.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          />
        )}
      </div>

      {/* SERVICE MODAL */}
      {serviceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingService ? 'Edit Service' : 'New Service'}</h3>
              <button onClick={closeServiceModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleServiceSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Slug</label>
                  <input type="text" placeholder="URL-friendly name" value={slug} onChange={(e) => setSlug(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <div className="form-group">
                  <label>Category</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-input">
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Icon (Lucide name)</label>
                  <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Short Snippet</label>
                <textarea required rows={2} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
              </div>

              <div className="form-group">
                <label>Full Content</label>
                <textarea required rows={5} value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Features (comma separated)</label>
                  <input type="text" value={features} onChange={(e) => setFeatures(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Technologies (comma separated)</label>
                  <input type="text" value={technologies} onChange={(e) => setTechnologies(e.target.value)} className="admin-input" />
                </div>
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
                  padding: '1rem 4rem',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700
                }}>
                  {serviceMutation.isPending ? 'SAVING...' : 'SAVE SERVICE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up">
            <div className="modal-header">
              <h3 className="modal-title">{editingCategory ? 'Edit Category' : 'New Category'}</h3>
              <button onClick={closeCategoryModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleCategorySubmit} className="modal-form">
              <div className="form-group">
                <label>Identifier (ID)</label>
                <input type="text" required disabled={!!editingCategory} value={catId} onChange={(e) => setCatId(e.target.value)} className="admin-input" />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input type="text" required value={catTitle} onChange={(e) => setCatTitle(e.target.value)} className="admin-input" />
              </div>

              <div className="form-group">
                <label>Display Order</label>
                <input type="number" value={catSort} onChange={(e) => setCatSort(e.target.value)} className="admin-input" />
              </div>

              <button type="submit" className="creative-btn creative-btn--sliding" style={{ 
                background: 'var(--primary-orange)', 
                color: 'white', 
                width: '100%',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: 700
              }}>
                {categoryMutation.isPending ? 'SAVING...' : 'SAVE CATEGORY'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
