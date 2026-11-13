import React, { useState, useEffect } from 'react';
import { getAdminStatsApi, getAdminUsersApi, deleteAdminUserApi } from '../services/api';
import {
  ShieldCheck,
  Users,
  FileText,
  BarChart2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
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
      setError(err.response?.data?.message || 'Failed to load administrator dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${userName}"?`)) return;

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Administrator Panel</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            System monitoring, usage metrics, and user management (SRS FR-8.1 to FR-8.3)
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* System Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Registered Users</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats?.totalUsers || 0}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Active accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Parsed Resumes</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats?.totalResumes || 0}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">PDF files processed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Analyses</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {stats?.totalAnalyses || 0}
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Matches performed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Avg System ATS</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {stats?.averageAtsScore || 0}%
          </p>
          <span className="text-xs text-slate-400 mt-1 block">Candidate average</span>
        </div>
      </div>

      {/* Users Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Registered Users Directory</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage student & candidate user accounts and roles
            </p>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading user registry...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">No users matching search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-5">Role</th>
                  <th className="py-3 px-5">Joined Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isAdminUser = u.role === 'admin';

                  return (
                    <tr key={uid} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-slate-500 text-[11px]">{u.email}</div>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isAdminUser
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {!isAdminUser && (
                          <button
                            onClick={() => handleDeleteUser(uid, u.name)}
                            title="Delete user"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
