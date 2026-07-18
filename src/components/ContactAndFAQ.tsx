import { useState, useEffect, FormEvent } from 'react';
import { FAQS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, ChevronDown, HelpCircle, PhoneCall } from 'lucide-react';
import { addInquiry } from '../lib/api';
import { useToast } from './Toast';

export default function ContactAndFAQ() {
  const { success: showSuccessToast } = useToast();
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('badn_contact_form');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved contact form data', e);
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      message: ''
    };
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq1');

  useEffect(() => {
    try {
      sessionStorage.setItem('badn_contact_form', JSON.stringify(formData));
    } catch (e) {
      console.error('Failed to write contact form data to sessionStorage', e);
    }
  }, [formData]);

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newInquiry = {
      id: 'inq_' + Date.now(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      message: formData.message,
      date: new Date().toLocaleDateString('bn-BD')
    };

    addInquiry(newInquiry);
    showSuccessToast('আপনার বার্তাটি সফলভাবে অ্যাডমিন প্যানেলে পাঠানো হয়েছে!', 'বার্তা পাঠানো হয়েছে');

    setIsSubmitted(true);
    setFormData({ firstName: '', lastName: '', email: '', message: '' });
    
    // Clear storage on successful submission
    try {
      sessionStorage.removeItem('badn_contact_form');
    } catch (e) {
      console.error('Failed to clear sessionStorage', e);
    }

    setTimeout(() => {
      setIsSubmitted(false);
      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new Event('contact_message_added'));
    }, 3000);
  };

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-white via-[#fafdfa] to-[#e2eee2]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column - Contact Form */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#cbdccb]/40 shadow-xl text-left space-y-6">
            <div>
              <span className="text-xs font-extrabold text-brand bg-brand-light px-3 py-1 rounded-full">
                যোগাযোগ ফর্ম
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2.5 leading-snug">
                যে কোনো পরামর্শের জন্য <span className="text-[#e17100]">যোগাযোগ করুন</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                নিচের ফর্মটি পূরণ করে আপনার জিজ্ঞাসা পাঠান। আমাদের প্রতিনিধি ২৪ ঘণ্টার মধ্যে যোগাযোগ করবেন।
              </p>
            </div>

            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
              >
                <div className="w-14 h-14 bg-[#e2eee2] rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-brand" />
                </div>
                <h3 className="text-lg font-bold text-brand mb-1">বার্তা সফলভাবে পাঠানো হয়েছে!</h3>
                <p className="text-xs text-gray-600 max-w-[280px]">
                  আপনার মূল্যবান পরামর্শ বা জিজ্ঞাসার জন্য ধন্যবাদ। আমরা খুব শীঘ্রই আপনার ইমেইলে উত্তর প্রদান করব।
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="bg-brand-light p-3.5 rounded-2xl flex items-center gap-2.5 text-xs text-brand font-bold border border-[#cbdccb]/30">
                  <PhoneCall className="w-4 h-4 text-brand shrink-0" />
                  <span>তথ্য দিন — সরাসরি উত্তর পেয়ে যাবেন!</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="যেমন: সাজিদুল"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="যেমন: ইসলাম"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="যেমন: query@domain.com"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Enter Your Message Here <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    placeholder="আপনার বার্তা বা প্রশ্নের বিস্তারিত এখানে লিখুন..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-xs focus:ring-1 focus:ring-brand focus:border-transparent outline-none transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand hover:bg-brand-hover text-white text-xs font-bold py-3.5 px-4 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  Send Us
                </button>
              </form>
            )}
          </div>

          {/* Right Column - FAQ Accordion */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div>
              <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mt-2.5 leading-tight">
                আপনার মনে আসা প্রশ্নের <span className="text-[#e17100]">উত্তর খুঁজে নিন!</span>
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
                আপনার সাধারণ প্রশ্নগুলোর উত্তরগুলো জেনে নিন, এর বাইরে জানার থাকলে আমাদের সাথে যোগাযোগ করতে দ্বিধা করবেন না।
              </p>
            </div>

            {/* Accordion List */}
            <div className="space-y-3.5 pt-2">
              {FAQS.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-brand-light/20 transition-all cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-brand shrink-0" />
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand shrink-0 transition-transform duration-300 ${
                        openFaqId === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* animated collapsible panel */}
                  <AnimatePresence initial={false}>
                    {openFaqId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-[#fafdfa]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
