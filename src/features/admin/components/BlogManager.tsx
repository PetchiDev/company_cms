import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { blogService } from '@/api/services/cmsService';
import type { BlogArticleRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Table as TableIcon, LayoutGrid } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const BlogManager = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [editingRecord, setEditingRecord] = useState<BlogArticleRecord | null>(null);
  const [editorMode, setEditorMode] = useState<'write' | 'preview'>('write');

  /* Form Fields */
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [link, setLink] = useState('');
  const [date, setDate] = useState('');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: [QUERY_KEYS.BLOG_ARTICLES],
    queryFn: blogService.fetchAll,
  });

  const upsertMutation = useMutation({
    mutationFn: (record: Partial<BlogArticleRecord>) => blogService.upsert(record),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOG_ARTICLES] });
      showToast('Blog article saved!', 'success');
      closeModal();
    },
    onError: () => showToast('Failed to save article.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOG_ARTICLES] });
      showToast('Article deleted.', 'info');
    },
  });

  const openEditModal = (record: BlogArticleRecord) => {
    setEditingRecord(record);
    setTitle(record.title);
    setExcerpt(record.excerpt);
    setImage(record.image);
    setContent(record.content || '');
    setLink(record.link || '');
    setDate(record.date);
    setSortOrder(record.sort_order.toString());
    setIsActive(record.is_active);
    setEditorMode('write');
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingRecord(null);
    setTitle('');
    setExcerpt('');
    setImage('');
    setContent('');
    setLink('');
    setDate(new Date().toISOString().split('T')[0]);
    setSortOrder(blogs.length.toString());
    setIsActive(true);
    setEditorMode('write');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<BlogArticleRecord> = {
      title,
      excerpt,
      image,
      content: content.trim() || null,
      link: content.trim() ? null : (link || null),
      date,
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
      title: 'Delete Blog Post',
      message: 'Are you sure you want to delete this blog post? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (isConfirmed) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: BlogArticleRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  const columns = [
    {
      header: 'Image',
      accessor: (blog: BlogArticleRecord) => (
        <div style={{ height: '40px', width: '60px', borderRadius: '4px', overflow: 'hidden', background: '#f1f5f9' }}>
          <img src={blog.image || undefined} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ),
      width: '80px'
    },
    {
      header: 'Title',
      accessor: 'title' as keyof BlogArticleRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Date',
      accessor: (blog: BlogArticleRecord) => new Date(blog.date).toLocaleDateString(),
      sortable: true,
      width: '120px'
    },
    {
      header: 'Type',
      accessor: (blog: BlogArticleRecord) => (
        <span className="admin-tag" style={{ background: blog.content ? 'rgba(59, 130, 246, 0.1)' : 'rgba(100, 116, 139, 0.1)', color: blog.content ? '#3b82f6' : '#64748b' }}>
          {blog.content ? 'Article' : 'External'}
        </span>
      ),
      width: '100px'
    },
    {
      header: 'Status',
      accessor: (blog: BlogArticleRecord) => (
        <span className={`status-badge ${blog.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {blog.is_active ? 'Active' : 'Inactive'}
        </span>
      ),
      width: '100px'
    }
  ];

  if (isLoading && blogs.length === 0) {
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
          <h1 className="admin-page__title">Blog Articles</h1>
          <p className="admin-page__subtitle">Manage news, updates, and thought leadership posts</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="admin-toggle-group">
            <button 
              className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`} 
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <TableIcon size={18} />
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`} 
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={18} />
            </button>
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
            <Plus size={18} /> <span>NEW POST</span>
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <AdminTable
          data={blogs}
          columns={columns}
          title="All Blog Posts"
          actions={(blog) => (
            <div className="table-actions">
              <button onClick={() => openEditModal(blog)} className="admin-icon-btn" title="Edit">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleToggleActive(blog)} className="admin-icon-btn" title={blog.is_active ? 'Deactivate' : 'Activate'}>
                {blog.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(blog.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      ) : (
        <div className="admin-card-grid slide-in-up">
          {blogs.map((blog) => (
            <div key={blog.id} className="modern-card" style={{ opacity: blog.is_active ? 1 : 0.6 }}>
              <div className="modern-card__img">
                <img src={blog.image || undefined} alt="" />
                <div className="modern-card__badge">{new Date(blog.date).toLocaleDateString()}</div>
              </div>
              <div className="modern-card__body">
                <h4 className="modern-card__title">{blog.title}</h4>
                <p className="modern-card__excerpt">{blog.excerpt}</p>
                <div className="modern-card__footer">
                   <div className="table-actions" style={{ width: '100%' }}>
                    <button onClick={() => openEditModal(blog)} className="admin-icon-btn" style={{ flex: 1 }}><Edit2 size={14} /> Edit</button>
                    <button onClick={() => handleDelete(blog.id)} className="admin-icon-btn admin-icon-btn--danger"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM & EDITOR */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-card slide-in-up" style={{ maxWidth: '900px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{editingRecord ? 'Edit Article' : 'New Article'}</h3>
              <button onClick={closeModal} className="modal-close"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="form-group">
                  <label>Article Title</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" />
                </div>
                <div className="form-group">
                  <label>Publish Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="form-group">
                <label>Excerpt / Summary</label>
                <textarea required rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="admin-input" style={{ resize: 'none' }} />
              </div>

              <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <ImageInputWithUpload
                  label="Featured Image"
                  value={image}
                  onChange={setImage}
                  category="blog"
                />
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" />
                </div>
              </div>

              <div className="editor-container">
                <div className="editor-tabs">
                  <button type="button" className={`editor-tab ${editorMode === 'write' ? 'active' : ''}`} onClick={() => setEditorMode('write')}>Write</button>
                  <button type="button" className={`editor-tab ${editorMode === 'preview' ? 'active' : ''}`} onClick={() => setEditorMode('preview')}>Preview</button>
                </div>
                
                {editorMode === 'write' ? (
                  <textarea 
                    className="admin-input editor-textarea" 
                    placeholder="Enter HTML content or leave empty for external link..." 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                  />
                ) : (
                  <div className="editor-preview" dangerouslySetInnerHTML={{ __html: content || '<em>No content to preview</em>' }} />
                )}
              </div>

              {!content.trim() && (
                <div className="form-group">
                  <label>External URL (Used only if built-in content is empty)</label>
                  <input type="url" value={link} onChange={(e) => setLink(e.target.value)} className="admin-input" placeholder="https://example.com/post" />
                </div>
              )}

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
                  {upsertMutation.isPending ? 'SAVING...' : 'PUBLISH ARTICLE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
