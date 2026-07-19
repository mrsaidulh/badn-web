import { useState, useEffect, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  X, Users, BookOpen, MessageSquare, CheckCircle, Trash2, Calendar, Award, Printer, RefreshCw,
  Lock, User, Eye, EyeOff, LogIn, ShieldAlert, LogOut, Menu, LayoutDashboard, Database, ChevronRight, Info, Layers, Settings
} from 'lucide-react';
import {
  getEnrollments,
  updateEnrollmentStatus,
  deleteEnrollment,
  getSeminars,
  updateSeminarRegistrationStatus,
  deleteSeminarRegistration,
  getInquiries,
  deleteInquiry,
  getDbStatus,
  addCertificate
} from '../lib/api';

import { THEMES, applyTheme, getCurrentTheme, Theme } from '../lib/theme';
import { safeSessionStorage } from '../lib/storage';
import AdminContentManager from './AdminContentManager';

// ==========================================
// ADMIN LOGIN CREDENTIALS
// Feel free to modify these default values!
// ==========================================
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'Password123';

interface InstructorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  isFullPage?: boolean;
}

export default function InstructorDashboard({ isOpen, onClose, isFullPage = false }: InstructorDashboardProps) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [seminars, setSeminars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'enrollments' | 'seminars' | 'inquiries' | 'certificates' | 'content'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme>(getCurrentTheme);

  // Admin Login States
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return safeSessionStorage.getItem('badn_admin_logged_in') === 'true';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase() && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      safeSessionStorage.setItem('badn_admin_logged_in', 'true');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('ভুল ইউজারনেম অথবা পাসওয়ার্ড দেওয়া হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    safeSessionStorage.removeItem('badn_admin_logged_in');
    onClose();
  };

  const handleThemeChange = (id: string) => {
    const updatedTheme = applyTheme(id);
    setActiveTheme(updatedTheme);
  };

  useEffect(() => {
    const handleThemeChangeExternal = (e: any) => {
      if (e.detail) {
        setActiveTheme(e.detail);
      }
    };
    window.addEventListener('theme_changed', handleThemeChangeExternal);
    return () => window.removeEventListener('theme_changed', handleThemeChangeExternal);
  }, []);

  // Certificate Generator States
  const [certStudentName, setCertStudentName] = useState('');
  const [certCourseTitle, setCertCourseTitle] = useState('Certificate Course in Clinical Nutrition & Dietetics (CCND)');
  const [certIssueDate, setCertIssueDate] = useState('July 05, 2026');
  const [certId, setCertId] = useState(() => `BADN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [certSaveSuccess, setCertSaveSuccess] = useState(false);
  const [certSaveError, setCertSaveError] = useState('');

  const generateRandomCertId = () => {
    setCertId(`BADN-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    setCertSaveSuccess(false);
    setCertSaveError('');
  };

  const loadData = async () => {
    const enrolls = await getEnrollments();
    const sems = await getSeminars();
    const inqs = await getInquiries();
    const status = await getDbStatus();

    setEnrollments(Array.isArray(enrolls) ? enrolls : []);
    setSeminars(Array.isArray(sems) ? sems : []);
    setInquiries(Array.isArray(inqs) ? inqs : []);
    setDbStatus(status);
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Listen to updates
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('enrollment_added', handleUpdate);
    window.addEventListener('seminar_registration_added', handleUpdate);
    window.addEventListener('contact_message_added', handleUpdate);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('enrollment_added', handleUpdate);
      window.removeEventListener('seminar_registration_added', handleUpdate);
      window.removeEventListener('contact_message_added', handleUpdate);
    };
  }, [isOpen, onClose]);

  const handleStatusChange = async (id: string, type: 'enrollment' | 'seminar', newStatus: string) => {
    if (type === 'enrollment') {
      await updateEnrollmentStatus(id, newStatus);
      setEnrollments(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      if (newStatus === 'Approved') {
        const enr = enrollments.find(item => item.id === id);
        if (enr) {
          const randCertId = `BADN-2026-${Math.floor(1000 + Math.random() * 9000)}`;
          const today = new Date();
          const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
          const todayStr = today.toLocaleDateString('en-US', options); // e.g. "July 05, 2026"
          
          // Map Bengali names/titles to English
          const mapCourseTitleToEnglish = (title: string) => {
            if (title.includes('সিসিএনডি') || title.includes('ক্লিনিক্যাল') || title.includes('Clinical')) {
              return 'Certificate Course in Clinical Nutrition & Dietetics (CCND)';
            }
            if (title.includes('ডিজিটাল হেলথ') || title.includes('Digital') || title.includes('নিউট্রিশন')) {
              return 'Professional Certificate in Digital Health and Basic Nutrition';
            }
            return title;
          };
          
          const mapStudentNameToEnglish = (name: string) => {
            const dict: Record<string, string> = {
              'জিন্নাতুল জাহরা ঐশী': 'Zinnatul Zahra Oishe',
              'আফরিনা শারমিন তনা': 'Afrina Sharmin Tona',
              'আফরিনা শারমিন': 'Afrina Sharmin',
              'সায়দুল ইসলাম': 'Saidul Islam',
              'সাজেদা কাশেম জ্যোতি': 'Sajeda Kashem Jyoti'
            };
            return dict[name.trim()] || name;
          };

          await addCertificate({
            id: randCertId,
            studentName: mapStudentNameToEnglish(enr.studentName),
            courseTitle: mapCourseTitleToEnglish(enr.courseTitle),
            issueDate: todayStr,
            status: 'Active'
          });
        }
      }
    } else {
      await updateSeminarRegistrationStatus(id, newStatus);
      setSeminars(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    }
  };

  const handleDelete = async (id: string, type: 'enrollment' | 'seminar' | 'inquiry') => {
    if (confirm('আপনি কি নিশ্চিত যে এই রেকর্ডটি মুছে ফেলতে চান?')) {
      if (type === 'enrollment') {
        await deleteEnrollment(id);
        setEnrollments(prev => prev.filter(item => item.id !== id));
      } else if (type === 'seminar') {
        await deleteSeminarRegistration(id);
        setSeminars(prev => prev.filter(item => item.id !== id));
      } else if (type === 'inquiry') {
        await deleteInquiry(id);
        setInquiries(prev => prev.filter(item => item.id !== id));
      }
    }
  };

  return (
    <AnimatePresence>
      {(isOpen || isFullPage) && (
        <div className={isFullPage ? "fixed inset-0 z-50 flex flex-col bg-white" : "fixed inset-0 z-50 flex items-center justify-center p-4"}>
          {/* Backdrop */}
          {!isFullPage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
          )}

          {/* Modal Container */}
          <motion.div
            initial={isFullPage ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={isFullPage ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={isFullPage ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            className={
              isFullPage
                ? "relative w-full h-full bg-white flex flex-col"
                : "relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#cbdccb]/40 h-[90vh] max-h-[calc(100vh-2rem)] flex flex-col"
            }
          >
            {/* Header */}
            <div className="p-6 bg-brand text-brand-contrast flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  BADN ইন্ট্রাক্টর ও এডমিন প্যানেল (VPS & SQL Simulator)
                </h3>
                <p className="text-xs opacity-85 mt-1">
                  এই প্যানেল থেকে আপনি ভর্তিকৃত ছাত্র-ছাত্রী, সেমিনারে অংশগ্রহণকারী এবং জিজ্ঞাসাসমূহ রিয়েল-টাইমে দেখতে ও নিয়ন্ত্রণ করতে পারবেন।
                </p>
                {dbStatus && (
                  <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                    dbStatus.connected 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${dbStatus.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>MySQL: {dbStatus.connected ? `রিয়েল-টাইম কানেক্টেড (${dbStatus.database})` : 'লোকাল লোকালস্টোরেজ মোড অ্যাক্টিভ (VPS-এ কানেক্ট হবে)'}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-black/20 hover:bg-black/35 text-xs font-bold rounded-lg transition-colors border border-white/10 cursor-pointer"
                    title="লগআউট করুন"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>লগআউট</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={
                    isFullPage
                      ? "flex items-center gap-1.5 px-3 py-1.5 bg-black/15 hover:bg-black/30 text-xs font-bold rounded-lg transition-colors border border-white/10 cursor-pointer"
                      : "text-brand-contrast/80 hover:text-brand-contrast hover:bg-black/10 p-2 rounded-full transition-colors"
                  }
                  title={isFullPage ? "হোম পেজে ফিরে যান" : "বন্ধ করুন"}
                >
                  <X className="w-5 h-5" />
                  {isFullPage && <span>হোম পেজ</span>}
                </button>
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="flex-1 bg-gray-50 dark:bg-[#0c140e] flex items-center justify-center p-4 sm:p-8">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md bg-white dark:bg-[#121b14] p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-[#223326] shadow-xl space-y-6"
                >
                  <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-brand-light dark:bg-[#1d2d21] rounded-full flex items-center justify-center text-brand">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">এডমিন লগইন (Admin Login)</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      প্যানেলটি অ্যাক্সেস করতে অনুগ্রহ করে আপনার ইউজারনেম ও পাসওয়ার্ড দিয়ে লগইন করুন।
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-xl text-xs font-semibold flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </motion.div>
                    )}

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">ইউজারনেম (Username):</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User className="w-4 h-4" />
                        </span>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="admin"
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 dark:border-[#223326] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50 dark:bg-[#0c140e] text-gray-800 dark:text-white font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">পাসওয়ার্ড (Password):</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-300 dark:border-[#223326] rounded-xl focus:outline-none focus:ring-2 focus:ring-brand bg-gray-50 dark:bg-[#0c140e] text-gray-800 dark:text-white font-medium"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-brand text-brand-contrast hover:text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 hover:bg-brand-hover cursor-pointer shadow-md transition-all mt-6"
                    >
                      <LogIn className="w-4 h-4" />
                      লগইন করুন
                    </button>
                  </form>
                </motion.div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-gray-50/50 relative">
                
                {/* Mobile Menu Action Bar */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 bg-brand text-brand-contrast shrink-0 border-b border-brand-hover/40 z-30">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-black/10 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-transform"
                  >
                    <Menu className="w-4 h-4" />
                    <span>এডমিন মেনু</span>
                  </button>
                  <span className="text-xs font-bold tracking-wider uppercase">
                    {activeTab === 'overview' && '📊 ড্যাশবোর্ড ওভারভিউ'}
                    {activeTab === 'enrollments' && '📥 কোর্স ভর্তি আবেদন'}
                    {activeTab === 'seminars' && '📅 সেমিনার বুকিং'}
                    {activeTab === 'inquiries' && '✉️ জিজ্ঞাসা ও মেসেজ'}
                    {activeTab === 'certificates' && '🎓 সার্টিফিকেট জেনারেটর'}
                    {activeTab === 'content' && '📝 কন্টেন্ট ম্যানেজমেন্ট'}
                  </span>
                </div>

                {/* Sidebar Section */}
                <div className={`
                  ${isMobileMenuOpen ? 'flex' : 'hidden'} 
                  md:flex flex-col w-full md:w-72 bg-white border-r border-[#cbdccb]/30 shrink-0 overflow-y-auto transition-all duration-300
                  absolute md:relative inset-x-0 bottom-0 top-[48px] md:top-0 z-40 md:z-auto
                `}>
                  {/* Sidebar Header/User info */}
                  <div className="p-5 border-b border-gray-100 bg-brand-light/25 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand text-brand-contrast flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                      AD
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-gray-900">নিয়ন্ত্রণকারী এডমিন</h4>
                      <p className="text-[10px] font-medium text-gray-500">অনলাইন পোর্টাল এডমিন</p>
                    </div>
                  </div>

                  {/* Sidebar Menu Items */}
                  <div className="p-4 space-y-5 flex-1">
                    
                    {/* Category 1: General */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-2">
                        সাধারণ ওভারভিউ
                      </span>
                      <button
                        onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'overview'
                            ? 'bg-brand text-brand-contrast shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <LayoutDashboard className="w-4 h-4 shrink-0" />
                          <span>📊 ড্যাশবোর্ড ওভারভিউ</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>

                    {/* Category 2: Registrations */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-2">
                        অপারেশন ও আবেদনসমূহ
                      </span>
                      
                      {/* Course Enrollments */}
                      <button
                        onClick={() => { setActiveTab('enrollments'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'enrollments'
                            ? 'bg-brand text-brand-contrast shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 shrink-0" />
                          <span>📥 কোর্স ভর্তি আবেদন</span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === 'enrollments' ? 'bg-white text-brand' : 'bg-brand-light text-brand'}`}>
                          {enrollments.length}
                        </span>
                      </button>

                      {/* Seminar Bookings */}
                      <button
                        onClick={() => { setActiveTab('seminars'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'seminars'
                            ? 'bg-brand text-brand-contrast shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 shrink-0" />
                          <span>📅 সেমিনার বুকিং</span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === 'seminars' ? 'bg-white text-brand' : 'bg-brand-light text-brand'}`}>
                          {seminars.length}
                        </span>
                      </button>
                    </div>

                    {/* Category 3: Communications */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-2">
                        শিক্ষার্থী যোগাযোগ
                      </span>

                      {/* Inquiries */}
                      <button
                        onClick={() => { setActiveTab('inquiries'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'inquiries'
                            ? 'bg-brand text-brand-contrast shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 shrink-0" />
                          <span>✉️ জিজ্ঞাসা ও মেসেজ</span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === 'inquiries' ? 'bg-white text-brand' : 'bg-brand-light text-brand'}`}>
                          {inquiries.length}
                        </span>
                      </button>
                    </div>

                    {/* Category 4: Tools */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-2">
                        সনদপত্র ও টুলস
                      </span>

                      {/* Certificates */}
                      <button
                        onClick={() => { setActiveTab('certificates'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'certificates'
                            ? 'bg-brand text-brand-contrast shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 shrink-0" />
                          <span>🎓 সার্টিফিকেট জেনারেটর</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>

                    {/* Category 5: Content */}
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block px-2">
                        কন্টেন্ট এডমিনিস্ট্রেশন
                      </span>

                      {/* Content Management */}
                      <button
                        onClick={() => { setActiveTab('content'); setIsMobileMenuOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeTab === 'content'
                            ? 'bg-[#e97c00] text-white shadow-sm'
                            : 'text-gray-600 hover:text-[#e97c00] hover:bg-orange-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 shrink-0" />
                          <span>📝 লাইভ কন্টেন্ট আপডেট</span>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      </button>
                    </div>

                  </div>

                  {/* Sidebar Footer with Logout */}
                  <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1.5 text-[11px] font-extrabold text-red-600 hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>লগআউট করুন</span>
                    </button>
                    <span className="text-[9px] text-gray-400 font-mono">v1.2.0-Live</span>
                  </div>

                </div>

                {/* Main View Area Container */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  
                  {/* Top Action / Swatches Bar */}
                  <div className="bg-white border-b border-[#cbdccb]/30 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-brand" />
                      <h4 className="text-xs font-bold text-gray-700">
                        {activeTab === 'overview' && '📊 ড্যাশবোর্ড ওভারভিউ'}
                        {activeTab === 'enrollments' && '📥 কোর্স ভর্তি আবেদন তালিকা'}
                        {activeTab === 'seminars' && '📅 সেমিনার বুকিং তালিকা'}
                        {activeTab === 'inquiries' && '✉️ জিজ্ঞাসা ও শিক্ষার্থী মেসেজ'}
                        {activeTab === 'certificates' && '🎓 ব্যাজ ও সার্টিফিকেট জেনারেটর'}
                        {activeTab === 'content' && '📝 লাইভ ওয়েবসাইট কন্টেন্ট এডিটর'}
                      </h4>
                    </div>

                    {/* Website Theme Selector inside main panel */}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-xl border border-gray-200 shadow-inner">
                      <span className="text-[10px] font-bold text-gray-600">ওয়েবসাইট থিম:</span>
                      <div className="flex gap-1.5">
                        {THEMES.map((theme) => (
                          <button
                            key={theme.id}
                            onClick={() => handleThemeChange(theme.id)}
                            title={theme.name}
                            style={{ backgroundColor: theme.primary }}
                            className={`w-4 h-4 rounded-full border border-white transition-all hover:scale-110 cursor-pointer ${
                              activeTheme.id === theme.id ? 'ring-2 ring-gray-400 scale-105' : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scrollable View Area */}
                  <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-brand to-brand-hover text-brand-contrast p-6 rounded-2xl shadow-sm relative overflow-hidden">
                          <div className="absolute right-0 top-0 bottom-0 opacity-10 flex items-center justify-center p-6 select-none pointer-events-none">
                            <Award className="w-40 h-40" />
                          </div>
                          <div className="space-y-2 relative z-10">
                            <span className="text-[9px] bg-white/20 text-white font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              এডমিন পোর্টাল অ্যাক্টিভ
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black">স্বাগতম, BADN এডমিন ড্যাশবোর্ডে!</h2>
                            <p className="text-xs opacity-90 max-w-xl leading-relaxed">
                              এখানে আপনি আপনার একাডেমি বা অ্যাসোসিয়েশনের শিক্ষার্থীদের তথ্য পরিচালনা করতে পারেন। বাম পাশের ক্যাটাগরি মেনু থেকে আপনি রিয়েল-টাইমে যেকোনো বিভাগে গিয়ে তথ্য যাচাই করতে পারবেন।
                            </p>
                          </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <button 
                            onClick={() => setActiveTab('enrollments')}
                            className="bg-white p-4 rounded-2xl border border-[#cbdccb]/30 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 duration-200"
                          >
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                              <Users className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[10px] text-gray-500 font-extrabold uppercase truncate">মোট ভর্তি আবেদন</h4>
                              <p className="text-2xl font-black text-gray-900 mt-0.5">{enrollments.length}</p>
                              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5 mt-0.5">আবেদন পরিচালনা করুন <ChevronRight className="w-3 h-3" /></span>
                            </div>
                          </button>

                          <button 
                            onClick={() => setActiveTab('seminars')}
                            className="bg-white p-4 rounded-2xl border border-[#cbdccb]/30 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 duration-200"
                          >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                              <BookOpen className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[10px] text-gray-500 font-extrabold uppercase truncate">সেমিনার বুকিং</h4>
                              <p className="text-2xl font-black text-gray-900 mt-0.5">{seminars.length}</p>
                              <span className="text-[10px] text-blue-700 font-bold flex items-center gap-0.5 mt-0.5">বুকিংসমূহ দেখুন <ChevronRight className="w-3 h-3" /></span>
                            </div>
                          </button>

                          <button 
                            onClick={() => setActiveTab('inquiries')}
                            className="bg-white p-4 rounded-2xl border border-[#cbdccb]/30 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer hover:-translate-y-0.5 duration-200"
                          >
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
                              <MessageSquare className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[10px] text-gray-500 font-extrabold uppercase truncate">যোগাযোগ জিজ্ঞাসা</h4>
                              <p className="text-2xl font-black text-gray-900 mt-0.5">{inquiries.length}</p>
                              <span className="text-[10px] text-purple-700 font-bold flex items-center gap-0.5 mt-0.5">জিজ্ঞাসা ও মেসেজ দেখুন <ChevronRight className="w-3 h-3" /></span>
                            </div>
                          </button>
                        </div>

                        {/* Database and VPS Environment Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Connection Details card */}
                          <div className="bg-white p-5 rounded-2xl border border-[#cbdccb]/20 shadow-sm space-y-4">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                              <Database className="w-4 h-4 text-brand" />
                              ডেটাবেস সংযোগ পরিস্থিতি
                            </h4>
                            {dbStatus && (
                              <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                  <span className="text-xs text-gray-600 font-semibold">সংযোগ টাইপ:</span>
                                  <span className="text-xs font-extrabold text-gray-800 uppercase font-mono">{dbStatus.connected ? 'MySQL Real-Time API' : 'Client-Side Sim (LocalStorage)'}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                  <span className="text-xs text-gray-600 font-semibold">ডেটাবেস নাম:</span>
                                  <span className="text-xs font-mono font-bold text-[#e97c00]">{dbStatus.database || 'badn_db_simulation'}</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                                  <span className="text-xs text-gray-600 font-semibold">সংযোগ অবস্থা:</span>
                                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${dbStatus.connected ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {dbStatus.connected ? 'কানেক্টেড (Real-Time Synchronized)' : 'সিমুলেশন মোড (রিয়েল-টাইমে ডেটা সেভড)'}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Quick Guide / Help */}
                          <div className="bg-white p-5 rounded-2xl border border-[#cbdccb]/20 shadow-sm space-y-4">
                            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                              <Info className="w-4 h-4 text-amber-600" />
                              ব্যবহারকারীর দ্রুত নির্দেশিকা
                            </h4>
                            <div className="text-xs text-gray-600 space-y-2.5 leading-relaxed">
                              <div className="flex gap-2">
                                <span className="text-amber-500 font-bold shrink-0">১.</span>
                                <p><span className="font-bold text-gray-900">ভর্তি যাচাই:</span> যেকোনো নতুন ভর্তি আবেদন দেখার সাথে সাথে "অনুমোদন করুন" বাটনে ক্লিক করে ছাত্র-ছাত্রীকে এনরোল করতে পারবেন।</p>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-amber-500 font-bold shrink-0">২.</span>
                                <p><span className="font-bold text-gray-900">সার্টিফিকেট ও সনদ:</span> "সার্টিফিকেট জেনারেটর" থেকে শিক্ষার্থীর নাম ও কোর্স নির্বাচন করে এক ক্লিকে রিয়েল-টাইম ইউনিক সনদ তৈরি ও ডাউনলোড করুন।</p>
                              </div>
                              <div className="flex gap-2">
                                <span className="text-amber-500 font-bold shrink-0">৩.</span>
                                <p><span className="font-bold text-gray-900">লাইভ কন্টেন্ট আপডেট:</span> "লাইভ কন্টেন্ট আপডেট" বিভাগ থেকে নতুন নতুন কোর্স, ওয়ার্কশপ বা প্রশংসামূলক রিভিউ তাৎক্ষণিক আপলোড করতে পারেন।</p>
                              </div>
                            </div>
                          </div>

                        </div>

                      </div>
                    )}

              {activeTab === 'enrollments' && (
                <div className="space-y-4">
                  {enrollments.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      কোনো ভর্তির আবেদন এখনও জমা হয়নি। ল্যান্ডিং পেজে কোর্স কার্ডের "ভর্তি হোন" বাটনে ক্লিক করে প্রথম আবেদন করুন!
                    </div>
                  ) : (
                    enrollments.map((enr: any) => (
                      <div key={enr.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                            {enr.courseTitle}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 mt-1">{enr.studentName}</h4>
                          <div className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
                            <p>📞 ফোন: {enr.phone}</p>
                            <p>✉️ ইমেইল: {enr.email}</p>
                            <p>🧬 ব্যাকগ্রাউন্ড: {enr.background}</p>
                            <p>💳 পেমেন্ট: {enr.paymentMethod}</p>
                          </div>
                          {enr.note && <p className="text-xs italic text-amber-800 bg-amber-50 px-2 py-1 rounded-md mt-1 border border-amber-100">📝 নোট: {enr.note}</p>}
                        </div>

                        <div className="flex sm:flex-col items-end gap-2 shrink-0">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                            enr.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            enr.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {enr.status === 'Approved' ? 'ভর্তি অনুমোদিত' : enr.status === 'Rejected' ? 'বাতিলকৃত' : 'যাচাই করা হচ্ছে'}
                          </span>

                          <div className="flex gap-1.5 mt-1">
                            {enr.status !== 'Approved' && (
                              <button
                                onClick={() => handleStatusChange(enr.id, 'enrollment', 'Approved')}
                                className="p-1 text-xs font-bold bg-green-50 hover:bg-green-100 text-green-700 rounded border border-green-200 cursor-pointer"
                                title="অনুমোদন করুন"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(enr.id, 'enrollment')}
                              className="p-1 text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'seminars' && (
                <div className="space-y-4">
                  {seminars.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      কোনো সেমিনার বুকিং পাওয়া যায়নি। সেমিনার সেকশন থেকে প্রথম বুকিং দিন!
                    </div>
                  ) : (
                    seminars.map((reg: any) => (
                      <div key={reg.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                            {reg.seminarTitle}
                          </span>
                          <h4 className="text-sm font-bold text-gray-900 mt-1">{reg.studentName}</h4>
                          <div className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-0.5 mt-1">
                            <p>📞 ফোন: {reg.phone}</p>
                            <p>✉️ ইমেইল: {reg.email}</p>
                            <p>💼 পেশা: {reg.profession}</p>
                            <p>📅 বুকিং তারিখ: {reg.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(reg.id, 'seminar')}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  {inquiries.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                      কোনো মেসেজ বা জিজ্ঞাসা নেই। যোগাযোগের ফর্মটি পূরণ করে মেসেজ পাঠান!
                    </div>
                  ) : (
                    inquiries.map((inq: any) => (
                      <div key={inq.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-gray-900">
                              {inq.firstName} {inq.lastName}
                            </h4>
                            <p className="text-xs text-gray-500">{inq.email} | 📅 {inq.date}</p>
                          </div>
                          <button
                            onClick={() => handleDelete(inq.id, 'inquiry')}
                            className="p-1 bg-red-50 hover:bg-red-100 text-red-700 rounded border border-red-200 cursor-pointer"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-200/50 leading-relaxed whitespace-pre-wrap">
                          {inq.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'certificates' && (
                <div className="space-y-6">
                  {/* Styled style block for custom print routing */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                      body * {
                        visibility: hidden !important;
                      }
                      #printable-certificate, #printable-certificate * {
                        visibility: visible !important;
                      }
                      #printable-certificate {
                        position: fixed !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: 100% !important;
                        max-width: 100% !important;
                        max-height: 100% !important;
                        border: none !important;
                        box-shadow: none !important;
                        background-color: #fdfcf7 !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        transform: none !important;
                        margin: 0 !important;
                        padding: 3rem !important;
                        z-index: 9999999 !important;
                      }
                      @page {
                        size: landscape;
                        margin: 0;
                      }
                    }
                  `}} />

                  <div className="bg-gradient-to-r from-emerald-500/10 to-[#cbdccb]/10 border border-emerald-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        প্রফেশনাল সার্টিফিকেট জেনারেটর ও প্রিন্টার
                      </h4>
                      <p className="text-xs text-gray-600 mt-0.5">
                        এখানে শিক্ষার্থীর নাম লিখে বা ভর্তি আবেদন থেকে সরাসরি যেকোনো শিক্ষার্থীর জন্য প্রিন্ট-রেডি সার্টিফিকেট জেনারেট করতে পারবেন।
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    {/* Controls */}
                    <div className="xl:col-span-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-100 pb-2">
                        সার্টিফিকেট কাস্টমাইজ করুন
                      </h5>

                      {/* Dropdown list from approved student database */}
                      {enrollments.filter((e: any) => e.status === 'Approved').length > 0 ? (
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-emerald-700">অনুমোদিত ছাত্র-ছাত্রী তালিকা:</label>
                          <select
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val) {
                                const selected = enrollments.find((item: any) => item.id === val);
                                if (selected) {
                                  setCertStudentName(selected.studentName);
                                  setCertCourseTitle(selected.courseTitle);
                                }
                              }
                            }}
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg bg-emerald-50/50 text-emerald-900 focus:outline-none focus:ring-1 focus:ring-brand font-semibold cursor-pointer"
                          >
                            <option value="">-- শিক্ষার্থী নির্বাচন করুন --</option>
                            {enrollments.filter((e: any) => e.status === 'Approved').map((enr: any) => (
                              <option key={enr.id} value={enr.id}>
                                {enr.studentName} ({enr.courseTitle})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <p className="text-[10px] text-gray-400 bg-gray-50 p-2 rounded border border-dashed border-gray-200">
                          💡 কোনো অনুমোদিত শিক্ষার্থী থাকলে সরাসরি এখান থেকে তার তথ্য নির্বাচন করা যাবে।
                        </p>
                      )}

                      {/* Manual Name */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-700">শিক্ষার্থীর নাম (বাংলা/ইংরেজি):</label>
                        <input
                          type="text"
                          value={certStudentName}
                          onChange={(e) => setCertStudentName(e.target.value)}
                          placeholder="উদা: জিন্নাতুল জাহরা ঐশী"
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand bg-gray-50 text-gray-800"
                        />
                      </div>

                      {/* Course Selection */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-700">কোর্সের নাম:</label>
                        <input
                          type="text"
                          value={certCourseTitle}
                          onChange={(e) => setCertCourseTitle(e.target.value)}
                          placeholder="উদা: ডিজিটাল হেলথ ও বেসিক নিউট্রিশন"
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand bg-gray-50 text-gray-800"
                        />
                      </div>

                      {/* Certificate ID */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-700">সার্টিফিকেট আইডি:</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={certId}
                            onChange={(e) => setCertId(e.target.value)}
                            placeholder="BADN-2026-XXXX"
                            className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand bg-gray-50 text-gray-800 font-mono"
                          />
                          <button
                            type="button"
                            onClick={generateRandomCertId}
                            className="p-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-700 rounded-lg cursor-pointer"
                            title="নতুন আইডি জেনারেট করুন"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Issue Date */}
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-gray-700">ইস্যুর তারিখ:</label>
                        <input
                          type="text"
                          value={certIssueDate}
                          onChange={(e) => setCertIssueDate(e.target.value)}
                          placeholder="উদা: ০৫ জুলাই, ২০২৬"
                          className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand bg-gray-50 text-gray-800"
                        />
                      </div>

                      {/* Direct Print Button */}
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="w-full py-3 bg-brand text-brand-contrast hover:text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 hover:bg-brand-hover cursor-pointer shadow-md transition-all mt-6"
                      >
                        <Printer className="w-4 h-4" />
                        সার্টিফিকেট প্রিন্ট করুন (Print Certificate)
                      </button>

                      {/* DB Save and Verify Button */}
                      <button
                        type="button"
                        onClick={async () => {
                          setCertSaveSuccess(false);
                          setCertSaveError('');
                          if (!certStudentName.trim()) {
                            setCertSaveError('দয়া করে শিক্ষার্থীর নাম লিখুন।');
                            return;
                          }
                          try {
                            const success = await addCertificate({
                              id: certId,
                              studentName: certStudentName,
                              courseTitle: certCourseTitle,
                              issueDate: certIssueDate,
                              status: 'Active'
                            });
                            if (success) {
                              setCertSaveSuccess(true);
                            } else {
                              setCertSaveError('সংরক্ষণ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
                            }
                          } catch (err: any) {
                            setCertSaveError(err.message || 'Error occurred');
                          }
                        }}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all mt-2"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-100" />
                        ডাটাবেজে সংরক্ষণ ও ভেরিফাইড করুন
                      </button>

                      {certSaveSuccess && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 font-semibold text-center mt-2 animate-pulse">
                          ✓ সার্টিফিকেটটি সফলভাবে সংরক্ষিত ও ভেরিফাইড তালিকায় যুক্ত হয়েছে!
                        </div>
                      )}

                      {certSaveError && (
                        <div className="text-[11px] text-red-800 bg-red-50 border border-red-200 rounded-lg p-2.5 font-semibold text-center mt-2">
                          ⚠ {certSaveError}
                        </div>
                      )}

                      <div className="text-[10px] text-gray-400 bg-amber-50 p-2.5 rounded-lg border border-amber-100 leading-normal">
                        ⚠️ <strong>প্রিন্ট টিপস:</strong> ব্রাউজার প্রিন্ট ডায়ালগ আসার পর "Background Graphics" অপশনটি চালু করুন এবং মার্জিন "None" রাখুন যাতে ব্যাকগ্রাউন্ড কালার ও ডিজাইন পারফেক্ট আসে।
                      </div>
                    </div>

                    {/* Preview Area */}
                    <div className="xl:col-span-8 space-y-4">
                      <div className="flex justify-between items-center bg-emerald-50/50 p-3 rounded-xl border border-emerald-200/40">
                        <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          রিয়েল-টাইম প্রিন্ট প্রিভিউ (ল্যান্ডস্কেপ ফরম্যাট)
                        </span>
                        <button
                          onClick={() => window.print()}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
                        >
                          <Printer className="w-4 h-4" />
                          প্রিন্ট (Print)
                        </button>
                      </div>

                      {/* Certificate Frame with overflow support */}
                      <div className="overflow-x-auto w-full border border-gray-200 rounded-2xl bg-white shadow-inner p-4 flex justify-center">
                        <div className="min-w-[700px] w-full max-w-[840px] p-2 bg-gray-50 rounded-xl">
                          {/* Printable Certificate */}
                          <div 
                            id="printable-certificate" 
                            className="w-full aspect-[1.414] bg-[#fdfcf7] border-8 border-double border-[#6c856c] p-6 sm:p-10 flex flex-col justify-between text-center shadow-lg relative overflow-hidden rounded-md text-gray-800"
                          >
                            {/* Elegant watermark background */}
                            <div className="absolute inset-0 bg-[radial-gradient(#6c856c_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />
                            
                            {/* Gold corner ornaments */}
                            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600/60 pointer-events-none" />
                            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600/60 pointer-events-none" />
                            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600/60 pointer-events-none" />
                            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600/60 pointer-events-none" />

                            {/* Header logo / Badge */}
                            <div className="space-y-1.5">
                              <div className="flex justify-center">
                                <div className="w-12 h-12 bg-[#e2eee2] border-2 border-[#6c856c] rounded-full flex items-center justify-center shadow-sm">
                                  <Award className="w-7 h-7 text-[#416241]" />
                                </div>
                              </div>
                              <h2 className="text-[12px] sm:text-[14px] font-bold text-gray-700 tracking-wider">BANGLADESH ASSOCIATION OF DIGITAL NUTRITIONISTS</h2>
                              <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest font-mono">BADN Academy Certification Board</p>
                            </div>

                            {/* Certificate Title */}
                            <div className="space-y-1">
                              <h1 className="text-xl sm:text-2xl font-black text-[#416241] uppercase tracking-wide">Certificate of Completion</h1>
                              <div className="w-24 h-0.5 bg-amber-600 mx-auto" />
                            </div>

                            {/* Recipient Text */}
                            <div className="space-y-1 sm:space-y-2">
                              <p className="text-[10px] sm:text-[11px] text-gray-500 italic">This is to certify that</p>
                              <h3 className="text-lg sm:text-2xl font-black text-gray-900 border-b-2 border-dashed border-gray-200 pb-1.5 max-w-[80%] mx-auto font-serif">
                                {certStudentName || "[Student Name Here]"}
                              </h3>
                              <p className="text-[10px] sm:text-[11px] text-gray-600 max-w-[80%] mx-auto leading-relaxed">
                                has successfully completed the professional curriculum and passed the examination for the specialized training of <span className="font-bold text-[#416241]">"{certCourseTitle}"</span> to qualify for this certificate.
                              </p>
                            </div>

                            {/* Certificate ID & Issue Date */}
                            <div className="grid grid-cols-3 items-center text-[10px] font-mono text-gray-500 max-w-[85%] mx-auto py-1 sm:py-2 border-t border-b border-gray-100">
                              <div className="text-left pl-2">ID No: <span className="font-bold text-gray-700">{certId}</span></div>
                              
                              <div className="flex flex-col items-center justify-center gap-0.5">
                                <svg width="34" height="34" viewBox="0 0 29 29" fill="none" className="text-gray-800">
                                  <path d="M1 1h7v7H1V1zm1 1h5v5H2V2zm1 1h3v3H3V3zm17-2h7v7h-7V1zm1 1h5v5h-5V2zm1 1h3v3h-3V3zM1 17h7v7H1v-7zm1 1h5v5H2v-5zm1 1h3v3H3v-3z" fill="currentColor" />
                                  <path d="M10 2h1v1h-1V2zm3 0h2v1h-2V2zm4 0h1v1h-1V2zm-7 2h1v1h-1V4zm2 0h1v2h-1V4zm4 0h1v1h-1V4zm-6 3h1v1h-1V7zm3 0h1v1h-1V7zm2 0h1v1h-1V7zm-5 4h1v1h-1v-1zm4 0h2v1h-2v-1zm5 0h1v1h-1v-1zm-9 2h1v2h-1v-2zm3 0h1v1h-1v-1zm4 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-9 3h2v1h-2v-1zm4 0h1v2h-1v-2zm3 0h1v1h-1v-1zm-7 3h1v1h-1v-1zm3 0h2v1h-2v-1zm4 0h1v1h-1v-1zm-7 2h1v1h-1v-1zm4 0h1v1h-1v-1zm3 0h2v1h-2v-1z" fill="currentColor" />
                                </svg>
                                <span className="text-[6px] font-extrabold text-emerald-800 uppercase tracking-tighter">VERIFIED</span>
                              </div>

                              <div className="text-right pr-2">Issue Date: <span className="font-bold text-gray-700">{certIssueDate}</span></div>
                            </div>

                            {/* Signatures and Seal */}
                            <div className="grid grid-cols-3 items-end pt-4">
                              {/* Left signature */}
                              <div className="flex flex-col items-center">
                                <div className="h-6 font-serif italic text-xs sm:text-sm text-gray-600">M. Rahman</div>
                                <div className="w-24 h-px bg-gray-300 my-1" />
                                <span className="text-[8px] sm:text-[9px] text-gray-500">Director, BADN</span>
                              </div>

                              {/* Center Seal */}
                              <div className="flex justify-center relative">
                                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-amber-600/50 flex items-center justify-center bg-amber-50 relative rotate-12 shadow-sm">
                                  <div className="absolute inset-1 rounded-full border border-dashed border-amber-600/30" />
                                  <span className="text-[7px] sm:text-[8px] font-extrabold text-amber-800 tracking-tighter leading-none text-center">BADN OFFICIAL SEAL</span>
                                </div>
                              </div>

                              {/* Right signature */}
                              <div className="flex flex-col items-center">
                                <div className="h-6 font-serif italic text-xs sm:text-sm text-gray-600">Dr. S. Islam</div>
                                <div className="w-24 h-px bg-gray-300 my-1" />
                                <span className="text-[8px] sm:text-[9px] text-gray-500">Chief Instructor, BADN</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'content' && (
                <AdminContentManager />
              )}
            </div>
          </div>
        </div>
        )}
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}
