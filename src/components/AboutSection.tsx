import React, { useState } from 'react';
import { ABOUT_FEATURES, WORKSHOP_MAIN_IMAGE, WORKSHOP_FALLBACK_IMAGE } from '../data';
import { Award, CheckCircle, Video, Users, Sparkles } from 'lucide-react';

export default function AboutSection() {
  const [imageSrc, setImageSrc] = useState<string>(WORKSHOP_MAIN_IMAGE);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Image collage with statistics */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-y-8 -inset-x-4 bg-brand-light rounded-3xl -z-10 transform -rotate-2" />
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-100 aspect-[4/3] max-h-[460px]">
              <picture>
                <source
                  type="image/webp"
                  media="(max-width: 640px)"
                  srcSet="/optimized/about-workshop-3-mobile.webp"
                />
                <source
                  type="image/webp"
                  srcSet="/optimized/about-workshop-3.webp"
                />
                <img
                  src={imageSrc}
                  onError={() => {
                    if (imageSrc !== WORKSHOP_FALLBACK_IMAGE) {
                      setImageSrc(WORKSHOP_FALLBACK_IMAGE);
                    }
                  }}
                  alt="BADN Certificate Distribution Graduation Ceremony"
                  className="w-full h-full object-cover"
                  width={500}
                  height={375}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </picture>

              {/* Verified Badge overlay */}
              <div 
                className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-brand text-brand-contrast p-3.5 sm:p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-[#143a1b]/15 max-w-[280px] sm:max-w-[340px] backdrop-blur-sm transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center text-amber-700 shrink-0 font-bold text-lg">
                  ★
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <h4 className="text-xs sm:text-[13px] font-bold text-brand-contrast leading-snug">
                    এক দশকেরও বেশি দক্ষতা উন্নয়নের যাত্রা
                  </h4>
                  <p className="text-[11px] sm:text-xs text-brand-contrast/90 leading-snug mt-1">
                    ৭,০০০+ পুষ্টি পেশাজীবীর অনুপ্রেরণার প্ল্যাটফর্ম BADN।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Text introduction */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-1.5 text-brand bg-brand-light font-bold text-xs px-3 py-1 rounded-full">
              <Award className="w-4 h-4" />
              <span>আমাদের পরিচয় ও লক্ষ্য</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              BADN আপনার লক্ষ্য অর্জনে<br />
              <span className="text-[#e17100]">সর্বোচ্চ সহায়তা করে!</span>
            </h2>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              বাংলাদেশ একাডেমী অব ডায়েটেটিক্স এন্ড নিউট্রিশন (বিএডিএন) দেশে পুষ্টিবিদ ও ডায়েটেশিয়ানদের পুষ্টিসংক্রান্ত পেশাগত দক্ষতা অর্জনের সবচেয়ে বড় এবং বিশ্বস্ত প্রতিষ্ঠান। 
              প্রতিষ্ঠার পর থেকে দেশের প্রায় ৫০০০+ প্রশিক্ষণার্থী আমাদের প্রশিক্ষণ গ্রহণ করেছেন এবং দেশ-বিদেশে স্বনামধন্য কর্পোরেট হাসপাতালে সম্মান এবং আত্মবিশ্বাসের সাথে কাজ করছেন। 
              উচ্চতর শিক্ষা ও পেশাগত ক্যারিয়ার গঠনে বিএডিএন সবসময় আপনার বিশ্বস্ত সঙ্গী।
            </p>

            {/* List features with custom card styling */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              {ABOUT_FEATURES.map((item, idx) => (
                <div
                  key={item.id}
                  className="bg-[#fafdfa] hover:bg-brand-light/30 p-4 rounded-xl border border-gray-100 shadow-sm transition-all duration-300 flex items-start gap-4 hover:border-[#cbdccb]/40"
                >
                  <div className="w-10 h-10 rounded-full bg-brand text-brand-contrast flex items-center justify-center font-bold text-sm shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
