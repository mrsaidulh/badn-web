import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Facebook, 
  MessageCircle, 
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Course } from '../types';
import { 
  getCourseShareUrl, 
  openWhatsAppShare, 
  openFacebookShare, 
  copyCourseLinkToClipboard, 
  triggerNativeShare 
} from '../lib/shareUtils';
import { useToast } from './Toast';

interface CourseShareModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseShareModal({
  course,
  isOpen,
  onClose,
}: CourseShareModalProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  if (!course) return null;

  const shareUrl = getCourseShareUrl(course.id);
  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  const handleCopyLink = async () => {
    const success = await copyCourseLinkToClipboard(course);
    if (success) {
      setCopied(true);
      toast.success('কোর্সের ডিরেক্ট লিংক সফলভাবে কপি করা হয়েছে!');
      setTimeout(() => setCopied(false), 2500);
    } else {
      toast.error('লিংক কপি করতে সমস্যা হয়েছে। দয়া করে ম্যানুয়ালি কপি করুন।');
    }
  };

  const handleWhatsApp = () => {
    openWhatsAppShare(course);
    toast.info('হোয়াটসঅ্যাপে কোর্সের বিস্তারিত শেয়ার উইন্ডো খোলা হয়েছে।');
  };

  const handleFacebook = () => {
    openFacebookShare(course);
    toast.info('ফেসবুক শেয়ার ডায়ালগ খোলা হয়েছে।');
  };

  const handleNativeShare = async () => {
    const shared = await triggerNativeShare(course);
    if (shared) {
      toast.success('শেয়ার সম্পন্ন হয়েছে!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-[#cbdccb] z-10"
          >
            {/* Header */}
            <div className="bg-[#143a1b] text-white px-5 py-4 flex items-center justify-between border-b border-emerald-900">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                    কোর্সটি শেয়ার করুন
                  </h3>
                  <p className="text-[11px] text-emerald-200 mt-0.5">
                    বন্ধুবান্ধব ও শিক্ষার্থীদের সাথে তথ্য শেয়ার করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 space-y-4 text-gray-800">
              {/* Course Mini Preview Card */}
              <div className="bg-[#fafdfa] border border-[#cbdccb]/70 rounded-xl p-3 flex items-start gap-3">
                <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded uppercase">
                    {course.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug line-clamp-2 mt-1">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-600 mt-1 font-medium">
                    <span>⏱️ {course.duration}</span>
                    <span>•</span>
                    <span className="font-bold text-[#143a1b]">৳ {Number(course.price || 0).toLocaleString('bn-BD')} টাকা</span>
                  </div>
                </div>
              </div>

              {/* Main Share Buttons */}
              <div className="space-y-2.5">
                {/* WhatsApp Button */}
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3 rounded-xl flex items-center justify-between transition-all duration-200 shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 fill-white text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold leading-tight">
                        হোয়াটসঅ্যাপে পাঠান (WhatsApp)
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-white/90">
                        পূর্ণ বিবরণ ও সিলেবাস লিংক সহ মেসেজ তৈরি হবে
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Facebook Button */}
                <button
                  type="button"
                  onClick={handleFacebook}
                  className="w-full bg-[#1877F2] hover:bg-[#166fe5] text-white p-3 rounded-xl flex items-center justify-between transition-all duration-200 shadow-sm cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <Facebook className="w-5 h-5 fill-white text-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-bold leading-tight">
                        ফেসবুকে শেয়ার করুন (Facebook)
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-white/90">
                        টাইমলাইন, গ্রুপ বা পেজে পোস্ট করুন
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>

                {/* Native Device Share (Available on mobile devices) */}
                {hasNativeShare && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full bg-[#143a1b] hover:bg-[#1c4e25] text-white p-3 rounded-xl flex items-center justify-between transition-all duration-200 shadow-sm cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-bold leading-tight">
                          ডিভাইসের অ্যাপসে শেয়ার করুন
                        </div>
                        <div className="text-[10px] sm:text-[11px] text-white/90">
                          মেসেঞ্জার, ইনস্টাগ্রাম, টেলিগ্রাম ইত্যাদিতে
                        </div>
                      </div>
                    </div>
                    <Share2 className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform shrink-0" />
                  </button>
                )}
              </div>

              {/* Direct Link Section */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <label className="text-[11px] sm:text-xs font-bold text-gray-700 flex items-center justify-between">
                  <span>কোর্সের ডিরেক্ট লিংক (Direct Link):</span>
                  <span className="text-[10px] font-normal text-emerald-800 bg-[#eaf3ea] px-1.5 py-0.5 rounded">
                    ক্লিক করলে সরাসরি এই কোর্স খুলবে
                  </span>
                </label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1.5 focus-within:border-[#143a1b]">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 bg-transparent text-[11px] sm:text-xs text-gray-700 font-mono px-2 outline-none select-all truncate"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1 shrink-0 cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#143a1b] hover:bg-[#1d5227] text-white'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>কপি হয়েছে</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি লিংক</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Note footer */}
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-center text-[11px] text-gray-500 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>লিংকটি ওপেন করলে শিক্ষার্থী সরাসরি এই কোর্সের সম্পূর্ণ সিলেবাস ও তথ্য দেখতে পাবে।</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
