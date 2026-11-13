import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  LayoutDashboard,
  UploadCloud,
  History,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Resume<span className="text-indigo-600">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isActive('/dashboard')
                    ? 'text-indigo-600 bg-indigo-50/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/analyze"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-all ${
                  isActive('/analyze')
                    ? 'text-white bg-indigo-600 shadow-md shadow-indigo-500/20'
                    : 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 hover:shadow-xs'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                Analyze Resume
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                  isActive('/history')
                    ? 'text-indigo-600 bg-indigo-50/80 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                    isActive('/admin')
                      ? 'text-purple-700 bg-purple-50 shadow-xs'
                      : 'text-purple-600 hover:text-purple-800 hover:bg-purple-50'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              <div className="h-5 w-px bg-slate-200 mx-2" />

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  isActive('/profile')
                    ? 'border-indigo-300 bg-indigo-50/50 text-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="truncate max-w-[110px]">{user?.name}</span>
                {isAdmin && (
                  <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.2 rounded font-mono uppercase">
                    Admin
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
              <Link
                to="/login"
                className="px-4 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-indigo-600 bg-indigo-50 font-semibold"
              >
                Analyze Resume
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                History
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-purple-700 bg-purple-50"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-indigo-600 font-bold"
              >
                Register Account
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
