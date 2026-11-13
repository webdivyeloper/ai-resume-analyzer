import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';
import { User, Mail, Shield, CheckCircle, AlertCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = { name };
      if (password) payload.password = password;

      const res = await updateProfileApi(payload);
      updateUser(res.data.user);
      setSuccess('Account profile updated successfully.');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage user credentials and information (FR-1.4)</p>
      </div>

      {success && (
        <div className="mb-4 p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-3 pb-5 mb-5 border-b border-slate-100">
          <div className="w-10 h-10 rounded bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{user?.name}</h2>
            <p className="text-xs text-slate-500">{user?.email}</p>
            <span className="inline-block px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[10px] mt-1 border border-slate-200 uppercase">
              Role: {user?.role || 'user'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Email Address (Fixed)
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3 py-1.5 rounded border border-slate-200 bg-slate-50 text-slate-400 text-xs cursor-not-allowed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Update Password (Optional)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
