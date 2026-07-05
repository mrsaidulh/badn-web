import { useState } from 'react';
import { SEMINARS } from '../data';
import { Seminar } from '../types';
import { Calendar, MapPin, ArrowUpRight } from 'lucide-react';
import SeminarModal from './SeminarModal';

export default function SeminarsSection() {
  const [selectedSeminar, setSelectedSeminar] = useState<Seminar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
            পুষ্টি বিষয়ক জ্ঞান অর্জনে আয়োজিত <span className="text-brand">কিছু সেমিনার</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            BADN নিয়মিত বিভিন্ন পুষ্টি বিষয়ক সেমিনার আয়োজন করে থাকে। এই সেমিনারগুলোতে দেশি-বিদেশী বিশেষজ্ঞরা বিভিন্ন জটিল স্বাস্থ্য সমস্যা, প্রতিরোধ বা উত্তরণে নতুন নতুন বিজ্ঞানভিত্তিক তথ্য আলোচনা করে থাকেন।
          </p>
        </div>

        {/* Seminars Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SEMINARS.map((seminar) => (
            <div
              key={seminar.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 group"
            >
              {/* Seminar Image overlay */}
              <div className="relative h-44 sm:h-48 overflow-hidden shrink-0">
                <img
                  src={seminar.image}
                  alt={seminar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-4 left-4 bg-brand text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded">
                  {seminar.organization.split(' ')[0]}
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
                    <span>{seminar.location.split(' ')[0]}</span>
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
