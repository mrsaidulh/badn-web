import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
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
import { HERO_IMAGE, COURSES } from './data';
import { Award, ShieldAlert, X } from 'lucide-react';
import { getCurrentTheme, applyTheme } from './lib/theme';

export default function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAdminPath, setIsAdminPath] = useState(false);

  // Check route for admin page
  useEffect(() => {
    const checkAdminPath = () => {
      const pathname = window.location.pathname.toLowerCase();
      setIsAdminPath(pathname === '/admin' || pathname === '/admin/');
    };

    checkAdminPath();

    window.addEventListener('popstate', checkAdminPath);
    return () => {
      window.removeEventListener('popstate', checkAdminPath);
    };
  }, []);

  // Load and apply the saved theme on component mount
  useEffect(() => {
    const currentTheme = getCurrentTheme();
    applyTheme(currentTheme.id);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPath) {
    return (
      <ToastProvider>
        <Helmet>
          <title>BADN Admin Dashboard - বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <InstructorDashboard
          isOpen={true}
          onClose={() => {
            window.location.href = '/';
          }}
          isFullPage={true}
        />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-[100] no-print pointer-events-none">
        <div 
          className="h-full bg-gradient-to-r from-brand to-emerald-500 transition-all duration-75 ease-out shadow-[0_1.5px_10px_rgba(27,77,36,0.35)]" 
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="min-h-screen bg-[#fafdfa] flex flex-col text-gray-900 selection:bg-brand selection:text-[#143a1b] relative">
        <Helmet>
          {(() => {
            const courseParam = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('course') : null;
            const sharedCourse = courseParam ? COURSES.find(c => c.id === courseParam) : null;
            const pageTitle = sharedCourse
              ? `${sharedCourse.title} | Bangladesh Academy of Dietetics and Nutrition - BADN`
              : 'BADN — পুষ্টিবিদ্যা ও ডায়েটেটিক্স প্রশিক্ষণে দেশের বৃহত্তম প্ল্যাটফর্ম';
            const pageDescription = sharedCourse
              ? sharedCourse.description
              : 'আধুনিক ও বিজ্ঞানভিত্তিক কারিকুলামে অভিজ্ঞ দেশি-বিদেশি চিকিৎসাবিদ ও ডায়েটেশিয়ানদের সরাসরি গাইডলাইনে গড়ে তুলুন আপনার পেশাগত দক্ষতা।';
            const shareImage = sharedCourse?.image || HERO_IMAGE;

            return (
              <>
                <title>{sharedCourse ? pageTitle : 'Bangladesh Academy of Dietetics and Nutrition - BADN'}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="BADN, Bangladesh Academy of Dietetics and Nutrition, CCND, Clinical Nutrition Course, Dietetics Course Bangladesh, Nutrition training, Dietitian certification, পুষ্টিবিদ্যা, ডায়েটেটিক্স প্রশিক্ষণ, বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন, নিউট্রিশন কোর্স" />
                <meta name="author" content="Bangladesh Academy of Dietetics and Nutrition" />
                <link rel="canonical" href="https://badn-academy.org" />

                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={shareImage} />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : 'https://badn-academy.org'} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="BADN Academy" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={shareImage} />

                <meta name="robots" content="index, follow" />
                <meta name="theme-color" content="#99C754" />
              </>
            );
          })()}
        </Helmet>
        
        {/* Dynamic top info alert bar */}
        {showNotification && (
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-[11px] sm:text-xs font-bold py-2.5 px-4 text-center relative flex items-center justify-center gap-2 shrink-0 select-none z-50 shadow-[0_2px_15px_rgba(217,119,6,0.25)] border-b border-amber-400/20">
            <motion.div
              animate={{
                rotate: [0, -12, 12, -12, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="shrink-0 flex items-center"
            >
              <Award className="w-4.5 h-4.5 text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.6)]" />
            </motion.div>
            
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-extrabold flex items-center gap-1 animate-pulse border border-red-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-ping" />
                Live
              </span>
              
              <motion.span
                animate={{
                  scale: [1, 1.04, 1],
                  color: ["#ffffff", "#fef08a", "#fde047", "#fef08a", "#ffffff"],
                  textShadow: [
                    "0 0 0px rgba(253, 224, 71, 0)",
                    "0 0 10px rgba(253, 224, 71, 0.8)",
                    "0 0 4px rgba(253, 224, 71, 0.4)",
                    "0 0 0px rgba(253, 224, 71, 0)"
                  ]
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-block origin-center tracking-wide font-extrabold text-[12px] sm:text-sm drop-shadow-sm"
              >
                Our website is under construction - সঠিক তথ্য পেতে WhatsApp +8801677250597 যোগাযোগ করুন
              </motion.span>
            </div>
            
            <button
              onClick={() => setShowNotification(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white cursor-pointer hover:scale-110 transition-transform"
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

        {/* Floating WhatsApp chat button for mobile responsive directly communicating with Admin */}
        <WhatsAppButton />

      </div>
    </ToastProvider>
  );
}

