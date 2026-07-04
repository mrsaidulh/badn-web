import { useState } from 'react';
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
import Footer from './components/Footer';
import InstructorDashboard from './components/InstructorDashboard';
import { Award, ShieldAlert, X } from 'lucide-react';

export default function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(true);

  return (
    <div className="min-h-screen bg-[#fafdfa] flex flex-col text-gray-900 selection:bg-brand selection:text-white relative">
      
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
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsDashboardOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-brand text-white font-extrabold text-xs rounded-full shadow-2xl hover:bg-brand-hover hover:scale-105 transition-all duration-300 border border-amber-500/30 cursor-pointer animate-bounce"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>এডমিন প্যানেল</span>
        </button>
      </div>

    </div>
  );
}

