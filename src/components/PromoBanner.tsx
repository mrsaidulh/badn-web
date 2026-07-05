import { useState } from 'react';
import { SEMINAR_VIDEO_PLACEHOLDER, SEMINARS } from '../data';
import { Video, Award, Users, Play, Radio } from 'lucide-react';
import SeminarModal from './SeminarModal';

export default function PromoBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const targetSeminar = SEMINARS[0]; // Let's use the first seminar for quick free seat booking

  return (
    <section className="py-16 bg-[#e2eee2]/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-[#cbdccb]/40 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side Details */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 font-bold text-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse text-red-700" />
              <span>সরাসরি লাইভ সেশন</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              অনলাইন ক্লাস ও সেমিনার —<br />
              <span className="text-brand">যেখানেই থাকুন, শিখুন প্রফেশনালি</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              আমাদের অনলাইন লাইভ জুম ক্লাস ও ওয়েব সেমিনারের মাধ্যমে আপনি সুযোগ পাচ্ছেন দেশ-বিদেশের অভিজ্ঞ ক্লিনিক্যাল নিউট্রিশনিস্ট, রেজিস্টার্ড ডায়েটিশিয়ান এবং সিনিয়র বিজ্ঞানীদের কাছ থেকে ঘরে বসেই রিয়েল-টাইমে শেখার। কোনো ক্লাস মিস হলে রয়েছে লাইফটাইম রেকর্ডিং অ্যাক্সেস এবং বিশেষ সাপোর্ট গ্রুপ।
            </p>

            {/* List of features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 text-xs sm:text-sm font-semibold text-gray-700">
              <div className="flex items-center gap-2">
                <span className="text-brand text-lg">✓</span>
                <span>১৬+ ইন্টারেক্টিভ লাইভ সেশন</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand text-lg">✓</span>
                <span>আন্তর্জাতিক মেন্টরদের মেন্টরশিপ</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand text-lg">✓</span>
                <span>স্মার্ট অনলাইন পরীক্ষা ও মূল্যায়ন</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand text-lg">✓</span>
                <span>ডিজিটাল ভেরিফাইড সার্টিফিকেট</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-brand hover:bg-brand-hover text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-amber-400" />
              ফ্রি সেমিনারে অংশগ্রহণ করুন
            </button>
          </div>

          {/* Right Side Video/Grid Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-brand-light/40 rounded-3xl blur-xl -z-10" />
            
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#cbdccb]/40 bg-gray-900 aspect-video group">
              <img
                src={SEMINAR_VIDEO_PLACEHOLDER}
                alt="BADN Online nutrition seminar student grid on Zoom"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500 opacity-90"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />

              {/* Interface grid overlay simulating live students */}
              <div className="absolute inset-0 bg-black/30 p-4 flex flex-col justify-between">
                
                {/* Top status */}
                <div className="flex justify-between items-center">
                  <span className="bg-red-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LIVE
                  </span>
                  <span className="bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm flex items-center gap-1">
                    <Users className="w-3 h-3 text-brand-light" />
                    ৩৪০ জন সংযুক্ত
                  </span>
                </div>

                {/* Middle Play Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center shadow-lg cursor-pointer group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-1" />
                </div>

                {/* Bottom Active Teacher Indicator */}
                <div className="flex items-center justify-between text-[11px] text-white/90 bg-black/60 backdrop-blur-sm p-2 rounded-lg mt-auto">
                  <span className="font-semibold">সঞ্চালনায়: ডায়েটেশিয়ান সাজেদা কাশেম জোতি</span>
                  <span className="text-[10px] text-amber-400 font-bold">CCND Certificate Course</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Free Seminar Modal popup */}
      <SeminarModal
        seminar={targetSeminar}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
