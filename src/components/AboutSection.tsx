import { ABOUT_FEATURES, WORKSHOP_MAIN_IMAGE } from '../data';
import { Award, CheckCircle, Video, Users, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Image collage with statistics */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-y-8 -inset-x-4 bg-brand-light rounded-3xl -z-10 transform -rotate-2" />
            
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-square max-h-[460px]">
              <img
                src={WORKSHOP_MAIN_IMAGE}
                alt="BADN Certificate Distribution Graduation Ceremony"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />

              {/* Verified Badge overlay */}
              <div className="absolute bottom-6 right-6 bg-brand text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-500/20 max-w-[200px] backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-amber-400 shrink-0 font-bold text-lg">
                  ★
                </div>
                <div>
                  <h4 className="text-xs font-bold">১০+ বছর</h4>
                  <p className="text-[10px] text-brand-light/95 leading-tight">শিক্ষা ও গবেষণায় সেরা বিশ্বস্ত প্রতিষ্ঠান</p>
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
              <span className="text-brand">সর্বোচ্চ সহায়তা করে!</span>
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
                  <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shrink-0">
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
