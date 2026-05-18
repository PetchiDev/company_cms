import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, Mail, Lock, Shield, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import './UserManager.css';

const UserManager = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Actually, let's dynamically import createClient to make a clean instance
      const { createClient } = await import('@supabase/supabase-js');
      const authClient = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        {
          auth: { persistSession: false, autoRefreshToken: false }
        }
      );

      // 2. Create the new user in Supabase Auth using the temp client
      const { data, error: signUpError } = await authClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin',
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // 3. Now use the MAIN supabase client (which still has the current Admin's session)
        // to insert the new user into the admins table. Since we are logged in as admin,
        // RLS should allow this insert.
        const { error: adminInsertError } = await supabase
          .from('admins')
          .insert([{ id: data.user.id }]);
          
        if (adminInsertError) {
          // If insert fails (could be due to RLS or duplicate key), check if the user is already in the admins table
          // (which would happen if a Postgres trigger handled it automatically)
          const { data: adminExists } = await supabase
            .from('admins')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();

          if (!adminExists) {
            console.error('Failed to insert into admins table:', adminInsertError);
            throw new Error(`User created but failed to assign admin role: ${adminInsertError.message} (${adminInsertError.code})`);
          }
        }

        setSuccess(true);
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      console.error('Error creating admin:', err);
      setError(err.message || 'Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-manager">
      <div className="admin-header">
        <div className="admin-header__info">
          <h1 className="admin-header__title">Admin Management</h1>
          <p className="admin-header__subtitle">Add and manage administrative users</p>
        </div>
      </div>

      <div className="user-manager__content">
        <div className="user-card">
          <div className="user-card__header">
            <div className="user-card__icon-container">
              <UserPlus className="user-card__icon" size={24} />
            </div>
            <div>
              <h2 className="user-card__title">Create New Admin</h2>
              <p className="user-card__description">New admins will be able to log in with these credentials immediately.</p>
            </div>
          </div>

          <form onSubmit={handleCreateAdmin} className="user-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="user-form__info">
              <Shield size={16} />
              <span>Admins have full access to all CMS modules.</span>
            </div>

            {error && (
              <div className="form-status form-status--error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="form-status form-status--success">
                <CheckCircle size={18} />
                <span>Admin created successfully!</span>
              </div>
            )}

            <button 
              type="submit" 
              className="user-form__submit" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating...
                </>
              ) : (
                'Create Admin User'
              )}
            </button>
          </form>
        </div>

        <div className="info-card">
          <h3 className="info-card__title">Security Guidelines</h3>
          <ul className="info-card__list">
            <li>Use a strong password with at least 8 characters.</li>
            <li>New admins should verify their email if email confirmation is enabled.</li>
            <li>Admins can manage all site content, blogs, and images.</li>
            <li>Be careful when sharing credentials.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserManager;
