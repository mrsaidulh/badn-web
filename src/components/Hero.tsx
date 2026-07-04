import { HERO_IMAGE } from '../data';
import { Award, Users, BookOpen, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-[#fafdfa] via-[#f3f9f3] to-[#e6f2e6] pt-12 pb-20 overflow-hidden">
      {/* Dynamic decorative backdrop circles */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-brand-light/40 rounded-full blur-3xl -z-10" 
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.2 }}
        className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl -z-10" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column Text details */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 bg-brand/10 text-brand font-bold px-3.5 py-1.5 rounded-full text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand animate-spin" />
              <span>৮০ এর অধিক সফল ব্যাচ সম্পন্ন</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#111827] leading-tight tracking-tight"
            >
              <span className="text-brand block mb-1">পুষ্টিবিদ্যা এবং ডায়েটেটিক্স</span>
              বিষয়ে প্রশিক্ষণ ও ক্যারিয়ার গঠনে দেশের সবচাইতে বড় প্ল্যাটফর্ম!
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl"
            >
              ডায়েটিশিয়ান ও পুষ্টিবিদদের দেশসেরা প্ল্যাটফর্ম থেকে প্রশিক্ষণ নিয়ে আপনিও হয়ে উঠুন সেরাদের একজন। 
              আধুনিক ও বিজ্ঞানভিত্তিক কারিকুলামে অভিজ্ঞ দেশি-বিদেশি চিকিৎসাবিদ ও ডায়েটেশিয়ানদের সরাসরি গাইডলাইনে গড়ে তুলুন আপনার আত্মবিশ্বাসী পেশাগত দক্ষতা।
            </motion.p>

            {/* CTA button */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#courses"
                className="inline-flex items-center justify-center bg-brand hover:bg-brand-hover text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                প্রশিক্ষণ নিন
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#about"
                className="inline-flex items-center justify-center border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-sm font-semibold px-6 py-3.5 rounded-xl transition-all duration-300 cursor-pointer"
              >
                বিস্তারিত জানুন
              </motion.a>
            </motion.div>

            {/* Stats list from screenshot */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200/60"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-gray-200/50"
              >
                <div className="text-2xl font-extrabold text-brand flex items-center gap-1">
                  <span>৫০০০+</span>
                </div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">ট্রেইনি গ্র্যাজুয়েট</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.48, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-gray-200/50"
              >
                <div className="text-2xl font-extrabold text-amber-600">৯০%</div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">সাকসেস রেট</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.56, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-gray-200/50"
              >
                <div className="text-2xl font-extrabold text-brand">৪০+</div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">পেশাদার কোর্স</div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.64, ease: "easeOut" }}
                className="bg-white/70 backdrop-blur-sm p-3.5 rounded-xl border border-gray-200/50"
              >
                <div className="text-2xl font-extrabold text-amber-600">৮০+</div>
                <div className="text-xs text-gray-500 font-semibold mt-0.5">সফল ব্যাচ</div>
              </motion.div>
            </motion.div>

          </div>

          {/* Right Column Custom generated banner frame */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              initial={{ opacity: 0, rotate: 0 }}
              animate={{ opacity: 1, rotate: 3 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="absolute inset-0 bg-brand/5 rounded-2xl transform rotate-3 -z-10" 
            />
            
            <motion.div 
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <img
                src={HERO_IMAGE}
                alt="Bangladesh Academy of Dietetics and Nutrition Clinical Training"
                className="w-full h-auto object-cover max-h-[420px]"
                referrerPolicy="no-referrer"
              />
              
              {/* Badge overlay on top of banner */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
                className="absolute top-4 right-4 bg-brand text-white text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full shadow-md border border-amber-500/20"
              >
                Government Registered
              </motion.div>

              {/* Float Card for Interactive Feeling */}
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3.5 rounded-xl shadow-lg border border-[#cbdccb]/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-xs shadow">
                    ★
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 leading-tight">দেশসেরা অভিজ্ঞ মেন্টরস</h4>
                    <p className="text-[10px] text-gray-500">লাইভ সেশন ও কেস ভিত্তিক সমাধান</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-brand font-bold px-2 py-0.5 rounded-full">
                  সিসিএনডি
                </span>
              </motion.div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
