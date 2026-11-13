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
      setError('Password must be at least 6 characters long.');
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
      setError(err.response?.data?.message || 'Registration failed. Email may already be registered.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-sm text-slate-900">AI Resume Analyzer</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Account Registration</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create your student or evaluator profile</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-slate-800 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. candidate@example.com"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-slate-800 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-slate-800 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-slate-800 text-xs bg-white"
            >
              <option value="user">Candidate / Student</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="text-xs">Creating account...</span>
            ) : (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                Register Account
              </>
            )}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
