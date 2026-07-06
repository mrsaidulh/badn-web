import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Award, CheckCircle2, XCircle, ShieldCheck, Loader2, Printer, ExternalLink } from 'lucide-react';
import { getCertificateById } from '../lib/api';

export default function CertificateVerification() {
  const [certId, setCertId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [certificate, setCertificate] = useState<any | null>(null);

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!certId.trim()) return;
    setLoading(true);
    setSearched(false);
    
    // Simulate a brief premium loading animation for authenticity
    setTimeout(async () => {
      try {
        const result = await getCertificateById(certId.trim());
        setCertificate(result);
      } catch (error) {
        console.error('Verification error:', error);
        setCertificate(null);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 800);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="verify-certificate" className="py-20 bg-gradient-to-b from-[#f4fbf4] via-[#fafdfa] to-white border-t border-[#cbdccb]/20 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-brand/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-brand text-xs font-bold mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-brand" />
            <span>নিরাপদ ও ডিজিটাল ভেরিফিকেশন সিস্টেম</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Certificate Verification
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-3 font-medium">
            যেকোনো শিক্ষার্থী বা নিয়োগকারী কর্তৃপক্ষ সার্টিফিকেট আইডি ব্যবহার করে আমাদের ডেটাবেজ থেকে মূল সার্টিফিকেট যাচাই করে নিতে পারেন।
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-2xl border border-[#cbdccb]/45 shadow-xl p-6 sm:p-8 max-w-2xl mx-auto mb-10 transition-all hover:shadow-2xl">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="verify-input" className="block text-xs sm:text-sm font-extrabold text-gray-700">
                সার্টিফিকেট আইডি নম্বরটি লিখুন:
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  id="verify-input"
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="যেমন: BADN-2026-1001"
                  className="block w-full pl-11 pr-32 py-3.5 sm:py-4 text-sm sm:text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent font-mono uppercase tracking-wider text-gray-800 bg-gray-50/50"
                  required
                />
                <div className="absolute inset-y-1 right-1 flex items-center">
                  <button
                    type="submit"
                    disabled={loading || !certId.trim()}
                    className="h-full px-5 sm:px-6 bg-brand hover:bg-brand-hover text-white rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>যাচাই করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Quick tips */}
          <div className="mt-4 flex items-start gap-2.5 text-xs text-gray-500 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100/30">
            <span className="text-brand font-bold">টেস্ট আইডি:</span>
            <div className="flex flex-wrap gap-2">
              <button 
                type="button" 
                onClick={() => setCertId('BADN-2026-1001')} 
                className="font-mono text-brand font-bold hover:underline cursor-pointer bg-brand/5 px-2 py-0.5 rounded"
              >
                BADN-2026-1001
              </button>
              <button 
                type="button" 
                onClick={() => setCertId('BADN-2026-1002')} 
                className="font-mono text-brand font-bold hover:underline cursor-pointer bg-brand/5 px-2 py-0.5 rounded"
              >
                BADN-2026-1002
              </button>
            </div>
          </div>
        </div>

        {/* Results Container with Smooth Animations */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="mt-6"
            >
              {certificate ? (
                /* Verified Success State */
                <div className="space-y-6">
                  {/* Verification Banner */}
                  <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3.5 text-center sm:text-left">
                      <div className="w-12 h-12 bg-emerald-100 text-brand rounded-full flex items-center justify-center shadow-inner">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-emerald-900 font-extrabold text-base sm:text-lg">সার্টিফিকেটটি বৈধ ও নিবন্ধিত!</h4>
                        <p className="text-xs sm:text-sm text-emerald-700/90 font-medium">
                          বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন দ্বারা এই রেকর্ডটি ভেরিফাইড করা হয়েছে।
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handlePrint}
                      type="button"
                      className="px-4 py-2.5 bg-brand hover:bg-brand-hover text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Printer className="w-4 h-4" />
                      <span>প্রিন্ট করুন</span>
                    </button>
                  </div>

                  {/* High-Fidelity Visual Certificate Copy */}
                  <div id="verified-certificate" className="bg-white border-8 border-double border-emerald-800 rounded-2xl shadow-2xl p-4 sm:p-10 relative overflow-hidden bg-[radial-gradient(#fbfdfb_1.5px,transparent_1.5px)] [background-size:16px_16px]">
                    {/* Corner Ornaments */}
                    <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-600" />
                    <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-600" />
                    <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-600" />
                    <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-600" />

                    {/* Watermark Logo */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                      <Award className="w-96 h-96 text-emerald-900" />
                    </div>

                    {/* Certificate Contents */}
                    <div className="relative z-10 text-center space-y-4 sm:space-y-6">
                      
                      {/* Brand Title */}
                      <div className="space-y-1.5">
                        <h3 className="text-xl sm:text-3xl font-black text-emerald-900 tracking-tight">BANGLADESH ACADEMY OF DIETETICS & NUTRITION</h3>
                        <p className="text-xs sm:text-sm font-extrabold text-amber-600 uppercase tracking-widest block">BADN Academy Certification Board</p>
                        <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2" />
                      </div>

                      {/* Header Label */}
                      <div className="py-2">
                        <span className="px-5 py-1.5 bg-amber-500 text-white rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-widest shadow-sm">
                          Academic Certificate
                        </span>
                      </div>

                      {/* Statement text */}
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm font-semibold text-gray-500 italic">This is to certify that</p>
                        <h4 className="text-xl sm:text-3xl font-black text-gray-800 tracking-tight py-1 font-serif">
                          {certificate.studentName}
                        </h4>
                        <p className="text-xs sm:text-sm font-medium text-gray-500 max-w-lg mx-auto leading-relaxed px-4">
                          has successfully completed the professional curriculum and passed the examination for the specialized program of
                        </p>
                      </div>

                      {/* Course Title */}
                      <div className="py-2.5 sm:py-4 px-4 bg-emerald-50/60 rounded-xl border border-emerald-100 max-w-xl mx-auto">
                        <span className="text-sm sm:text-lg font-extrabold text-brand block leading-snug">
                          {certificate.courseTitle}
                        </span>
                      </div>

                      {/* Certificate ID & Issue Date Metadata */}
                      <div className="grid grid-cols-3 items-center text-[10px] sm:text-xs font-mono text-gray-500 max-w-lg mx-auto py-2.5 border-t border-b border-gray-100">
                        <div className="text-left pl-2">
                          ID No: <span className="font-extrabold text-gray-700 block sm:inline">{certificate.id}</span>
                        </div>
                        
                        <div className="flex flex-col items-center justify-center gap-1">
                          <svg width="28" height="28" viewBox="0 0 29 29" fill="none" className="text-emerald-800">
                            <path d="M1 1h7v7H1V1zm1 1h5v5H2V2zm1 1h3v3H3V3zm17-2h7v7h-7V1zm1 1h5v5h-5V2zm1 1h3v3h-3V3zM1 17h7v7H1v-7zm1 1h5v5H2v-5zm1 1h3v3H3v-3z" fill="currentColor" />
                            <path d="M10 2h1v1h-1V2zm3 0h2v1h-2V2zm4 0h1v1h-1V2zm-7 2h1v1h-1V4zm2 0h1v2h-1V4zm4 0h1v1h-1V4zm-6 3h1v1h-1V7zm3 0h1v1h-1V7zm2 0h1v1h-1V7zm-5 4h1v1h-1v-1zm4 0h2v1h-2v-1zm5 0h1v1h-1v-1zm-9 2h1v2h-1v-2zm3 0h1v1h-1v-1zm4 0h1v1h-1v-1zm2 0h1v1h-1v-1zm-9 3h2v1h-2v-1zm4 0h1v2h-1v-2zm3 0h1v1h-1v-1zm-7 3h1v1h-1v-1zm3 0h2v1h-2v-1zm4 0h1v1h-1v-1zm-7 2h1v1h-1v-1zm4 0h1v1h-1v-1zm3 0h2v1h-2v-1z" fill="currentColor" />
                          </svg>
                          <span className="text-[7px] font-extrabold text-emerald-800 uppercase tracking-tighter">VERIFIED</span>
                        </div>

                        <div className="text-right pr-2">
                          Issue Date: <span className="font-extrabold text-gray-700 block sm:inline">{certificate.issueDate}</span>
                        </div>
                      </div>

                      {/* Signatures and Seals */}
                      <div className="grid grid-cols-2 pt-6 sm:pt-8 max-w-md mx-auto items-end gap-4 text-[10px] sm:text-xs text-gray-500 font-semibold">
                        <div className="text-center space-y-1">
                          <div className="w-24 sm:w-28 h-0.5 bg-gray-300 mx-auto" />
                          <p className="text-gray-800 font-bold">Sajeda Kashem Jyoti</p>
                          <p className="text-[9px] text-gray-400">Chief Instructor, BADN</p>
                        </div>
                        <div className="text-center space-y-1">
                          <div className="w-24 sm:w-28 h-0.5 bg-gray-300 mx-auto" />
                          <p className="text-gray-800 font-bold">Prof. Dr. M. Rahman</p>
                          <p className="text-[9px] text-gray-400">Executive President, BADN</p>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              ) : (
                /* Verification Failure State */
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto shadow-sm">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3.5 shadow-inner">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-red-900 font-extrabold text-lg">সার্টিফিকেটটি খুঁজে পাওয়া যায়নি!</h4>
                  <p className="text-sm text-red-700/90 font-medium mt-1 leading-relaxed">
                    আপনার ইনপুটকৃত আইডি নম্বর <span className="font-mono font-bold bg-red-100/50 px-2 py-0.5 rounded text-red-800">"{certId}"</span> সঠিক নয় অথবা আমাদের ডাটাবেজে তালিকাভুক্ত নেই। অনুগ্রহ করে আইডিটি পুনরায় পরীক্ষা করুন।
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
