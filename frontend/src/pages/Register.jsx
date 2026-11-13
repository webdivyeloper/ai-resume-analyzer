import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle, FileText } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const user = await register(name, email, password, role);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Email may already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-[#0b0f19]">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl shadow-2xl border border-slate-800 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Create Account</h2>
          <p className="text-xs text-slate-400 mt-1">Register for AI Resume Analyzer platform</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Candidate Name"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-[#0f172a] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            >
              <option value="user">Student / Candidate (Standard)</option>
              <option value="admin">Administrator (Evaluator / Faculty)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
