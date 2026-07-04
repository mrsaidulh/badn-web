import { useState, FormEvent } from 'react';
import { Menu, X, Award, ShieldAlert, LogIn, Heart } from 'lucide-react';

interface HeaderProps {
  onOpenDashboard: () => void;
}

export default function Header({ onOpenDashboard }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setTimeout(() => {
      setShowLoginModal(false);
      onOpenDashboard(); // Open instructor panel on successful login
    }, 1000);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#cbdccb]/20 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand exactly like BADN */}
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 bg-brand rounded-full flex items-center justify-center text-white font-black text-lg shadow-md border border-amber-500/30">
              <Heart className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-brand block leading-none">
                BADN
              </span>
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider block mt-1">
                Academy of Dietetics & Nutrition
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <a href="#home" className="text-sm font-semibold text-brand hover:text-amber-600 transition-colors">
              হোম
            </a>
            <a href="#about" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors">
              আমাদের সম্পর্কে
            </a>
            <a href="#courses" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors">
              কোর্স
            </a>
            <a href="#seminars" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors">
              সেমিনার
            </a>
            <a href="#contact" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors">
              যোগাযোগ করুন
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-light hover:bg-[#d9ecd9] text-brand text-xs font-bold border border-[#cbdccb]/40 shadow-sm transition-all cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-brand" />
              ইনস্ট্রাক্টর প্যানেল
            </button>

            <a
              href="#courses"
              className="px-4.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
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
              className="px-4.5 py-2.5 rounded-xl border border-brand text-brand hover:bg-brand-light text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              {isLoggedIn ? 'আমার ড্যাশবোর্ড' : 'লগইন করুন'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
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
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:text-brand hover:bg-brand-light transition-all"
          >
            যোগাযোগ করুন
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

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setShowLoginModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden z-10 border border-[#cbdccb]/30 p-6">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#e2eee2] text-brand rounded-full flex items-center justify-center mx-auto mb-2">
                <LogIn className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">ইনস্ট্রাক্টর / স্টুডেন্ট লগইন</h3>
              <p className="text-xs text-gray-500 mt-1">পোর্টালে প্রবেশ করতে আপনার তথ্য দিন</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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

              <div className="bg-amber-50 text-[11px] text-amber-800 p-2.5 rounded border border-amber-200/50 leading-relaxed">
                💡 ডেমো ভিউ করার জন্য যেকোনো ইমেইল ও পাসওয়ার্ড টাইপ করে সরাসরি লগইন করতে পারেন। এটি আপনাকে রিয়েল-টাইম এডমিন ড্যাশবোর্ডে নিয়ে যাবে।
              </div>

              <button
                type="submit"
                className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
              >
                প্রবেশ করুন
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
