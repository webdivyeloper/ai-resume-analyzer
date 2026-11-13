import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, FileText, UserCheck, Shield, Check } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filledType, setFilledType] = useState(null);

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
      setError(err.response?.data?.message || 'Invalid email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    setFilledType(type);
    if (type === 'user') {
      setEmail('user@example.com');
      setPassword('password123');
    } else if (type === 'admin') {
      setEmail('admin@example.com');
      setPassword('admin123');
    }
    setTimeout(() => setFilledType(null), 1500);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md theme-card rounded-2xl border p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-600/30">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black theme-text-main tracking-tight">Sign In</h2>
          <p className="text-xs theme-text-muted mt-1">Access your resume analyses & ATS reports</p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Fast Fill for Testing */}
        <div className="mb-6 p-3 rounded-xl theme-card-subtle border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">
              1-Click Demo Accounts
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">Quick Fill</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('user')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold theme-card hover:border-indigo-500 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border cursor-pointer"
            >
              {filledType === 'user' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <UserCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              )}
              Student User
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold theme-card hover:border-violet-500 text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all border cursor-pointer"
            >
              {filledType === 'admin' ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Shield className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              )}
              Admin User
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold theme-text-main uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border theme-input text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold theme-text-main uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border theme-input text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t theme-border text-center text-xs theme-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
