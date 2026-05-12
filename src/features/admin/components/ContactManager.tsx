import { useState, useEffect } from 'react';
import { contactService } from '@/api/services/contactService';
import type { ContactSubmission } from '@/types/contact.types';
import { Trash2, Loader2, CheckCircle, Mail, Phone, Briefcase, MessageCircle } from 'lucide-react';
import { AdminTable } from '@/components/common/AdminTable/AdminTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useConfirm } from '@/components/ui/Modal/ConfirmProvider';

const ContactManager = () => {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [subs, setSubs] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactService.fetchAll()
      .then((d) => { setSubs(d); setLoading(false); })
      .catch(() => {
        showToast('Failed to fetch submissions.', 'error');
        setLoading(false);
      });
  }, [showToast]);

  const handleMarkRead = async (id: string) => {
    try {
      await contactService.markAsRead(id);
      setSubs(p => p.map(x => x.id === id ? { ...x, is_read: true } : x));
      showToast('Marked as read', 'info');
    } catch (err) {
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = await confirm({
      title: 'Delete Submission',
      message: 'Are you sure you want to delete this contact submission? This action is permanent and cannot be undone.',
      type: 'danger',
      confirmText: 'Delete'
    });
    if (!isConfirmed) return;
    try {
      await contactService.deleteSubmission(id);
      setSubs(p => p.filter(x => x.id !== id));
      showToast('Submission deleted.', 'info');
    } catch (err) {
      showToast('Delete failed.', 'error');
    }
  };

  const columns = [
    {
      header: 'Name',
      accessor: (s: ContactSubmission) => (
        <div style={{ fontWeight: 700, color: s.is_read ? 'inherit' : 'var(--dark-navy)' }}>
          {s.name} {!s.is_read && <span className="status-badge status-badge--active" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', marginLeft: '0.5rem' }}>NEW</span>}
        </div>
      ),
      sortable: true,
      filterable: true,
    },
    {
      header: 'Company',
      accessor: 'company' as keyof ContactSubmission,
      sortable: true,
      filterable: true,
    },
    {
      header: 'Budget',
      accessor: 'budget' as keyof ContactSubmission,
      width: '120px'
    },
    {
      header: 'Date',
      accessor: (s: ContactSubmission) => new Date(s.created_at || '').toLocaleDateString(),
      sortable: true,
      width: '120px'
    }
  ];

  if (loading && subs.length === 0) {
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
          <h1 className="admin-page__title">Contact Submissions</h1>
          <p className="admin-page__subtitle">Review leads and inquiries from the main site</p>
        </div>
      </div>

      <AdminTable
        data={subs}
        columns={columns}
        title="Recent Inquiries"
        expandable={(s: ContactSubmission) => (
          <div className="submission-detail slide-in-up">
            <div className="detail-grid">
              <div className="detail-item">
                <Mail size={16} /> <span>{s.email}</span>
              </div>
              <div className="detail-item">
                <Phone size={16} /> <span>{s.phone}</span>
              </div>
              <div className="detail-item">
                <Briefcase size={16} /> <span>{s.budget}</span>
              </div>
            </div>
            <div className="detail-message">
              <MessageCircle size={18} />
              <p>{s.message}</p>
            </div>
            <div className="detail-footer">
              {!s.is_read && (
                <button onClick={() => handleMarkRead(s.id)} className="creative-btn creative-btn--sliding parallelogram" style={{ background: 'var(--primary-blue)', color: 'white', padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>
                  <CheckCircle size={14} /> <span>MARK AS READ</span>
                </button>
              )}
              <button onClick={() => handleDelete(s.id)} className="admin-icon-btn admin-icon-btn--danger" style={{ height: '36px', width: '36px' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
        actions={(s) => (
           <div className="table-actions">
             <button onClick={() => handleMarkRead(s.id)} disabled={s.is_read} className="admin-icon-btn" title="Mark as read" style={{ opacity: s.is_read ? 0.3 : 1 }}>
               <CheckCircle size={16} />
             </button>
             <button onClick={() => handleDelete(s.id)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
               <Trash2 size={16} />
             </button>
           </div>
        )}
      />
    </div>
  );
};

export default ContactManager;
