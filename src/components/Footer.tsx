import { Heart, MapPin, Mail, Clock, Phone } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-[#fbfdf0] text-[#143a1b] border-t border-[#143a1b]/10">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Column 1 - Brand description */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo showText={true} theme="color" />
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              আমরা BADN এ পেশাদারদের প্রশিক্ষণ, স্বাস্থ্য সমস্যায় ভোগা ব্যক্তিদের পরামর্শ দিয়ে একটি সুস্থ ও সচেতন সমাজ বিনির্মাণে এবং পুষ্টিবিদ্যার উন্নয়নে বদ্ধপরিকর।
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#143a1b]/10 hover:bg-[#143a1b]/20 text-[#143a1b] flex items-center justify-center text-xs font-semibold transition-colors"
                title="Facebook"
              >
                f
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#143a1b]/10 hover:bg-[#143a1b]/20 text-[#143a1b] flex items-center justify-center text-xs font-semibold transition-colors"
                title="Twitter"
              >
                t
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-[#143a1b]/10 hover:bg-[#143a1b]/20 text-[#143a1b] flex items-center justify-center text-xs font-semibold transition-colors"
                title="Google"
              >
                g
              </a>
            </div>
          </div>

          {/* Column 2 - Business Hours */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#143a1b] flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#e04f21]" />
              <span>Business Hours</span>
            </h3>
            <div className="text-xs space-y-2 text-gray-700 leading-relaxed font-normal">
              <p>
                <strong className="font-bold text-[#143a1b] block">Opening Day:</strong>
                Saturday - Wednesday: 11am to 8pm
              </p>
              <p>
                Thursday: 11am to 6pm
              </p>
              <p className="text-[#e04f21] font-semibold">
                Friday: Closed
              </p>
            </div>
          </div>

          {/* Column 3 - Contact Info */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#143a1b] flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-[#e04f21]" />
              <span>Contact Us</span>
            </h3>
            <div className="text-xs space-y-3 text-gray-700 font-normal">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-[#e04f21] mt-0.5" />
                <span>
                  152/2A 2, Manama Ms Tower, 2nd Floor, Badda Link Road, Dhaka - 1212, Bangladesh
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-[#e04f21]" />
                <a href="mailto:info@studyhubeducation.com" className="hover:text-[#e04f21] transition-colors font-medium">
                  info@studyhubeducation.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#e04f21]" />
                <a href="tel:+8801700000000" className="hover:text-[#e04f21] transition-colors font-medium">
                  +880 1700 000000 (বিকল্প)
                </a>
              </div>
            </div>
          </div>

          {/* Column 4 - Useful Links */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#143a1b]">
              Useful Links
            </h3>
            <ul className="text-xs space-y-2 text-gray-700 font-normal">
              <li>
                <a href="#home" className="hover:text-[#e04f21] transition-colors block font-medium">Home</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[#e04f21] transition-colors block font-medium">About Us</a>
              </li>
              <li>
                <a href="#courses" className="hover:text-[#e04f21] transition-colors block font-medium">Services & Courses</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#e04f21] transition-colors block font-medium">Contact Us</a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom copyright footer bar */}
      <div className="bg-[#dbe6ca] py-6 text-center text-xs text-[#143a1b] border-t border-[#143a1b]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-medium">
            Copyright © {new Date().getFullYear()}. All rights reserved by BADN Academy.
          </span>
          <span className="text-[10px] text-[#143a1b]/80">
            Designed for professional clinical training and dietitian certifications.
          </span>
        </div>
      </div>

    </footer>
  );
}
