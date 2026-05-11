import { useState, useRef } from 'react';
import { imageService } from '@/api/services/imageService';
import { Upload, Link2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ImageInputWithUploadProps {
  value: string;
  onChange: (url: string) => void;
  label: string;
  placeholder?: string;
  category?: string;
}

const ImageInputWithUpload = ({
  value,
  onChange,
  label,
  placeholder = 'e.g. https://...',
  category = 'general',
}: ImageInputWithUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    /* Validate file is an image */
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const publicUrl = await imageService.uploadDirectFile(file, category);
      onChange(publicUrl);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error('Direct file upload failed:', err);
      setError(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-input-with-upload" style={{ marginBottom: '1.5rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '0.5rem' }}>
        {label}
      </label>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'stretch' }}>
        {/* Input Text URL field */}
        <div style={{ position: 'relative', flex: 1 }}>
          <div style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted-text)', display: 'flex', alignItems: 'center' }}>
            <Link2 size={16} />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="admin-input"
            style={{
              width: '100%',
              paddingLeft: '2.25rem',
              background: 'white',
              border: '1px solid rgba(0,0,0,0.1)',
              height: '42px',
            }}
          />
        </div>

        {/* Local System File Upload Button */}
        <button
          type="button"
          onClick={triggerFileSelect}
          disabled={uploading}
          className="btn"
          style={{
            background: 'var(--dark-navy)',
            color: 'white',
            padding: '0 1.25rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            height: '42px',
            border: 'none',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          {uploading ? (
            <Loader2 size={16} className="spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? 'Uploading...' : 'Upload File'}
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>

      {/* Upload Feedback Notices */}
      {uploadSuccess && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#10b981', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 600 }}>
          <CheckCircle2 size={12} />
          <span>Image uploaded and linked successfully!</span>
        </div>
      )}

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ef4444', fontSize: '0.75rem', marginTop: '0.35rem', fontWeight: 600 }}>
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      )}

      {/* Dynamic Image Preview */}
      {value && value.startsWith('http') && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-sm)', border: '1px dashed rgba(0,0,0,0.05)' }}>
          <div style={{ width: '45px', height: '45px', borderRadius: '4px', overflow: 'hidden', background: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <img
              src={value}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                /* Handle image loading failure gracefully */
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.75rem', color: 'var(--muted-text)' }}>
            <span style={{ fontWeight: 600, display: 'block', color: 'var(--dark-text)' }}>Live Preview</span>
            {value}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageInputWithUpload;
