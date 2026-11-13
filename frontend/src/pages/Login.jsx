import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, FileText, UserCheck, Shield } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'user') {
      setEmail('user@example.com');
      setPassword('password123');
    } else if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
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
          <h2 className="text-xl font-bold text-slate-900">System Sign In</h2>
          <p className="text-xs text-slate-500 mt-0.5">Enter your account credentials to proceed</p>
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
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@example.com"
              className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:border-slate-800 text-xs transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {loading ? (
              <span className="text-xs">Authenticating...</span>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Fast-Fill */}
        <div className="mt-5 pt-4 border-t border-slate-200">
          <span className="block text-[10px] font-semibold uppercase text-slate-400 tracking-wider mb-2 text-center">
            Evaluator Test Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="py-1.5 px-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <UserCheck className="w-3 h-3 text-slate-500" />
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <Shield className="w-3 h-3 text-slate-500" />
              Demo Admin
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Need an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
