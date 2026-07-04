import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Users, BookOpen, MessageSquare, CheckCircle, Trash2, Calendar, Award } from 'lucide-react';

interface InstructorDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstructorDashboard({ isOpen, onClose }: InstructorDashboardProps) {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [seminars, setSeminars] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'enrollments' | 'seminars' | 'inquiries'>('enrollments');

  const loadData = () => {
    setEnrollments(JSON.parse(localStorage.getItem('badn_enrollments') || '[]'));
    setSeminars(JSON.parse(localStorage.getItem('badn_seminar_registrations') || '[]'));
    setInquiries(JSON.parse(localStorage.getItem('badn_contact_messages') || '[]'));
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }

    // Listen to local storage updates
    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('enrollment_added', handleUpdate);
    window.addEventListener('seminar_registration_added', handleUpdate);
    window.addEventListener('contact_message_added', handleUpdate);

    return () => {
      window.removeEventListener('enrollment_added', handleUpdate);
      window.removeEventListener('seminar_registration_added', handleUpdate);
      window.removeEventListener('contact_message_added', handleUpdate);
    };
  }, [isOpen]);

  const handleStatusChange = (id: string, type: 'enrollment' | 'seminar', newStatus: string) => {
    if (type === 'enrollment') {
      const updated = enrollments.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem('badn_enrollments', JSON.stringify(updated));
      setEnrollments(updated);
    } else {
      const updated = seminars.map(item => item.id === id ? { ...item, status: newStatus } : item);
      localStorage.setItem('badn_seminar_registrations', JSON.stringify(updated));
      setSeminars(updated);
    }
  };

  const handleDelete = (id: string, type: 'enrollment' | 'seminar' | 'inquiry') => {
    if (confirm('আপনি কি নিশ্চিত যে এই রেকর্ডটি মুছে ফেলতে চান?')) {
      if (type === 'enrollment') {
        const filtered = enrollments.filter(item => item.id !== id);
        localStorage.setItem('badn_enrollments', JSON.stringify(filtered));
        setEnrollments(filtered);
      } else if (type === 'seminar') {
        const filtered = seminars.filter(item => item.id !== id);
        localStorage.setItem('badn_seminar_registrations', JSON.stringify(filtered));
        setSeminars(filtered);
      } else if (type === 'inquiry') {
        const filtered = inquiries.filter(item => item.id !== id);
        localStorage.setItem('badn_contact_messages', JSON.stringify(filtered));
        setInquiries(filtered);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#cbdccb]/40 h-[85vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-brand text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
                  BADN ইন্ট্রাক্টর ও এডমিন প্যানেল (VPS & SQL Simulator)
                </h3>
                <p className="text-xs text-brand-light/80 mt-1">
                  এই প্যানেল থেকে আপনি ভর্তিকৃত ছাত্র-ছাত্রী, সেমিনারে অংশগ্রহণকারী এবং জিজ্ঞাসাসমূহ রিয়েল-টাইমে দেখতে ও নিয়ন্ত্রণ করতে পারবেন।
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stats overview bar */}
            <div className="bg-brand-light/50 px-6 py-4 border-b border-[#cbdccb]/20 grid grid-cols-3 gap-4 shrink-0">
              <div className="bg-white p-3 rounded-xl border border-[#cbdccb]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] text-gray-500 font-medium">মোট কোর্স ভর্তি</h4>
                  <p className="text-lg font-bold text-gray-900">{enrollments.length}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#cbdccb]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] text-gray-500 font-medium">সেমিনার বুকিং</h4>
                  <p className="text-lg font-bold text-gray-900">{seminars.length}</p>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#cbdccb]/30 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[11px] text-gray-500 font-medium">যোগাযোগ জিজ্ঞাসা</h4>
                  <p className="text-lg font-bold text-gray-900">{inquiries.length}</p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50 shrink-0">
              <button
                onClick={() => setActiveTab('enrollments')}
                className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'enrollments'
                    ? 'border-brand text-brand bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                কোর্স ভর্তি আবেদন ({enrollments.length})
              </button>
              <button
                onClick={() => setActiveTab('seminars')}
                className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'seminars'
                    ? 'border-brand text-brand bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                সেমিনার বুকিং ({seminars.length})
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'inquiries'
                    ? 'border-brand text-brand bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                জিজ্ঞাসা ও মেসেজ ({inquiries.length})
              </button>
            </div>

            {/* List Data */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
