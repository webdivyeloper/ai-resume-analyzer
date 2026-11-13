import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Sun,
  Moon,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 text-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                Resume<span className="text-indigo-400">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  isActive('/dashboard')
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>

              <Link
                to="/analyze"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                  isActive('/analyze')
                    ? 'text-white bg-indigo-600 shadow-md shadow-indigo-600/30'
                    : 'text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60'
                }`}
              >
                <UploadCloud className="w-4 h-4" />
                Analyze Resume
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                  isActive('/history')
                    ? 'text-indigo-400 bg-indigo-500/10 border border-indigo-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <History className="w-4 h-4" />
                History
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all ${
                    isActive('/admin')
                      ? 'text-purple-400 bg-purple-500/10 border border-purple-500/30'
                      : 'text-purple-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}

              <div className="h-5 w-px bg-slate-800 mx-1.5" />

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                  isActive('/profile')
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                    : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="truncate max-w-[110px]">{user?.name}</span>
                {isAdmin && (
                  <span className="bg-purple-950 text-purple-300 border border-purple-700/50 text-[10px] px-1.5 py-0.2 rounded font-mono uppercase">
                    Admin
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                title="Log Out"
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors ml-1"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2.5 text-xs font-semibold">
              <button
                type="button"
                onClick={toggleTheme}
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <Link
                to="/login"
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0f172a] px-4 pt-2 pb-4 space-y-1 text-sm font-medium">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-indigo-400 bg-indigo-950/60 font-semibold"
              >
                Analyze Resume
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                History
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-purple-400 bg-purple-950/40"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-indigo-400 font-bold"
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
