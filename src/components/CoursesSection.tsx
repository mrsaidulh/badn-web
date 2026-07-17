import { useState } from 'react';
import { COURSES } from '../data';
import { Course } from '../types';
import { Clock, BookOpen, Award, Users, Star, ArrowRight, Flame } from 'lucide-react';
import EnrollModal from './EnrollModal';

export default function CoursesSection() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Clinical Nutrition', 'Sports Nutrition', 'Child Nutrition'];

  const filteredCourses = activeCategory === 'All'
    ? COURSES
    : COURSES.filter(c => c.category === activeCategory);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setIsEnrollOpen(true);
  };

  return (
    <section id="courses" className="py-20 bg-gradient-to-b from-white to-[#fafdfa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <span className="text-xs font-extrabold text-amber-600 bg-amber-50 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            আমাদের অফারকৃত কোর্সসমূহ
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
            আপনার লক্ষ্য অর্জনে আমাদের <span className="text-[#e17100]">সেরা কোর্সগুলো</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            দেশে-বিদেশে পেশাগত দায়িত্ব পালনে নানা অভিজ্ঞতার আলোকে তৈরি করা এই প্রশিক্ষণগুলো আপনার ক্লিনিক্যাল ক্যারিয়ার গঠনে নতুন পথ দেখাতে সক্ষম। বাস্তবমুখী ব্যবহারিক শিক্ষা আপনার আত্মবিশ্বাস বাড়িয়ে আপনাকে গড়ে তুলবে দেশের প্রথম সারির মেন্টর হিসেবে।
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-brand text-brand-contrast shadow-md'
                  : 'bg-brand-light text-brand hover:bg-[#cbdccb]/40'
              }`}
            >
              {cat === 'All' ? 'সব কোর্সসমূহ' : 
               cat === 'Clinical Nutrition' ? 'ক্লিনিক্যাল নিউট্রিশন' : 
               cat === 'Sports Nutrition' ? 'স্পোর্টস নিউট্রিশন' : 'শিশু পুষ্টি'}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group h-full"
            >
              {/* Card Image Thumbnail */}
              <div className="relative h-48 sm:h-52 shrink-0">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Badge for seats constraint */}
                {course.seatsLeft <= 8 && (
                  <div className="absolute top-4 left-4 bg-amber-600 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Flame className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>মাত্র {course.seatsLeft}টি সীট বাকি!</span>
                  </div>
                )}

                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase">
                  {course.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Rating reviews details */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-500" />
                    <span>{course.rating.toFixed(1)}</span>
                    <span className="text-gray-400 font-medium">({course.reviewsCount} মতামত)</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-brand transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Course core specifications matching screenshot exactly */}
                <div className="bg-brand-light/50 p-3 rounded-xl border border-[#cbdccb]/20 space-y-1.5 text-xs text-gray-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#143a1b] dark:text-[#a8d764] shrink-0" />
                    <span className="font-bold text-[#143a1b] dark:text-[#a8d764]">কোর্স সময়কাল: {course.duration}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-[#143a1b] dark:text-[#a8d764] shrink-0 mt-0.5" />
                    <div className="leading-normal">
                      লাইভ ক্লাস <span className="font-bold text-[#143a1b] dark:text-[#a8d764]">{course.liveClasses}টি</span> | রেকর্ড সেশন {course.recordedClasses}টি | {course.orientation}টি ওরিয়েন্টেশন | {course.exams}টি পরীক্ষা
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-500 italic pt-1 border-t border-gray-200/50">
                    * {course.classDuration}
                  </div>
                </div>

                {/* Pricing & CTA enrollment triggers */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 shrink-0">
                  <div>
                    <span className="text-[10px] text-gray-400 line-through block font-medium">
                      ৳ {course.originalPrice.toLocaleString('bn-BD')}
                    </span>
                    <span className="text-lg font-extrabold text-amber-600">
                      ৳ {course.price.toLocaleString('bn-BD')} মাত্র
                    </span>
                  </div>

                  <button
                    onClick={() => handleEnrollClick(course)}
                    className="bg-brand hover:bg-brand-hover text-brand-contrast hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition-all duration-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>ভর্তি হোন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Enroll Modal */}
      <EnrollModal
        course={selectedCourse}
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
      />
    </section>
  );
}
