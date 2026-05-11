import { useState } from 'react';
import ImageInputWithUpload from './ImageInputWithUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { blogService } from '@/api/services/cmsService';
import type { BlogArticleRecord } from '@/types/cms.types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader2, X, Calendar, BookOpen, Link as LinkIcon } from 'lucide-react';

const BlogManager = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
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
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BLOG_ARTICLES] });
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
    if (confirm('Are you sure you want to delete this blog post?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleToggleActive = async (record: BlogArticleRecord) => {
    await upsertMutation.mutateAsync({
      ...record,
      is_active: !record.is_active,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-center" style={{ height: '50vh' }}>
        <Loader2 className="spin" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className="admin-page__title" style={{ margin: 0 }}>Blog Manager</h1>
        <button onClick={openCreateModal} className="btn btn--orange" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Blog Post
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {blogs.map((blog) => (
          <div
            key={blog.id}
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid rgba(0,0,0,0.05)',
              opacity: blog.is_active ? 1 : 0.6,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                <img src={blog.image} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: blog.content ? 'var(--primary-blue)' : 'var(--dark-navy)',
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.25rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {blog.content ? <BookOpen size={12} /> : <LinkIcon size={12} />}
                  {blog.content ? 'Built-in Article' : 'External Link'}
                </span>
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  Order: {blog.sort_order}
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--muted-text)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={12} />
                  {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h4 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '1.1rem', color: 'var(--dark-navy)', lineHeight: 1.4 }}>{blog.title}</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted-text)', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {blog.excerpt}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <button onClick={() => openEditModal(blog)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Edit2 size={14} /> Edit
              </button>
              <button onClick={() => handleToggleActive(blog)} className="admin-icon-btn" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                {blog.is_active ? <Eye size={14} /> : <EyeOff size={14} />} {blog.is_active ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => handleDelete(blog.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL FORM & EDITOR */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--dark-navy)' }}>{editingRecord ? 'Edit Blog Post' : 'Add Blog Post'}</h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Blog Title</label>
                  <input type="text" required placeholder="e.g. Platform Engineering Services. Use it to gain a Competitive Advantage" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Date</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>Short Excerpt / Summary</label>
                <textarea required placeholder="Write a short summary to show as excerpt on the list page..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="admin-input" rows={2} style={{ width: '100%', resize: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', alignItems: 'flex-start' }}>
                <ImageInputWithUpload
                  label="Featured Image"
                  value={image}
                  onChange={setImage}
                  category="blog"
                  placeholder="e.g. https://..."
                />
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Sort Order</label>
                  <input type="number" required value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="admin-input" style={{ width: '100%', height: '42px' }} />
                </div>
              </div>

              {/* INTEGRATED BUILD-IN BLOG EDITOR */}
              <div style={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 'var(--radius-md)', padding: '1rem', background: 'var(--bg-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark-navy)' }}>Built-in Blog Content</span>
                  <div style={{ display: 'flex', gap: '0.25rem', background: 'white', borderRadius: 'var(--radius-md)', padding: '0.25rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <button type="button" onClick={() => setEditorMode('write')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: 'none', background: editorMode === 'write' ? 'var(--primary-blue)' : 'none', color: editorMode === 'write' ? 'white' : 'var(--dark-text)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      Write (HTML/Text)
                    </button>
                    <button type="button" onClick={() => setEditorMode('preview')} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', border: 'none', background: editorMode === 'preview' ? 'var(--primary-blue)' : 'none', color: editorMode === 'preview' ? 'white' : 'var(--dark-text)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
                      Preview
                    </button>
                  </div>
                </div>

                {editorMode === 'write' ? (
                  <div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--muted-text)', margin: '0 0 0.5rem 0' }}>
                      💡 Leave empty if you want to link to an <strong>external URL</strong> instead. Supports standard HTML tags.
                    </p>
                    <textarea placeholder="<h1>Application Modernization...</h1><p>Our company recently delivered...</p>" value={content} onChange={(e) => setContent(e.target.value)} className="admin-input" rows={8} style={{ width: '100%', resize: 'vertical', background: 'white', fontFamily: 'monospace', fontSize: '0.85rem' }} />
                  </div>
                ) : (
                  <div style={{ padding: '1rem', background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 'var(--radius-sm)', maxHeight: '200px', overflowY: 'auto' }}>
                    {content ? (
                      <div className="built-in-blog-content" dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                      <p style={{ color: 'var(--muted-text)', fontSize: '0.8rem', fontStyle: 'italic', textAlign: 'center', margin: '2rem 0' }}>
                        No built-in content. App will link to external URL.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {!content.trim() && (
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>External Article Link (Only used if Built-in Content is empty)</label>
                  <input type="url" placeholder="e.g. https://www.kryptosinfosys.com/platform-engineering/" value={link} onChange={(e) => setLink(e.target.value)} className="admin-input" style={{ width: '100%' }} />
                </div>
              )}

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
                Is Active (Display on site)
              </label>

              <button type="submit" className="btn btn--orange" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}>
                {upsertMutation.isPending ? 'Saving...' : 'Save Blog Post'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManager;
