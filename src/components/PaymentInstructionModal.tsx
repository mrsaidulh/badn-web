import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, Download } from 'lucide-react';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentInstructionModal({ isOpen, onClose }: PaymentInstructionModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#cbdccb]/50 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#143a1b] text-white flex items-center justify-between gap-3 shrink-0">
              <h3 className="text-sm sm:text-base font-bold leading-snug">
                ভর্তি প্রক্রিয়া ও পেমেন্ট নির্দেশিকা (CCND)
              </h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
                aria-label="Close payment instruction"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Image Body */}
            <div className="p-2 sm:p-3 bg-gray-100 overflow-y-auto flex-1">
              <img
                src="/assets/aistudio/payment_information_893a828c.jpeg"
                alt="Certificate in Clinical Nutrition and Dietetics (CCND) ভর্তি প্রক্রিয়া ও পেমেন্ট নির্দেশিকা"
                className="w-full h-auto rounded-xl shadow-sm block mx-auto"
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-white border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <a
                href="/assets/aistudio/payment_information_893a828c.jpeg"
                download="CCND-Payment-Instruction.jpeg"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#eaf3ea] hover:bg-[#cbdccb]/60 text-[#143a1b] text-xs font-bold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ডাউনলোড করুন</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#143a1b] hover:bg-[#1d5227] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
