import { useState, useCallback, useEffect } from 'react';
import { Upload, Eye, EyeOff, Trash2, Loader2, X } from 'lucide-react';
import { imageService } from '@/api/services/imageService';
import { IMAGE_CATEGORIES } from '@/constants/appConstants';
import type { ImageRecord, ImageCategory } from '@/types/image.types';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';

/* Safe memory-cleanup File Preview Component */
const FilePreviewItem = ({ file, onDelete }: { file: File; onDelete: () => void }) => {
  const [preview, setPreview] = useState<string>('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!preview) return null;

  return (
    <div className="preview-card" onClick={(e) => e.stopPropagation()}>
      <div className="preview-thumb">
        <img src={preview} alt={file.name} />
      </div>
      <div className="preview-details">
        <p className="preview-filename">{file.name}</p>
        <p className="preview-filesize">{(file.size / 1024).toFixed(1)} KB</p>
      </div>
      <button 
        type="button" 
        className="preview-remove-btn" 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Remove file"
      >
        <X size={14} />
      </button>
    </div>
  );
};

const ImageManager = () => {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [cat, setCat] = useState<ImageCategory>('banner');
  const [name, setName] = useState('');
  const [drag, setDrag] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await imageService.fetchAllAdmin();
      setImages(data);
    } catch (err) {
      showToast('Failed to load images.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const array = Array.from(files);
    setSelectedFiles(prev => [...prev, ...array]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async () => {
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      for (const f of selectedFiles) {
        let uploadName = name;
        if (selectedFiles.length > 1) {
          uploadName = name ? `${name} - ${f.name}` : f.name;
        } else {
          uploadName = name || f.name;
        }

        await imageService.upload({
          file: f,
          name: uploadName,
          category: cat,
          alt_text: uploadName
        });
      }
      setName('');
      setSelectedFiles([]);
      showToast('Image(s) uploaded successfully!', 'success');
      await fetch();
    } catch (err) {
      showToast('Upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleToggle = async (id: string, active: boolean) => {
    try {
      await imageService.toggleActive(id, active);
      setImages(prev => prev.map(img => img.id === id ? { ...img, is_active: active } : img));
      showToast(active ? 'Image activated' : 'Image hidden', 'info');
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (img: ImageRecord) => {
    const isConfirmed = await confirm({
      title: 'Permanently Delete Image',
      message: 'Are you sure you want to permanently delete this image? This action cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (!isConfirmed) return;
    try {
      await imageService.delete(img);
      setImages(prev => prev.filter(i => i.id !== img.id));
      showToast('Image deleted.', 'info');
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const columns = [
    {
      header: 'Preview',
      accessor: (img: ImageRecord) => (
        <div style={{ height: '50px', width: '80px', borderRadius: '4px', overflow: 'hidden', background: '#eee' }}>
          <img src={img.url || undefined} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ),
      width: '100px'
    },
    {
      header: 'Name',
      accessor: 'name' as keyof ImageRecord,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Category',
      accessor: 'category' as keyof ImageRecord,
      sortable: true,
      filterable: true,
      width: '150px'
    },
    {
      header: 'Status',
      accessor: (img: ImageRecord) => (
        <span className={`status-badge ${img.is_active ? 'status-badge--active' : 'status-badge--inactive'}`}>
          {img.is_active ? 'Active' : 'Hidden'}
        </span>
      ),
      width: '100px'
    }
  ];

  return (
    <div className="admin-content-area">
      <div className="admin-header-row">
        <div>
          <h1 className="admin-page__title">Image Manager</h1>
          <p className="admin-page__subtitle">Centralized asset management for the whole site</p>
        </div>
      </div>

      <div className="admin-card-v2" style={{ marginBottom: '2rem' }}>
        <div className="admin-card-v2__header">
          <h3>Upload New Asset</h3>
        </div>
        <div className="admin-card-v2__body">
          <div className="form-row" style={{ alignItems: 'flex-end', gap: '1.5rem' }}>
            <div className="form-group">
              <label>Target Category</label>
              <select value={cat} onChange={(e) => setCat(e.target.value as ImageCategory)} className="admin-input">
                {Object.entries(IMAGE_CATEGORIES).map(([k, v]) => (
                  <option key={k} value={v}>{k.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Custom Name (Optional)</label>
              <input type="text" placeholder="e.g. Hero Banner 2024" value={name} onChange={(e) => setName(e.target.value)} className="admin-input" />
            </div>
          </div>

          <div 
            className={`admin-dropzone ${drag ? 'admin-dropzone--active' : ''} ${uploading ? 'admin-dropzone--uploading' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFileSelect(e.dataTransfer.files); }}
            style={{ marginTop: '1.5rem' }}
          >
            {uploading ? <Loader2 className="spin" size={40} /> : <Upload size={40} />}
            <div className="dropzone-text">
              <h4>{uploading ? 'UPLOADING...' : 'Drag & drop image here'}</h4>
              <p>Supports JPG, PNG, WEBP, SVG</p>
            </div>
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              disabled={uploading}
              onChange={(e) => handleFileSelect(e.target.files)} 
              className="admin-dropzone__input" 
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="previews-grid">
              {selectedFiles.map((file, idx) => (
                <FilePreviewItem 
                  key={idx} 
                  file={file} 
                  onDelete={() => handleRemoveFile(idx)} 
                />
              ))}
            </div>
          )}

          {selectedFiles.length > 0 && (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => setSelectedFiles([])} 
                disabled={uploading}
                className="creative-btn"
                style={{
                  background: 'var(--bg-light)',
                  color: 'var(--dark-navy)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  padding: '0.8rem 2rem',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                Cancel Selection
              </button>
              <button 
                type="button" 
                onClick={handleUploadSubmit} 
                disabled={uploading}
                className="creative-btn creative-btn--sliding parallelogram"
                style={{
                  background: 'var(--primary-orange)',
                  color: 'white',
                  padding: '0.8rem 2.5rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                {uploading ? <Loader2 className="spin" size={18} /> : <Upload size={18} />}
                <span>{uploading ? 'UPLOADING...' : `UPLOAD ${selectedFiles.length} ASSET${selectedFiles.length > 1 ? 'S' : ''}`}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-center" style={{ height: '30vh' }}>
          <Loader2 className="spin" size={32} color="var(--primary-orange)" />
        </div>
      ) : (
        <AdminTable
          data={images}
          columns={columns}
          title="Global Assets"
          actions={(img) => (
            <div className="table-actions">
              <button onClick={() => handleToggle(img.id, !img.is_active)} className="admin-icon-btn" title={img.is_active ? 'Hide' : 'Activate'}>
                {img.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => handleDelete(img)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          )}
        />
      )}
    </div>
  );
};

export default ImageManager;
