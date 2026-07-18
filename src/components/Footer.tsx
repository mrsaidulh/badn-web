import { Heart, MapPin, Mail, Clock, Phone, Facebook, Twitter, Globe } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-brand-light/40 text-brand-dark border-t border-brand/10">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Column 1 - Brand description */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo size="w-16 h-16 sm:w-20 sm:h-20" showText={true} theme="color" />
            </div>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal">
              আমরা BADN এ পেশাদারদের প্রশিক্ষণ, স্বাস্থ্য সমস্যায় ভোগা ব্যক্তিদের পরামর্শ দিয়ে একটি সুস্থ ও সচেতন সমাজ বিনির্মাণে এবং পুষ্টিবিদ্যার উন্নয়নে বদ্ধপরিকর।
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/badntrust"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm"
                title="Facebook Page"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brand/10 hover:bg-brand/20 text-brand-dark flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Twitter"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brand/10 hover:bg-brand/20 text-brand-dark flex items-center justify-center transition-all duration-300 hover:scale-110"
                title="Website"
              >
                <Globe className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Business Hours */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#e04f21]" />
              <span>Business Hours</span>
            </h3>
            <div className="text-xs space-y-2 text-gray-700 leading-relaxed font-normal">
              <p>
                <strong className="font-bold text-brand-dark block">Opening Day:</strong>
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
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark flex items-center gap-1.5">
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
                <a href="mailto:support@badn.org" className="hover:text-[#e04f21] transition-colors font-medium">
                  support@badn.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-[#e04f21]" />
                <a href="tel:+8801677250597" className="hover:text-[#e04f21] transition-colors font-medium">
                  +880 1677-250597
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Facebook className="w-4 h-4 shrink-0 text-[#1877F2]" />
                <a 
                  href="https://www.facebook.com/badntrust" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-[#1877F2] transition-colors font-semibold"
                >
                  facebook.com/badntrust
                </a>
              </div>
            </div>
          </div>

          {/* Column 4 - Useful Links */}
          <div className="md:col-span-2 space-y-3 text-left">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
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
      <div className="bg-brand-light py-6 text-center text-xs text-brand-dark border-t border-brand/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-medium">
            Copyright © {new Date().getFullYear()}. All rights reserved by BADN Academy.
          </span>
          <span className="text-[10px] opacity-80">
            Designed for professional clinical training and dietitian certifications.
          </span>
        </div>
      </div>

    </footer>
  );
}
