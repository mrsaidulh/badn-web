import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  X, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Award, 
  Users, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Video, 
  Target,
  ArrowRight,
  Maximize2,
  Minimize2,
  FolderOpen,
  FolderClosed
} from 'lucide-react';
import { Course } from '../types';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
}

export default function CourseDetailsModal({
  course,
  isOpen,
  onClose,
  onEnroll
}: CourseDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'outcomes' | 'overview'>('syllabus');
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [expandAll, setExpandAll] = useState<boolean>(false);

  // Close on Escape key
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

  // Reset tab and states when course changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab('syllabus');
      setExpandedModuleId(1);
      setExpandAll(false);
    }
  }, [isOpen, course?.id]);

  if (!course) return null;

  const whatsappNumber = course.whatsappNumber || '০১৬৭৭-২৫০৫৯৭';
  const rawWaDigits = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/88${rawWaDigits ? rawWaDigits : '01677250597'}?text=${encodeURIComponent(
    `হ্যালো, আমি বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন (BADN)-এর "${course.title}" কোর্সটিতে ভর্তি ও বিস্তারিত তথ্য সম্পর্কে জানতে আগ্রহী।`
  )}`;

  const toggleModule = (id: number) => {
    if (expandAll) {
      setExpandAll(false);
    }
    setExpandedModuleId(prev => (prev === id ? null : id));
  };

  const handleToggleAllModules = () => {
    setExpandAll(prev => !prev);
    setExpandedModuleId(null);
  };

  const totalClassesCount = course.totalClasses || (course.liveClasses + (course.extraClasses || 3));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
          isFullscreen ? 'p-0' : 'p-0 sm:p-3 md:p-6'
        }`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container - Fullscreen Capable, Mobile Friendly, No Gradients */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 12 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full bg-white z-10 border border-[#cbdccb] flex flex-col overflow-hidden transition-all duration-200 ${
              isFullscreen
                ? 'fixed inset-0 h-[100dvh] w-screen max-w-none max-h-none rounded-none shadow-none'
                : 'h-[100dvh] sm:h-auto sm:max-h-[90vh] sm:max-w-4xl rounded-none sm:rounded-2xl md:rounded-3xl shadow-2xl'
            }`}
          >
            {/* COMPACT HEADER: Space-Optimized, Solid Green, Zero Gradients */}
            <div className="relative bg-[#143a1b] text-white px-3.5 py-3 sm:px-6 sm:py-3.5 shrink-0 border-b border-emerald-900">
              {/* Row 1: Badges & Window Controls */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="bg-amber-500 text-gray-950 font-extrabold text-[10px] sm:text-[11px] px-2 py-0.5 rounded uppercase tracking-wider">
                    {course.category}
                  </span>
                  <span className="bg-white/15 text-emerald-100 text-[10px] sm:text-xs px-2 py-0.5 rounded border border-white/20">
                    শুরু: {course.startDate}
                  </span>
                </div>

                {/* Window Controls: Fullscreen toggle & Close */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(prev => !prev)}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors cursor-pointer"
                    title={isFullscreen ? "নরমাল উইন্ডো করুন" : "পূর্ণ স্ক্রিন (Full Screen) করুন"}
                    aria-label="Toggle Fullscreen"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      <Maximize2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 sm:p-2 rounded-lg bg-white/10 hover:bg-red-600 active:bg-red-700 text-white transition-colors cursor-pointer"
                    aria-label="Close modal"
                    title="বন্ধ করুন"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Course Title */}
              <h2 className="text-base sm:text-xl font-bold text-white leading-snug mt-1.5 line-clamp-1 sm:line-clamp-none">
                {course.title}
              </h2>

              {/* Row 3: Compact Inline Specs (Replaces bulky 4-grid, saves vertical space) */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-emerald-200 mt-1.5 pt-1.5 border-t border-white/10">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  সময়কাল: <strong className="text-white">{course.duration}</strong>
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Video className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  মোট ক্লাস: <strong className="text-white">{totalClassesCount}টি</strong> ({course.liveClasses} লাইভ)
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  মাধ্যম: <strong className="text-white">{course.medium || 'অনলাইন (লাইভ)'}</strong>
                </span>
                <span className="text-white/30 hidden sm:inline">•</span>
                <span className="flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <strong className="text-white">সার্টিফিকেট প্রদান করা হবে</strong>
                </span>
              </div>
            </div>

            {/* CONSOLIDATED TABS BAR: 3 Distinct Tabs, Horizontal Scrollable, Touch Friendly */}
            <div className="flex border-b border-gray-200 bg-[#f8faf8] px-2 sm:px-6 overflow-x-auto scrollbar-none shrink-0 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('syllabus')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'syllabus'
                    ? 'border-[#143a1b] text-[#143a1b] bg-white shadow-xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                <span>সিলেবাস ও বিষয়সমূহ ({course.modules?.length || 10}টি)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('outcomes')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'outcomes'
                    ? 'border-[#143a1b] text-[#143a1b] bg-white shadow-xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Target className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>শিখনফল ও সুবিধাসমূহ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-2.5 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  activeTab === 'overview'
                    ? 'border-[#143a1b] text-[#143a1b] bg-white shadow-xs'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Users className="w-4 h-4 text-blue-600 shrink-0" />
                <span>কোর্স পরিচিতি ও যোগ্যতা</span>
              </button>
            </div>

            {/* SCROLLABLE CONTENT BODY */}
            <div className="p-3.5 sm:p-6 overflow-y-auto flex-1 space-y-4 sm:space-y-5 text-gray-800">
              {/* TAB 1: SYLLABUS & MODULES */}
              {activeTab === 'syllabus' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-gray-100">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-amber-600 shrink-0" />
                        কোর্সের মূল বিষয়ভিত্তিক সিলেবাস
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        ক্লিনিক্যাল গাইডলাইন ও প্র্যাকটিক্যাল কেস স্টাডির ওপর ভিত্তি করে সাজানো।
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleAllModules}
                      className="text-xs font-bold text-[#143a1b] bg-[#eaf3ea] hover:bg-[#cbdccb] border border-[#cbdccb] px-2.5 py-1.5 rounded-lg flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {expandAll ? (
                        <>
                          <FolderClosed className="w-3.5 h-3.5 text-[#143a1b]" />
                          <span>সব বন্ধ করুন</span>
                        </>
                      ) : (
                        <>
                          <FolderOpen className="w-3.5 h-3.5 text-[#143a1b]" />
                          <span>সব খুলুন</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 sm:space-y-2.5">
                    {course.modules && course.modules.length > 0 ? (
                      course.modules.map((mod) => {
                        const isExpanded = expandAll || expandedModuleId === mod.id;
                        return (
                          <div
                            key={mod.id}
                            className={`border rounded-xl transition-all duration-150 overflow-hidden ${
                              isExpanded
                                ? 'border-[#143a1b] bg-[#fafdfa] shadow-xs'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleModule(mod.id)}
                              className="w-full text-left p-3 sm:p-3.5 flex items-center justify-between gap-2.5 cursor-pointer min-h-[46px]"
                            >
                              <div className="flex items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
                                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                                  isExpanded
                                    ? 'bg-[#143a1b] text-white'
                                    : 'bg-[#eaf3ea] text-[#143a1b]'
                                }`}>
                                  {mod.id.toLocaleString('bn-BD')}
                                </span>
                                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug break-words">
                                  {mod.title}
                                </h4>
                              </div>

                              <div className="text-gray-400 p-1 shrink-0">
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-[#143a1b]" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </div>
                            </button>

                            {isExpanded && (
                              <div className="px-3 pb-3 sm:px-4 sm:pb-3.5 pt-0.5 border-t border-[#cbdccb]/40">
                                <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed bg-white p-2.5 sm:p-3 rounded-lg border border-gray-100">
                                  {mod.description}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-gray-500 italic">সিলেবাস তথ্য নেই</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LEARNING OUTCOMES & PERKS (Deduplicated & Cleanly Structured) */}
              {activeTab === 'outcomes' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Practical Diet Planning Highlight */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                      <strong className="font-bold">ব্যবহারিক ডায়েট প্ল্যানিং:</strong> বাস্তব রোগী এবং ল্যাব রিপোর্টের ওপর ভিত্তি করে ইন্ডিভিজুয়াল ও রোগভিত্তিক ডায়েট চার্ট প্রস্তুত করার লাইভ মেন্টরিং ও ফিডব্যাক দেওয়া হবে।
                    </div>
                  </div>

                  {/* Learning Outcomes Checklist */}
                  <div className="space-y-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-700 shrink-0" />
                      কোর্স থেকে যা শিখবেন ও অর্জন করবেন:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                      {course.learningOutcomes?.map((outcome, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white border border-gray-200 flex items-start gap-2.5 hover:border-emerald-300 transition-colors"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                          <p className="text-xs sm:text-[13px] font-semibold text-gray-800 leading-relaxed">
                            {outcome}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Consolidated Perks & Facilities (Clean, non-repetitive) */}
                  <div className="space-y-2 pt-3 border-t border-gray-100">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-amber-600 shrink-0" />
                      কোর্সের বিশেষ সুবিধাসমূহ:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-2.5 rounded-lg bg-[#fafdfa] border border-[#cbdccb]/60 flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">✓</span>
                        <span className="text-xs font-semibold text-gray-800">১৬টি লাইভ ক্লাস + ৩টি এক্সট্রা রিভিশন ক্লাস</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#fafdfa] border border-[#cbdccb]/60 flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">✓</span>
                        <span className="text-xs font-semibold text-gray-800">প্রতিটি ক্লাসের এইচডি রেকর্ডিং ও অ্যাক্সেস</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#fafdfa] border border-[#cbdccb]/60 flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">✓</span>
                        <span className="text-xs font-semibold text-gray-800">পরিপূর্ণ লেকচার শিট ও PDF নোটস</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#fafdfa] border border-[#cbdccb]/60 flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">✓</span>
                        <span className="text-xs font-semibold text-gray-800">বাস্তব ক্লিনিক্যাল কেস অ্যানালাইসিস ও অ্যাসাইনমেন্ট</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#fafdfa] border border-[#cbdccb]/60 flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">✓</span>
                        <span className="text-xs font-semibold text-gray-800">বিশেষজ্ঞ পুষ্টিবিদদের প্রত্যক্ষ মেন্টরশিপ সাপোর্ট</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#fafdfa] border border-[#cbdccb]/60 flex items-center gap-2">
                        <span className="text-emerald-700 font-extrabold text-xs sm:text-sm">✓</span>
                        <span className="text-xs font-semibold text-gray-800">কোর্স সম্পন্নের পর ভেরিফাইড সার্টিফিকেট</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OVERVIEW & ELIGIBILITY */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Overview */}
                  {course.overviewBn && (
                    <div className="space-y-1 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                        কোর্স পরিচিতি
                      </h3>
                      <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed text-justify">
                        {course.overviewBn}
                      </p>
                    </div>
                  )}

                  {/* Why Choose */}
                  {course.whyChoose && (
                    <div className="bg-[#eaf3ea] border border-[#cbdccb] p-3.5 rounded-xl space-y-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#143a1b]">
                        কেন এই কোর্সটি করবেন?
                      </h4>
                      <p className="text-xs sm:text-[13px] text-gray-700 leading-relaxed text-justify">
                        {course.whyChoose}
                      </p>
                    </div>
                  )}

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-blue-600 shrink-0" />
                      কারা এই কোর্সে ভর্তি হতে পারবেন?
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {course.targetAudience?.map((aud, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                          <span className="text-xs sm:text-[13px] font-medium text-gray-800">{aud}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* STICKY FOOTER: Compact, Mobile Friendly, No Gradients */}
            <div className="px-3.5 py-2.5 sm:px-6 sm:py-3.5 bg-white border-t border-gray-200 shrink-0 flex items-center justify-between gap-2.5 shadow-md">
              {/* Fee Display */}
              <div>
                <span className="text-[10px] text-gray-400 line-through block font-medium leading-none">
                  ৳ {Number(course.originalPrice || 0).toLocaleString('bn-BD')} টাকা
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-[11px] font-bold text-gray-500">ফি:</span>
                  <span className="text-base sm:text-xl font-black text-[#143a1b]">
                    ৳ {Number(course.price || 0).toLocaleString('bn-BD')}
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-500">টাকা</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {/* WhatsApp Chat Link */}
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs border border-[#25D366]/40 flex items-center gap-1.5 transition-colors shrink-0 min-h-[38px] sm:min-h-[42px]"
                  title="WhatsApp-এ মেসেজ দিন"
                >
                  <MessageCircle className="w-4 h-4 fill-[#25D366] text-[#25D366]" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Enroll Button */}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEnroll(course);
                  }}
                  className="bg-[#143a1b] hover:bg-[#1d5227] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] sm:min-h-[42px]"
                >
                  <span>ভর্তি হোন</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
