import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import PromoBanner from './components/PromoBanner';
import AboutSection from './components/AboutSection';
import CoursesSection from './components/CoursesSection';
import WhyChooseUs from './components/WhyChooseUs';
import Testimonials from './components/Testimonials';
import SeminarsSection from './components/SeminarsSection';
import ContactAndFAQ from './components/ContactAndFAQ';
import CertificateVerification from './components/CertificateVerification';
import Footer from './components/Footer';
import InstructorDashboard from './components/InstructorDashboard';
import WhatsAppButton from './components/WhatsAppButton';
import { ToastProvider } from './components/Toast';
import { HERO_IMAGE } from './data';
import { Award, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#fafdfa] flex flex-col text-gray-900 selection:bg-brand selection:text-white relative">
        <Helmet>
          {/* Document Title */}
          <title>Bangladesh Academy of Dietetics and Nutrition - BADN</title>

          {/* Standard SEO Tags */}
          <meta name="description" content="বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন (BADN) - পুষ্টিবিদ্যা এবং ডায়েটেটিক্স বিষয়ে প্রফেশনাল প্রশিক্ষণ ও ক্লিনিক্যাল ক্যারিয়ার গঠনে দেশের সবচাইতে বড় প্ল্যাটফর্ম। CCND সার্টিফিকেট কোর্স ও বিশেষজ্ঞ গাইডলাইনে গড়ে তুলুন আপনার পেশাগত দক্ষতা।" />
          <meta name="keywords" content="BADN, Bangladesh Academy of Dietetics and Nutrition, CCND, Clinical Nutrition Course, Dietetics Course Bangladesh, Nutrition training, Dietitian certification, পুষ্টিবিদ্যা, ডায়েটেটিক্স প্রশিক্ষণ, বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন, নিউট্রিশন কোর্স" />
          <meta name="author" content="Bangladesh Academy of Dietetics and Nutrition" />
          <link rel="canonical" href="https://badn-academy.org" />

          {/* OpenGraph (Facebook, LinkedIn, etc.) Tags */}
          <meta property="og:title" content="Bangladesh Academy of Dietetics and Nutrition - BADN" />
          <meta property="og:description" content="পুষ্টিবিদ্যা এবং ডায়েটেটিক্স বিষয়ে প্রশিক্ষণ ও ক্যারিয়ার গঠনে দেশের সবচাইতে বড় প্ল্যাটফর্ম! ৮০ এর অধিক সফল ব্যাচ সম্পন্ন এবং ৫০০০+ গ্র্যাজুয়েট।" />
          <meta property="og:image" content={HERO_IMAGE} />
          <meta property="og:url" content="https://badn-academy.org" />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="BADN Academy" />

          {/* Twitter Card Tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Bangladesh Academy of Dietetics and Nutrition - BADN" />
          <meta name="twitter:description" content="পুষ্টিবিদ্যা এবং ডায়েটেটিক্স বিষয়ে প্রশিক্ষণ ও ক্যারিয়ার গঠনে দেশের সবচাইতে বড় প্ল্যাটফর্ম! অভিজ্ঞ দেশি-বিদেশি চিকিৎসাবিদ ও ডায়েটেশিয়ানদের সরাসরি গাইডলাইন।" />
          <meta name="twitter:image" content={HERO_IMAGE} />

          {/* Additional Useful Meta Tags */}
          <meta name="robots" content="index, follow" />
          <meta name="theme-color" content="#1b4d24" />
        </Helmet>
        
        {/* Dynamic top info alert bar */}
        {showNotification && (
          <div className="bg-amber-600 text-white text-[11px] sm:text-xs font-bold py-2.5 px-4 text-center relative flex items-center justify-center gap-1.5 shrink-0 select-none z-50">
            <Award className="w-4 h-4 text-amber-300 shrink-0" />
            <span>নতুন সেশনের ভর্তি চলছে! ১৫ই জুলাই এর পূর্বে ভর্তি হলে পাবেন বিশেষ ২০% ফ্ল্যাট ডিসকাউন্ট!</span>
            <button
              onClick={() => setShowNotification(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header section */}
        <Header onOpenDashboard={() => setIsDashboardOpen(true)} />

        {/* Main sections */}
        <main className="flex-1">
          <Hero />
          <FeatureGrid />
          <PromoBanner />
          <AboutSection />
          <CoursesSection />
          <WhyChooseUs />
          <Testimonials />
          <SeminarsSection />
          <CertificateVerification />
          <ContactAndFAQ />
        </main>

        {/* Footer section */}
        <Footer />

        {/* Interactive Instructor Dashboard Panel */}
        <InstructorDashboard
          isOpen={isDashboardOpen}
          onClose={() => setIsDashboardOpen(false)}
        />

        {/* Floating Action Button to quickly open Instructor Panel for verification */}
        <div className="fixed bottom-6 left-6 z-30 no-print">
          <button
            onClick={() => setIsDashboardOpen(true)}
            className="flex items-center gap-2 px-4 py-3 bg-brand text-white font-extrabold text-xs rounded-full shadow-2xl hover:bg-brand-hover hover:scale-105 transition-all duration-300 border border-amber-500/30 cursor-pointer animate-bounce"
          >
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>এডমিন প্যানেল</span>
          </button>
        </div>

        {/* Floating WhatsApp chat button for mobile responsive directly communicating with Admin */}
        <WhatsAppButton />

      </div>
    </ToastProvider>
  );
}

