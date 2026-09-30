import { useState } from 'react';
import { SEMINARS, PROMO_BANNER_IMAGE, PROMO_BANNER_FALLBACK_IMAGE } from '../data';
import { Video, Radio } from 'lucide-react';
import SeminarModal from './SeminarModal';

export default function PromoBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerImg, setBannerImg] = useState<string>(PROMO_BANNER_IMAGE);
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
              <span className="text-[#e17100]">যেখানেই থাকুন, শিখুন প্রফেশনালি</span>
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
              className="w-full sm:w-auto inline-flex items-center justify-center bg-brand hover:bg-brand-hover text-brand-contrast hover:text-white font-bold text-sm px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 gap-2 cursor-pointer"
            >
              <Video className="w-4 h-4 text-amber-400" />
              ফ্রি সেমিনারে অংশগ্রহণ করুন
            </button>
          </div>

          {/* Right Side Video/Grid Mockup */}
          <div className="lg:col-span-6 relative">
            <div className="absolute inset-0 bg-brand-light/40 rounded-3xl blur-xl -z-10" />
            
            <div 
              onClick={() => setIsModalOpen(true)}
              className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-100 aspect-video max-h-[460px] group cursor-pointer"
            >
              <picture>
                <source
                  type="image/webp"
                  media="(max-width: 640px)"
                  srcSet="/optimized/course-8-mobile.webp"
                />
                <source
                  type="image/webp"
                  srcSet="/optimized/course-8.webp"
                />
                <img
                  src={bannerImg}
                  onError={() => {
                    if (bannerImg !== PROMO_BANNER_FALLBACK_IMAGE) {
                      setBannerImg(PROMO_BANNER_FALLBACK_IMAGE);
                    }
                  }}
                  alt="BADN Online Interactive Class Session"
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  width={640}
                  height={360}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </picture>

              {/* Interface overlay simulating live students */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end pointer-events-none">
                <div className="flex items-center justify-between text-[11px] text-white/95 bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10">
                  <span className="font-semibold">অনলাইন ক্লাস ও সেমিনার</span>
                  <span className="text-[10px] text-amber-400 font-bold">BADN Academy</span>
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
