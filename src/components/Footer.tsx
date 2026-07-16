import { Heart, MapPin, Mail, Clock, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand text-white border-t border-amber-500/10">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Column 1 - Brand description */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 bg-white text-brand rounded-full flex items-center justify-center font-bold text-base shadow shrink-0">
                <Heart className="w-5 h-5 text-brand fill-brand animate-pulse" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-bold block leading-none">BADN</span>
                <span className="text-xs sm:text-sm text-brand-light font-bold uppercase tracking-wider block mt-1.5 leading-tight max-w-[260px] md:max-w-none whitespace-normal">
                  Bangladesh Academy of Dietetics and Nutrition
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-brand-light/80 leading-relaxed">
              আমরা BADN এ পেশাদারদের প্রশিক্ষণ, স্বাস্থ্য সমস্যায় ভোগা ব্যক্তিদের পরামর্শ দিয়ে একটি সুস্থ ও সচেতন সমাজ বিনির্মাণে এবং পুষ্টিবিদ্যার উন্নয়নে বদ্ধপরিকর।
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
                title="Twitter"
              >
                t
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
                title="Google"
              >
                g
              </a>
            </div>
          </div>

          {/* Column 2 - Business Hours */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>Business Hours</span>
            </h3>
            <div className="text-xs space-y-2 text-brand-light/90 leading-relaxed font-light">
              <p>
                <strong className="font-bold text-white block">Opening Day:</strong>
                Saturday - Wednesday: 11am to 8pm
              </p>
              <p>
                Thursday: 11am to 6pm
              </p>
              <p className="text-amber-300">
                Friday: Closed
              </p>
            </div>
          </div>

          {/* Column 3 - Contact Info */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Mail className="w-4 h-4" />
              <span>Contact Us</span>
            </h3>
            <div className="text-xs space-y-3 text-brand-light/90 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>
                  152/2A 2, Manama Ms Tower, 2nd Floor, Badda Link Road, Dhaka - 1212, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-amber-400" />
                <a href="mailto:info@studyhubeducation.com" className="hover:text-amber-300 transition-colors">
                  info@studyhubeducation.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-amber-400" />
                <a href="tel:+8801700000000" className="hover:text-amber-300 transition-colors">
                  +880 1700 000000 (বিকল্প)
                </a>
              </div>
            </div>
          </div>

          {/* Column 4 - Useful Links */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Useful Links
            </h3>
            <ul className="text-xs space-y-2 text-brand-light/80 font-light">
              <li>
                <a href="#home" className="hover:text-amber-300 transition-colors block">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors block">About Us</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-amber-300 transition-colors block">Services & Courses</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-300 transition-colors block">Contact Us</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom copyright footer bar */}
      <div className="bg-[#143a1b] py-6 text-center text-xs text-brand-light/60 border-t border-brand-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>
            Copyright © {new Date().getFullYear()}. All rights reserved by BADN Academy.
          </span>
          <span className="text-[10px] text-brand-light/40">
            Designed for professional clinical training and dietitian certifications.
          </span>
        </div>
      </div>

    </footer>
  );
}
