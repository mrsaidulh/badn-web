import { useState, useEffect, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Calendar, MapPin, Users, CheckCircle2, Award } from 'lucide-react';
import { Seminar } from '../types';
import { addSeminarRegistration } from '../lib/api';
import { useToast } from './Toast';

interface SeminarModalProps {
  seminar: Seminar | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function SeminarModal({ seminar, isOpen, onClose }: SeminarModalProps) {
  const { success: showSuccessToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    profession: 'Student'
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'register'>('details');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!seminar) return null;

  const handleRegister = (e: FormEvent) => {
    e.preventDefault();

    const newRegistration = {
      id: 'reg_' + Date.now(),
      seminarId: seminar.id,
      seminarTitle: seminar.title,
      studentName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      profession: formData.profession,
      date: new Date().toLocaleDateString('bn-BD')
    };

    addSeminarRegistration(newRegistration);
    showSuccessToast(`"${seminar.title}" ফ্রি সেমিনারে রেজিস্ট্রেশন সফল হয়েছে!`, 'সেমিনার রেজিস্ট্রেশন সফল');

    setIsRegistered(true);
    setTimeout(() => {
      setIsRegistered(false);
      onClose();
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new Event('seminar_registration_added'));
    }, 2500);
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
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#cbdccb]/40 max-h-[calc(100vh-2rem)] flex flex-col"
          >
            {/* Image / Header */}
            <div className="relative h-48 sm:h-56 shrink-0">
              <img
                src={seminar.image}
                alt={seminar.title}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="inline-block text-[11px] font-bold text-white bg-amber-600 px-2.5 py-0.5 rounded-full mb-1.5 w-fit">
                  আন্তর্জাতিক সেমিনার
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
                  {seminar.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 bg-gray-50/50 shrink-0">
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-brand text-brand bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                সেমিনারের বিস্তারিত
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'register'
                    ? 'border-brand text-brand bg-white'
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                ফ্রি রেজিস্ট্রেশন করুন
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'details' ? (
                <div className="space-y-4">
                  {/* Metadata cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-light/60 border border-[#cbdccb]/30">
                      <Calendar className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-brand">তারিখ ও সময়</h4>
                        <p className="text-xs text-gray-700 mt-0.5">{seminar.date}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-brand-light/60 border border-[#cbdccb]/30">
                      <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-brand">স্থান</h4>
                        <p className="text-xs text-gray-700 mt-0.5">{seminar.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Instructor/Expert panel */}
                  <div className="bg-amber-50 border border-amber-200/40 rounded-xl p-3.5 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-600/10 text-amber-800 flex items-center justify-center font-bold text-lg shrink-0">
                      {seminar.expertName[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-amber-800">প্রধান সঞ্চালক</h4>
                      <p className="text-sm font-bold text-gray-900 mt-0.5">{seminar.expertName}</p>
                      <p className="text-xs text-gray-600 leading-normal">{seminar.expertRole}</p>
                    </div>
                  </div>

                  {/* Detailed paragraph */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900">সেমিনারের বিবরণ:</h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-justify">
                      {seminar.description}
                    </p>
                  </div>

                  {/* Call to action in Details Tab */}
                  <button
                    onClick={() => setActiveTab('register')}
                    className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-2.5 px-4 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer mt-4"
                  >
                    <Users className="w-4 h-4" />
                    সেমিনারে যোগ দিতে রেজিস্ট্রেশন করুন
                  </button>
                </div>
              ) : isRegistered ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-14 h-14 bg-[#e2eee2] rounded-full flex items-center justify-center mb-3">
                    <CheckCircle2 className="w-8 h-8 text-brand" />
                  </div>
                  <h4 className="text-xl font-bold text-brand mb-1">রেজিস্ট্রেশন সফল হয়েছে!</h4>
                  <p className="text-xs text-gray-600 max-w-sm leading-normal">
                    ফ্রি সেমিনারে আপনার আসনটি সংরক্ষিত করা হয়েছে। আপনার ইমেইল এবং মোবাইলে সেমিনারের লিংক এবং সময়সূচী পাঠিয়ে দেওয়া হবে।
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="যেমন: ড. সাজিদুল ইসলাম"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        মোবাইল নম্বর <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="যেমন: 018XXXXXXXX"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        ইমেইল <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="যেমন: support@domain.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      পেশা <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.profession}
                      onChange={e => setFormData({ ...formData, profession: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-brand focus:border-transparent bg-white outline-none"
                    >
                      <option value="Student">শিক্ষার্থী (Student)</option>
                      <option value="Nutritionist">পুষ্টিবিদ (Nutritionist)</option>
                      <option value="Doctor">চিকিৎসক (Doctor/MD)</option>
                      <option value="Healthcare worker">স্বাস্থ্যকর্মী (Healthcare professional)</option>
                      <option value="Other">অন্যান্য (Other)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand hover:bg-brand-hover text-white font-bold py-2.5 px-4 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    ফ্রি সীট বুক করুন
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
