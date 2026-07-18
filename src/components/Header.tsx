import { useState, useEffect, FormEvent } from 'react';
import { Menu, X, Award, ShieldAlert, LogIn, Heart, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useToast } from './Toast';
import Logo from './Logo';

interface HeaderProps {
  onOpenDashboard: () => void;
}

export default function Header({ onOpenDashboard }: HeaderProps) {
  const { success: showSuccessToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('badn_dark_mode') === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('badn_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('badn_dark_mode', 'false');
    }
    // Dispatch a custom event to notify other components if necessary
    window.dispatchEvent(new CustomEvent('dark_mode_changed', { detail: isDarkMode }));
  }, [isDarkMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowLoginModal(false);
      }
    };
    if (showLoginModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showLoginModal]);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    showSuccessToast('অ্যাডমিন ড্যাশবোর্ডে সফলভাবে লগইন সম্পন্ন হয়েছে!', 'লগইন সফল');
    setTimeout(() => {
      setShowLoginModal(false);
      onOpenDashboard(); // Open instructor panel on successful login
    }, 1000);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#cbdccb]/20 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand exactly like BADN */}
          <a href="#home" className="flex items-center min-w-0 hover:opacity-90 transition-opacity">
            <Logo showText={false} theme="color" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-5 xl:gap-8 shrink-0">
            <a href="#home" className="text-sm font-semibold text-brand hover:text-amber-600 transition-colors whitespace-nowrap">
              হোম
            </a>
            <a href="#about" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors whitespace-nowrap">
              আমাদের সম্পর্কে
            </a>
            <a href="#courses" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors whitespace-nowrap">
              কোর্স
            </a>
            <a href="#seminars" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors whitespace-nowrap">
              সেমিনার
            </a>
            <a href="#verify-certificate" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors whitespace-nowrap">
              সার্টিফিকেট যাচাই
            </a>
            <a href="#contact" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors whitespace-nowrap">
              যোগাযোগ
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-300 transition-all cursor-pointer flex items-center justify-center shrink-0"
              title={isDarkMode ? 'লাইট মোড (Light Mode)' : 'ডার্ক মোড (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>

            <a
              href="#courses"
              className="px-4.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
            >
              কোর্স করুন
            </a>

            <button
              onClick={() => {
                if (isLoggedIn) {
                  onOpenDashboard();
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="px-4.5 py-2.5 rounded-xl border border-brand text-brand hover:bg-brand-light text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap"
            >
              <LogIn className="w-3.5 h-3.5" />
              {isLoggedIn ? 'আমার ড্যাশবোর্ড' : 'লগইন করুন'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-1.5 text-gray-600 dark:text-zinc-300 bg-gray-100 dark:bg-zinc-800 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center justify-center shrink-0"
              title={isDarkMode ? 'লাইট মোড (Light Mode)' : 'ডার্ক মোড (Dark Mode)'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenDashboard}
              className="p-1.5 text-brand bg-brand-light rounded-lg border border-[#cbdccb]/40"
              title="Instructor Dashboard"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:text-brand hover:bg-gray-100 focus:outline-none transition-all"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <a
            href="#home"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-bold text-brand hover:bg-brand-light transition-all"
          >
            হোম
          </a>
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand hover:bg-brand-light transition-all"
          >
            আমাদের সম্পর্কে
          </a>
          <a
            href="#courses"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand hover:bg-brand-light transition-all"
          >
            কোর্স
          </a>
          <a
            href="#seminars"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand hover:bg-brand-light transition-all"
          >
            সেমিনার
          </a>
          <a
            href="#verify-certificate"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand hover:bg-brand-light transition-all"
          >
            সার্টিফিকেট যাচাই
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand hover:bg-brand-light transition-all"
          >
            যোগাযোগ
          </a>

          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDashboard();
              }}
              className="w-full text-center py-2.5 rounded-xl bg-brand-light text-brand text-xs font-bold border border-[#cbdccb]/40 cursor-pointer"
            >
              ইনস্ট্রাক্টর প্যানেল (VPS)
            </button>

            <a
              href="#courses"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold shadow cursor-pointer"
            >
              কোর্স করুন
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                if (isLoggedIn) {
                  onOpenDashboard();
                } else {
                  setShowLoginModal(true);
                }
              }}
              className="w-full text-center py-2.5 rounded-xl border border-brand text-brand text-xs font-bold cursor-pointer"
            >
              {isLoggedIn ? 'আমার ড্যাশবোর্ড' : 'লগইন করুন'}
            </button>
          </div>
        </div>
      )}

    </header>

    {/* Login Modal */}
    <AnimatePresence>
      {showLoginModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLoginModal(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Scrollable container that centers the modal */}
          <div className="flex min-h-full items-center justify-center p-4 relative z-[101]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl z-10 border border-[#cbdccb]/40 p-6 sm:p-8"
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-[#e2eee2] text-brand rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                  <LogIn className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">ইনস্ট্রাক্টর / স্টুডেন্ট লগইন</h3>
                <p className="text-xs text-gray-500 mt-1">পোর্টালে প্রবেশ করতে আপনার তথ্য দিন</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ইমেইল এড্রেস</label>
                  <input
                    type="email"
                    required
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="যেমন: admin@badn-edu.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">পাসওয়ার্ড</label>
                  <input
                    type="password"
                    required
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none"
                  />
                </div>

                <div className="bg-amber-50 text-[11px] text-amber-800 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
                  💡 ডেমো ভিউ করার জন্য যেকোনো ইমেইল ও পাসওয়ার্ড টাইপ করে সরাসরি লগইন করতে পারেন। এটি আপনাকে রিয়েল-টাইম এডমিন ড্যাশবোর্ডে নিয়ে যাবে।
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-hover text-brand-contrast hover:text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-md hover:shadow-lg cursor-pointer"
                >
                  প্রবেশ করুন
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  </>
);
}
