import { useState, useEffect, useRef } from 'react';
import { Seminar } from '../types';
import { Calendar, MapPin, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import SeminarModal from './SeminarModal';
import { getSeminarEvents } from '../lib/api';

const getSeminarImage = (s: Seminar) => {
  if (s.id === 's1') return 'https://i.ibb.co.com/v62LhVDm/Critical-Care-International-Seminar.jpg';
  if (s.id === 's2') return 'https://i.ibb.co.com/FLN94kyk/gynomix-and-nutrigenix.jpg';
  if (s.id === 's3') return 'https://i.ibb.co.com/qYVdj7pr/Sports-Nutritions.jpg';
  if (s.id === 's4') return s.image || '/seminar-user-5.jpg';
  if (s.id === 's5') return s.image || '/seminar-user-6.jpg';
  if (s.id === 's6') return s.image || '/first-main.jpg';
  return s.image || '/seminar-user-5.jpg';
};

const getSeminarFallback = (id: string) => {
  if (id === 's1') return 'https://i.ibb.co.com/v62LhVDm/Critical-Care-International-Seminar.jpg';
  if (id === 's2') return 'https://i.ibb.co.com/FLN94kyk/gynomix-and-nutrigenix.jpg';
  if (id === 's3') return 'https://i.ibb.co.com/qYVdj7pr/Sports-Nutritions.jpg';
  if (id === 's4') return '/seminar-user-5.jpg';
  if (id === 's5') return '/seminar-user-6.jpg';
  if (id === 's6') return '/first-main.jpg';
  return '/seminar-user-5.jpg';
};

export default function SeminarsSection() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadSeminars = () => {
      getSeminarEvents().then((data) => {
        setSeminars(Array.isArray(data) ? data : []);
      });
    };
    loadSeminars();

    window.addEventListener('seminars_updated', loadSeminars);
    return () => {
      window.removeEventListener('seminars_updated', loadSeminars);
    };
  }, []);

  const handleReadMoreClick = (seminar: Seminar) => {
    setSelectedSeminar(seminar);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    const card = sliderRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.clientWidth + 24 : 360;

    if (scrollLeft + clientWidth >= scrollWidth - 25) {
      sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth } = sliderRef.current;
    const card = sliderRef.current.firstElementChild as HTMLElement;
    const scrollAmount = card ? card.clientWidth + 24 : 360;

    if (scrollLeft <= 25) {
      sliderRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
    } else {
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToIndex = (idx: number) => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.firstElementChild as HTMLElement;
    if (card) {
      const scrollAmount = (card.clientWidth + 24) * idx;
      sliderRef.current.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Continuous right-to-left sliding effect
  useEffect(() => {
    if (isHovered || isModalOpen || seminars.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 3800);
    return () => clearInterval(interval);
  }, [isHovered, isModalOpen, seminars.length]);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.firstElementChild as HTMLElement;
    if (card) {
      const cardWidth = card.clientWidth + 24;
      const idx = Math.round(sliderRef.current.scrollLeft / cardWidth);
      setActiveIndex(Math.min(Math.max(idx, 0), seminars.length - 1));
    }
  };

  return (
    <section id="seminars" className="py-20 bg-gradient-to-b from-[#fafdfa] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Child 1: Section Header with navigation arrows */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-3 text-left">
            <span className="inline-block text-xs font-extrabold text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full">
              আমাদের সেমিনার ও ওয়ার্কশপসমূহ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              পুষ্টি বিষয়ক জ্ঞান অর্জনে আয়োজিত <span className="text-[#e17100]">কিছু সেমিনার</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              BADN নিয়মিত বিভিন্ন পুষ্টি বিষয়ক সেমিনার আয়োজন করে থাকে। এই সেমিনারগুলোতে দেশি-বিদেশী বিশেষজ্ঞরা বিভিন্ন জটিল স্বাস্থ্য সমস্যা, প্রতিরোধ বা উত্তরণে নতুন নতুন বিজ্ঞানভিত্তিক তথ্য আলোচনা করে থাকেন।
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <span className="text-xs text-gray-500 hidden sm:inline-block font-medium">
              স্ক্রল করতে বোতাম চাপুন
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                type="button"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#143a1b] text-gray-700 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                title="পূর্ববর্তী সেমিনার"
                aria-label="Previous Seminar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                type="button"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white hover:bg-[#143a1b] text-gray-700 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer active:scale-95"
                title="পরবর্তী সেমিনার"
                aria-label="Next Seminar"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Child 2: Seminars Slider layout (Matches CSS selector) */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Floating Side Left Arrow (visible on desktop) */}
          <button
            onClick={handlePrev}
            type="button"
            className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#143a1b] text-gray-800 hover:text-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Slide Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Floating Side Right Arrow (visible on desktop) */}
          <button
            onClick={handleNext}
            type="button"
            className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/95 hover:bg-[#143a1b] text-gray-800 hover:text-white shadow-lg border border-gray-100 items-center justify-center transition-all duration-200 hover:scale-110 cursor-pointer opacity-0 group-hover:opacity-100"
            aria-label="Slide Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Scrollable Track */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 pt-2 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {seminars.map((seminar) => (
              <div
                key={seminar.id}
                className="w-[86vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group/card"
              >
                {/* Seminar Image overlay */}
                <div className="relative h-48 sm:h-54 overflow-hidden shrink-0 bg-gray-100">
                  <img
                    src={getSeminarImage(seminar)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getSeminarFallback(seminar.id);
                    }}
                    alt={seminar.title}
                    className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-all duration-500"
                    width={400}
                    height={216}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-4 left-4 bg-[#143a1b] text-white font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-md shadow-sm">
                    {seminar.organization ? seminar.organization.split(' ')[0] : 'BADN'}
                  </span>
                </div>

                {/* Seminar Card Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                      <Calendar className="w-4 h-4 text-[#143a1b] shrink-0" />
                      <span>{seminar.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 leading-snug group-hover/card:text-[#143a1b] transition-colors line-clamp-2 min-h-[44px]">
                      {seminar.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                      {seminar.description}
                    </p>
                  </div>

                  {/* Footer details of card */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                      <span className="truncate max-w-[140px]">{seminar.location ? seminar.location.split(' ')[0] : 'Dhaka'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleReadMoreClick(seminar)}
                      className="text-xs font-bold text-[#143a1b] hover:text-[#e04f21] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* Pagination Indicators / Dots */}
          {seminars.length > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2 pb-1">
              {seminars.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    activeIndex === idx
                      ? 'w-7 bg-[#143a1b]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Seminar details & booking modal */}
      <SeminarModal
        seminar={selectedSeminar}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
