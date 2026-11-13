import React, { useState, useEffect } from 'react';
import { getAdminStatsApi, getAdminUsersApi, deleteAdminUserApi } from '../services/api';
import {
  Shield,
  Users,
  FileText,
  BarChart2,
  Trash2,
  AlertCircle,
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
      setError(err.response?.data?.message || 'Failed to retrieve administrative records.');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-800">
      <div className="mb-6 pb-4 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Administration & Monitoring
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          System metrics and candidate user accounts (SRS Section 3.8 / FR-8.1 to FR-8.3)
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Registered Users
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {stats?.totalUsers || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Total accounts</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Resumes Stored
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {stats?.totalResumes || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Uploaded PDF files</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Analyses Ran
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {stats?.totalAnalyses || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Job matches computed</span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            System Mean ATS
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
            {stats?.averageAtsScore || 0}%
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">All candidates</span>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            User Accounts Directory
          </h2>

          <div className="relative max-w-xs w-full">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-7 pr-3 py-1 rounded border border-slate-300 text-xs focus:outline-none focus:border-slate-800"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading user records...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">No matching accounts.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">User</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4">Registered Date</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isAdminUser = u.role === 'admin';

                  return (
                    <tr key={uid} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{u.name}</div>
                        <div className="text-slate-500 text-[11px] font-mono">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                            isAdminUser
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] font-mono">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!isAdminUser && (
                          <button
                            onClick={() => handleDeleteUser(uid, u.name)}
                            title="Delete user"
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
