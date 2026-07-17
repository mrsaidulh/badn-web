import { useState, useEffect, FormEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, CheckCircle2, Calendar, BookOpen, Clock, Award } from 'lucide-react';
import { Course } from '../types';
import { addEnrollment } from '../lib/api';
import { useToast } from './Toast';

interface EnrollModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EnrollModal({ course, isOpen, onClose }: EnrollModalProps) {
  const { success: showSuccessToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    background: 'Nutrition',
    paymentMethod: 'bKash',
    note: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  if (!course) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const newEnrollment = {
      id: 'enr_' + Date.now(),
      courseId: course.id,
      courseTitle: course.title,
      studentName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      background: formData.background,
      paymentMethod: formData.paymentMethod,
      note: formData.note,
      price: course.price,
      status: 'Pending',
      date: new Date().toLocaleDateString('bn-BD')
    };
    
    addEnrollment(newEnrollment);
    showSuccessToast(`"${course.title}" কোর্সে আপনার ভর্তির আবেদন সফলভাবে গ্রহণ করা হয়েছে!`, 'ভর্তি আবেদন সফল');
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new Event('enrollment_added'));
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
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#cbdccb]/40 max-h-[calc(100vh-2rem)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-brand text-brand-contrast relative shrink-0">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-brand-contrast/80 hover:text-brand-contrast hover:bg-black/10 p-1.5 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="inline-block text-xs bg-white/30 text-brand-contrast font-semibold px-2.5 py-1 rounded-full mb-2">
                ভর্তি ফরম
              </span>
              <h3 className="text-xl font-bold leading-tight select-none text-brand-contrast">
                {course.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-16 h-16 bg-[#e2eee2] rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-brand" />
                  </div>
                  <h4 className="text-2xl font-bold text-brand mb-2">ধন্যবাদ! আবেদন সফল হয়েছে।</h4>
                  <p className="text-sm text-gray-600 max-w-sm">
                    আপনার ভর্তি ফরমটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের কোর্স কো-অর্ডিনেটর খুব শীঘ্রই আপনার মোবাইলে বা ইমেইলে যোগাযোগ করবেন।
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Course Quick Stats */}
                  <div className="bg-brand-light p-3.5 rounded-xl flex items-center justify-between text-xs text-brand font-medium border border-[#cbdccb]/30">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-brand" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4 text-brand" />
                      <span>{course.liveClasses} টি লাইভ ক্লাস</span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-base text-amber-600">
                      <span>৳ {course.price.toLocaleString('bn-BD')}</span>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      আপনার নাম (Full Name) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="যেমন: ফাতেমা আক্তার"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        মোবাইল নম্বর (Phone) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="যেমন: 017XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ইমেইল এড্রেস (Email) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="যেমন: name@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        পেশাগত ব্যাকগ্রাউন্ড <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.background}
                        onChange={e => setFormData({ ...formData, background: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-white transition-all"
                      >
                        <option value="Nutrition">ফুড অ্যান্ড নিউট্রিশন ব্যাকগ্রাউন্ড</option>
                        <option value="Medical">মেডিকেল বা ডেন্টাল (MBBS/BDS)</option>
                        <option value="Nursing">নার্সিং বা মিডওয়াইফারি</option>
                        <option value="Home Economics">হোম ইকোনমিক্স</option>
                        <option value="General Student">অন্যান্য বিজ্ঞানের শিক্ষার্থী</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        পেমেন্ট পদ্ধতি <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.paymentMethod}
                        onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm bg-white transition-all"
                      >
                        <option value="bKash">বিকাশ (bKash)</option>
                        <option value="Nagad">নগদ (Nagad)</option>
                        <option value="Rocket">রকেট (Rocket)</option>
                        <option value="Bank">ব্যাংক ট্রান্সফার (Bank Transfer)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      বিশেষ কোনো জিজ্ঞাসা বা নোট (ঐচ্ছিক)
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      rows={2}
                      placeholder="আপনার কোনো জানার বিষয় থাকলে এখানে লিখতে পারেন..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent text-sm transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 transform active:scale-[0.98] mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-5 h-5" />
                    ভর্তি আবেদন জমা দিন
                  </button>

                  <p className="text-[11px] text-center text-gray-500 mt-2">
                    * আপনার তথ্য সম্পূর্ণরূপে গোপন এবং সুরক্ষিত রাখা হবে।
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
