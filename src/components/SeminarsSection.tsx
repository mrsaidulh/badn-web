import { useState, useEffect } from 'react';
import { Seminar } from '../types';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import SeminarModal from './SeminarModal';
import { getSeminarEvents } from '../lib/api';

export default function SeminarsSection() {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <section id="seminars" className="py-20 bg-gradient-to-b from-[#fafdfa] to-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full">
            আমাদের সেমিনার ও ওয়ার্কশপসমূহ
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            পুষ্টি বিষয়ক জ্ঞান অর্জনে আয়োজিত <span className="text-[#e17100]">কিছু সেমিনার</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            BADN নিয়মিত বিভিন্ন পুষ্টি বিষয়ক সেমিনার আয়োজন করে থাকে। এই সেমিনারগুলোতে দেশি-বিদেশী বিশেষজ্ঞরা বিভিন্ন জটিল স্বাস্থ্য সমস্যা, প্রতিরোধ বা উত্তরণে নতুন নতুন বিজ্ঞানভিত্তিক তথ্য আলোচনা করে থাকেন।
          </p>
        </div>

        {/* Seminars Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {seminars.map((seminar) => (
            <div
              key={seminar.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Seminar Image overlay */}
              <div className="relative h-48 sm:h-54 overflow-hidden shrink-0 bg-gray-100">
                <picture>
                  {seminar.id === 's1' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/seminar-6-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/seminar-6.webp" />
                    </>
                  ) : seminar.id === 's2' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/seminar-inter-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/seminar-inter.webp" />
                    </>
                  ) : (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/seminar-5-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/seminar-5.webp" />
                    </>
                  )}
                  <img
                    src={
                      seminar.id === 's1'
                        ? 'https://i.ibb.co.com/B25ChBhp/6.jpg'
                        : seminar.id === 's2'
                        ? 'https://i.ibb.co.com/gFhP2QLp/Seminar-inter.png'
                        : seminar.image
                    }
                    onError={(e) => {
                      if (seminar.id === 's1') {
                        (e.target as HTMLImageElement).src = '/seminar-user-6.jpg';
                      } else if (seminar.id === 's2') {
                        (e.target as HTMLImageElement).src = '/seminar-user-inter.png';
                      }
                    }}
                    alt={seminar.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                    width={400}
                    height={216}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-4 left-4 bg-brand text-brand-contrast font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
                  {seminar.organization ? seminar.organization.split(' ')[0] : 'BADN'}
                </span>
              </div>

              {/* Seminar Card Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-4 h-4 text-brand shrink-0" />
                    <span>{seminar.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-brand transition-colors line-clamp-2">
                    {seminar.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {seminar.description}
                  </p>
                </div>

                {/* Footer details of card */}
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                    <span>{seminar.location ? seminar.location.split(' ')[0] : 'Dhaka'}</span>
                  </span>

                  <button
                    onClick={() => handleReadMoreClick(seminar)}
                    className="text-xs font-bold text-brand hover:text-amber-600 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
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
