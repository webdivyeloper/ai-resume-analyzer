import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  LayoutDashboard,
  Upload,
  Clock,
  User,
  Shield,
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
    <nav className="bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          {/* Logo & Project Identity */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                AI Resume Analyzer
              </span>
            </Link>
            <span className="hidden sm:inline-block text-[11px] text-slate-400 border-l border-slate-700 pl-3">
              Medicaps University • CSE Dept
            </span>
          </div>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1 text-xs">
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-white bg-slate-800 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>

              <Link
                to="/analyze"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                  isActive('/analyze')
                    ? 'text-white bg-blue-600'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Analyze Resume
              </Link>

              <Link
                to="/history"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                  isActive('/history')
                    ? 'text-white bg-slate-800 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                History
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
                    isActive('/admin')
                      ? 'text-amber-300 bg-slate-800 border border-amber-500/30'
                      : 'text-amber-400 hover:text-amber-300 hover:bg-slate-800/60'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Panel
                </Link>
              )}

              <div className="h-4 w-px bg-slate-700 mx-2" />

              <Link
                to="/profile"
                className={`flex items-center gap-2 px-2.5 py-1 rounded text-xs transition-colors ${
                  isActive('/profile') ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.name}</span>
                {isAdmin && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1 py-0.2 rounded font-mono">
                    ADMIN
                  </span>
                )}
              </Link>

              <button
                onClick={handleLogout}
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs">
              <Link
                to="/login"
                className="px-3 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 text-white bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-1 text-sm">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-slate-200 hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <Link
                to="/analyze"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-blue-400 hover:bg-slate-800 font-medium"
              >
                Analyze Resume
              </Link>
              <Link
                to="/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-slate-200 hover:bg-slate-800"
              >
                History
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded text-amber-300 hover:bg-slate-800"
                >
                  Admin Panel
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-slate-200 hover:bg-slate-800"
              >
                Profile ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded text-rose-400 hover:bg-slate-800"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-slate-200 hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded text-blue-400 hover:bg-slate-800 font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
