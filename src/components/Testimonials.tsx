import { useState, useEffect } from 'react';
import { TESTIMONIALS as STATIC_TESTIMONIALS } from '../data';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { getTestimonials } from '../lib/api';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>(STATIC_TESTIMONIALS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadTestimonials = () => {
      getTestimonials().then((data) => {
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      });
    };
    loadTestimonials();

    window.addEventListener('testimonials_updated', loadTestimonials);
    return () => {
      window.removeEventListener('testimonials_updated', loadTestimonials);
    };
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!testimonials || testimonials.length === 0) return null;

  // Ensure current index is within bounds (e.g. if items list gets smaller)
  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-6 left-6 text-[#cbdccb]/30 select-none pointer-events-none -z-10">
          <Quote className="w-40 h-40 transform rotate-180" />
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 relative z-10">
          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            সফল ট্রেইনিদের রিভিউসমূহ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            প্রশিক্ষণার্থীদের <span className="text-brand">অভিজ্ঞতার কথা!</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            BADN এর প্রশিক্ষণ আমাদের প্রশিক্ষণার্থীদের দক্ষতা ও ক্যারিয়ার গড়তে কীভাবে সাহায্য করেছে, সে বিষয়ে তাদের বাস্তব অভিজ্ঞতা ও মতামত
          </p>
        </div>

        {/* Desktop grid layout for reviews & interactive slider */}
        <div className="relative max-w-4xl mx-auto z-10">
          
          {/* Main testimonial card */}
          <div className="bg-gradient-to-br from-[#fafdfa] to-white p-8 sm:p-10 rounded-3xl border border-[#cbdccb]/40 shadow-xl relative min-h-[300px] flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Star Rating & Quote Badge */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(Number(currentTestimonial.rating || 5))].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-500" />
                  ))}
                </div>
                <span className="text-brand/10">
                  <Quote className="w-12 h-12" />
                </span>
              </div>

              {/* Message quote */}
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-medium italic text-justify">
                " {currentTestimonial.feedback} "
              </p>
            </div>

            {/* Student metadata */}
            <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-6 shrink-0">
              <img
                src={currentTestimonial.image}
                alt={currentTestimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-brand shadow-md"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
              <div className="text-left">
                <h4 className="text-base font-extrabold text-gray-900 leading-tight">
                  {currentTestimonial.name}
                </h4>
                <p className="text-xs text-brand font-semibold mt-0.5">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>

          </div>

          {/* Navigation sliders */}
          <div className="flex items-center justify-between mt-8 max-w-xs mx-auto">
            <button
              onClick={handlePrev}
              className="w-11 h-11 bg-white hover:bg-brand hover:text-white text-brand rounded-full border border-[#cbdccb]/40 flex items-center justify-center shadow-md transition-all cursor-pointer"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Bullet indicators */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-brand' : 'w-2.5 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-11 h-11 bg-white hover:bg-brand hover:text-white text-brand rounded-full border border-[#cbdccb]/40 flex items-center justify-center shadow-md transition-all cursor-pointer"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
