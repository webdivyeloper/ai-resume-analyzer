import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfileApi } from '../services/api';
import { User, Mail, Shield, CheckCircle, AlertCircle, Save, KeyRound } from 'lucide-react';

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
      setError('New passwords do not match.');
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
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      <div className="mb-6 pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-black text-white tracking-tight">Account Profile</h1>
        <p className="text-xs text-slate-400 mt-1">Manage user information and credentials (SRS FR-1.4)</p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Header */}
          <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-600/30">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">{user?.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-slate-400">{user?.email}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 capitalize">
                  {user?.role || 'student'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-[#0b0f19] text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Email is permanent for security authentication</p>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                Update Password (Optional)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Leave blank to keep current"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
