import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useToast } from './Toast';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const { info: showInfoToast } = useToast();

  useEffect(() => {
    // Show the tooltip after a 2-second delay to catch user attention elegantly
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = '8801700000000'; // Admin WhatsApp Number
  const message = 'আসসালামু আলাইকুম, BADN একাডেমির কোর্সসমূহ এবং ভর্তি প্রক্রিয়া সম্পর্কে জানতে চাই।';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  const handleWhatsAppClick = () => {
    showInfoToast('হোয়াটসঅ্যাপ চ্যাট ওপেন হচ্ছে... আমাদের প্রতিনিধি শীঘ্রই যোগাযোগ করবেন!', 'হোয়াটসঅ্যাপ চ্যাট');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end font-sans no-print">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10, x: 10 }}
            className="mb-3 bg-white text-gray-800 p-3.5 rounded-2xl shadow-2xl border border-[#cbdccb]/40 text-xs font-bold w-72 max-w-[280px] relative flex items-start gap-2.5 text-left"
          >
            <div className="flex-1">
              <span className="text-[11px] text-emerald-600 block mb-0.5 font-bold">
                সরাসরি যোগাযোগ
              </span>
              <p className="text-gray-700 leading-relaxed font-semibold">
                কোর্সের বিবরণ ও ভর্তির তথ্যের জন্য সরাসরি হোয়াটসঅ্যাপে চ্যাট করুন!
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {/* Small speech bubble arrow */}
            <div className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-l border-b border-[#cbdccb]/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Green WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-14 h-14 text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] hover:shadow-[0_8px_40px_rgba(37,211,102,0.6)] transition-all duration-300 group cursor-pointer"
        style={{ backgroundColor: '#25D366' }}
        aria-label="Chat with BADN administration on WhatsApp"
      >
        {/* Double animated rings for realistic pulse */}
        <span 
          className="absolute inset-0 rounded-full opacity-30 animate-ping group-hover:animate-none scale-105" 
          style={{ backgroundColor: '#25D366' }}
        />
        
        {/* Core Icon SVG */}
        <svg
          className="w-7 h-7 fill-current z-10 filter drop-shadow-sm transition-transform duration-300 group-hover:rotate-6"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.031 2C6.49 2 2 6.48 2 12.01c0 1.91.53 3.69 1.45 5.23L2 22l4.91-1.39c1.47.81 3.15 1.28 4.93 1.28 5.54 0 10.03-4.48 10.03-10.01C21.87 6.48 17.38 2 12.031 2zm6.27 13.91c-.26.74-1.5 1.34-2.07 1.4-1.21.13-2.73-.24-4.88-1.14-3.18-1.33-5.26-4.52-5.42-4.73-.16-.21-1.31-1.74-1.31-3.32 0-1.58.82-2.35 1.12-2.67.26-.26.68-.38 1.05-.38.12 0 .23.01.32.01.27.01.41.02.59.44.23.55.77 1.88.84 2.03.07.15.11.33.01.53-.1.2-.21.32-.38.53-.18.2-.38.45-.54.6-.18.17-.37.36-.16.72.21.36.93 1.54 2 2.49 1.38 1.23 2.54 1.62 2.9 1.8.36.18.57.15.79-.08.21-.24.9-1.05 1.14-1.41.24-.36.48-.3.8-.18.33.12 2.09 1.02 2.44 1.2.36.18.59.27.68.42.09.15.09.87-.17 1.61z" />
        </svg>

        {/* Small "Online" badge */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white z-20 flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
        </span>
      </motion.a>
    </div>
  );
}
