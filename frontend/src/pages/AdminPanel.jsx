import React, { useState, useEffect } from 'react';
import { getAdminStatsApi, getAdminUsersApi, deleteAdminUserApi } from '../services/api';
import {
  ShieldCheck,
  Users,
  FileText,
  BarChart2,
  Trash2,
  AlertCircle,
  Search,
  Sparkles,
} from 'lucide-react';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        getAdminStatsApi(),
        getAdminUsersApi(),
      ]);
      setStats(statsRes.data?.stats);
      setUsers(usersRes.data?.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve administrator records.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, userName) => {
    if (!window.confirm(`Delete user "${userName}" and associated records?`)) return;

    try {
      await deleteAdminUserApi(id);
      setUsers((prev) => prev.filter((u) => u.id !== id && u._id !== id));
      if (stats) {
        setStats({ ...stats, totalUsers: Math.max(0, stats.totalUsers - 1) });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) => {
    return (
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Console</h1>
          </div>
          <p className="text-xs text-slate-400">
            System health, usage analytics, and user account management (SRS FR-8)
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0f172a] border border-slate-800 text-xs font-mono text-emerald-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
          Database: Persistent Active
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats?.totalUsers ?? '...'}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Registered student/admin accounts</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resumes Stored</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats?.totalResumes ?? '...'}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Indexed PDF documents</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total ATS Scans</span>
            <div className="w-9 h-9 rounded-xl bg-violet-950/80 border border-violet-700/60 flex items-center justify-center text-violet-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">{stats?.totalAnalyses ?? '...'}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Completed evaluations</span>
        </div>

        <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="w-9 h-9 rounded-xl bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">
            {stats?.averageScore ? `${stats.averageScore}%` : '0%'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Cross-platform benchmark</span>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-[#111827] rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Registered Users</h2>
            <p className="text-xs text-slate-400 mt-0.5">View system users and manage privileges</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500">Loading user accounts...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No users found matching query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f172a] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-6">User</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Joined</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredUsers.map((u) => {
                  const id = u.id || u._id;
                  const isUserAdmin = u.role === 'admin';
                  return (
                    <tr key={id} className="hover:bg-[#162033] transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isUserAdmin
                              ? 'bg-purple-950/80 border border-purple-700/60 text-purple-300'
                              : 'bg-indigo-950/80 border border-indigo-700/60 text-indigo-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-400">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {!isUserAdmin && (
                          <button
                            onClick={() => handleDeleteUser(id, u.name)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg border border-transparent hover:border-rose-900/50 transition-colors"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
