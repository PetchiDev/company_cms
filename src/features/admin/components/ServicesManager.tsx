import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { servicesService } from '@/api/services/cmsService';
import type { ServiceRecord, ServiceCategoryRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, FolderKanban, Cpu } from 'lucide-react';

const ServicesManager = () => {
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<'services' | 'categories'>('services');

  /* Modals */
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceRecord | null>(null);
  const [editingCategory, setEditingCategory] = useState<ServiceCategoryRecord | null>(null);

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
      closeServiceModal();
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: (id: string) => servicesService.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICES] });
    },
  });

  const categoryMutation = useMutation({
    mutationFn: (rec: Partial<ServiceCategoryRecord>) => servicesService.upsertCategory(rec),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_CATEGORIES] });
      closeCategoryModal();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => servicesService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SERVICE_CATEGORIES] });
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
    if (confirm('Are you sure you want to delete this service?')) {
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
    if (confirm('Deleting a category will delete all nested services! Proceed?')) {
      await deleteCategoryMutation.mutateAsync(id);
    }
  };

  if (loadingCats || loadingServices) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page__title">Expertise & Services CMS</h1>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '1rem' }}>
        <button
          onClick={() => setActiveSubTab('services')}
          className="btn"
          style={{
            background: activeSubTab === 'services' ? 'var(--primary-blue)' : 'transparent',
            color: activeSubTab === 'services' ? 'white' : 'var(--dark-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Cpu size={16} /> Services List
        </button>
        <button
          onClick={() => setActiveSubTab('categories')}
          className="btn"
          style={{
            background: activeSubTab === 'categories' ? 'var(--primary-blue)' : 'transparent',
            color: activeSubTab === 'categories' ? 'white' : 'var(--dark-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <FolderKanban size={16} /> Manage Categories
        </button>
      </div>

      {activeSubTab === 'services' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>Active Services</h3>
            <button onClick={openCreateService} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add New Service
            </button>
          </div>

          <div style={{ overflowX: 'auto', background: 'white', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Service Info</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Slug</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Sort</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Features/Tech</th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => {
                  const cat = categories.find((c) => c.id === service.category_id);
                  return (
                    <tr key={service.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', opacity: service.is_active ? 1 : 0.6 }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--dark-navy)' }}>{service.title}</td>
                      <td style={{ padding: '1rem 1.5rem', color: 'var(--muted-text)', fontFamily: 'monospace' }}>{service.slug}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span style={{ padding: '0.15rem 0.5rem', background: 'rgba(1,14,208,0.05)', color: 'var(--primary-blue)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.75rem' }}>
                          {cat?.title || service.category_id}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>{service.sort_order}</td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          <span style={{ fontSize: '0.7rem', background: 'var(--bg-light)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-xs)', color: 'var(--dark-text)' }}>
                            {service.features.length} Features
                          </span>
                          <span style={{ fontSize: '0.7rem', background: 'var(--bg-light)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-xs)', color: 'var(--dark-text)' }}>
                            {service.technologies.length} Techs
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
                          <button onClick={() => openEditService(service)} className="admin-icon-btn"><Edit2 size={14} /></button>
                          <button onClick={() => handleToggleServiceActive(service)} className="admin-icon-btn">{service.is_active ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                          <button onClick={() => handleDeleteService(service.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>Group Categories</h3>
            <button onClick={openCreateCategory} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Add Category Group
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat) => {
              const count = services.filter((s) => s.category_id === cat.id).length;
              return (
                <div key={cat.id} style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', fontWeight: 700, color: 'var(--dark-navy)' }}>{cat.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-text)', fontFamily: 'monospace' }}>ID: {cat.id} | {count} nested services</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => openEditCategory(cat)} className="admin-icon-btn"><Edit2 size={14} /></button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SERVICE MODAL */}
      {serviceModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={closeServiceModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Service Title</label>
                  <input type="text" required placeholder="e.g. Application Modernization" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Slug (URL path)</label>
                  <input type="text" placeholder="Auto-generated if empty" value={slug} onChange={(e) => setSlug(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Category Group</label>
                  <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="admin-select" style={{ width: '100%' }}>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Lucide Icon</label>
                  <input type="text" placeholder="e.g. Settings, Brain, RefreshCw" value={icon} onChange={(e) => setIcon(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                  <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Short Description</label>
                <textarea required placeholder="Write a short teaser snippet..." value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="admin-input" rows={2} style={{ width: '100%', resize: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Full Deep Description (Tanglish/English)</label>
                <textarea required placeholder="Write the full service detail content..." value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} className="admin-input" rows={4} style={{ width: '100%', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Features (comma separated)</label>
                  <input type="text" placeholder="e.g. Consulting, CI/CD, Auditing" value={features} onChange={(e) => setFeatures(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Technologies (comma separated)</label>
                  <input type="text" placeholder="e.g. Azure, Docker, AWS (optional)" value={technologies} onChange={(e) => setTechnologies(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {serviceMutation.isPending ? 'Saving...' : 'Save Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingCategory ? 'Edit Category' : 'Add Category Group'}</h3>
              <button onClick={closeCategoryModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleCategorySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Category Identifier ID (No spaces)</label>
                <input type="text" required placeholder="e.g. cloud-native-solutions" disabled={!!editingCategory} value={catId} onChange={(e) => setCatId(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Display Title Name</label>
                <input type="text" required placeholder="e.g. Cloud Services" value={catTitle} onChange={(e) => setCatTitle(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Sort Order</label>
                <input type="number" required value={catSort} onChange={(e) => setCatSort(e.target.value)} className="admin-input" style={{ width: '100%' }} />
              </div>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {categoryMutation.isPending ? 'Saving...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
