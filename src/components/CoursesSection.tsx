import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { Clock, BookOpen, Award, Users, Star, ArrowRight, Share2 } from 'lucide-react';
import EnrollModal from './EnrollModal';
import CourseDetailsModal from './CourseDetailsModal';
import CourseShareModal from './CourseShareModal';
import { getCourses } from '../lib/api';
import courseUser9Img from '../assets/images/course_user_9.png';
import courseUser10Img from '../assets/images/course_user_10.png';
import courseUser11Img from '../assets/images/course_user_11.png';

const getCourseImage = (id: string, defaultImg?: string) => {
  if (id === 'c1') return 'https://i.ibb.co.com/wNgD30g1/9.png';
  if (id === 'c2') return 'https://i.ibb.co.com/chWrS0Qb/10.png';
  if (id === 'c3') return 'https://i.ibb.co.com/6J49g293/11.png';
  if (id === 'c4') return defaultImg || '/renal-nutrition-banner.png';
  if (id === 'c5') return defaultImg || 'https://i.ibb.co.com/3mP31tt1/3.jpg';
  if (id === 'c6') return defaultImg || 'https://i.ibb.co.com/B25ChBhp/6.jpg';
  return defaultImg || courseUser9Img;
};

const getCourseFallback = (id: string) => {
  if (id === 'c1') return courseUser9Img;
  if (id === 'c2') return courseUser10Img;
  if (id === 'c3') return courseUser11Img;
  if (id === 'c4') return '/renal-nutrition-banner.png';
  if (id === 'c5') return '/about-workshop-user-3.jpg';
  if (id === 'c6') return '/seminar-user-6.jpg';
  return courseUser9Img;
};

export default function CoursesSection() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [selectedDetailCourse, setSelectedDetailCourse] = useState<Course | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [shareCourse, setShareCourse] = useState<Course | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const loadCourses = () => {
      getCourses().then((data) => {
        setCourses(Array.isArray(data) ? data : []);
      });
    };
    loadCourses();

    window.addEventListener('courses_updated', loadCourses);
    return () => {
      window.removeEventListener('courses_updated', loadCourses);
    };
  }, []);

  // Deep-linking: check for ?course=<id> parameter on load or change
  useEffect(() => {
    if (courses.length === 0) return;
    const urlParams = new URLSearchParams(window.location.search);
    const courseParam = urlParams.get('course');
    if (courseParam) {
      const foundCourse = courses.find((c) => c.id === courseParam);
      if (foundCourse) {
        setSelectedDetailCourse(foundCourse);
        setIsDetailOpen(true);
        // Smoothly scroll down to courses area if directly opening via deep-link
        setTimeout(() => {
          const section = document.getElementById('courses');
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
          }
        }, 400);
      }
    }
  }, [courses]);

  const handleOpenDetails = (course: Course) => {
    setSelectedDetailCourse(course);
    setIsDetailOpen(true);
    // Sync browser URL for deep-linking
    const url = new URL(window.location.href);
    url.searchParams.set('course', course.id);
    window.history.replaceState({}, '', url.toString());
  };

  const handleCloseDetails = () => {
    setIsDetailOpen(false);
    // Remove query param from URL on close
    const url = new URL(window.location.href);
    url.searchParams.delete('course');
    window.history.replaceState({}, '', url.toString());
  };

  const handleOpenShare = (course: Course, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setShareCourse(course);
    setIsShareOpen(true);
  };

  const categories = [
    'All',
    'Clinical Nutrition',
    'Renal Nutrition',
    'Onco Nutrition',
    'Critical Care Nutrition',
    'Child Nutrition',
    'Sports Nutrition'
  ];

  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(c => c.category === activeCategory);

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
               cat === 'Renal Nutrition' ? 'রেনাল নিউট্রিশন' :
               cat === 'Onco Nutrition' ? 'অনকো নিউট্রিশন' :
               cat === 'Critical Care Nutrition' ? 'ক্রিটিক্যাল কেয়ার' :
               cat === 'Child Nutrition' ? 'শিশু পুষ্টি' : 'স্পোর্টস নিউট্রিশন'}
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
              <div className="relative h-52 sm:h-56 shrink-0 bg-gray-100 overflow-hidden">
                <picture>
                  {course.id === 'c1' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/course-9-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/course-9.webp" />
                    </>
                  ) : course.id === 'c2' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/course-10-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/course-10.webp" />
                    </>
                  ) : course.id === 'c3' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/course-11-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/course-11.webp" />
                    </>
                  ) : course.id === 'c4' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/course-renal-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/course-renal.webp" />
                    </>
                  ) : course.id === 'c5' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/about-workshop-3-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/about-workshop-3.webp" />
                    </>
                  ) : course.id === 'c6' ? (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/seminar-6-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/seminar-6.webp" />
                    </>
                  ) : (
                    <>
                      <source type="image/webp" media="(max-width: 640px)" srcSet="/optimized/course-renal-mobile.webp" />
                      <source type="image/webp" srcSet="/optimized/course-renal.webp" />
                    </>
                  )}
                  <img
                    src={getCourseImage(course.id, course.image)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      const parent = target.parentElement;
                      if (parent && parent.tagName.toLowerCase() === 'picture') {
                        parent.querySelectorAll('source').forEach((s) => s.remove());
                      }
                      target.src = getCourseFallback(course.id);
                    }}
                    alt={course.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-500"
                    width={400}
                    height={224}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                  />
                </picture>

                <button
                  type="button"
                  onClick={(e) => handleOpenShare(course, e)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-[#143a1b] shadow-md backdrop-blur-xs transition-all duration-200 hover:scale-110 cursor-pointer flex items-center justify-center z-10"
                  title="ফেসবুক ও হোয়াটসঅ্যাপে শেয়ার করুন"
                  aria-label="Share course"
                >
                  <Share2 className="w-4 h-4 text-[#143a1b]" />
                </button>

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
                    <span>{Number(course.rating || 5).toFixed(1)}</span>
                    <span className="text-gray-400 font-medium">({course.reviewsCount} মতামত)</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-snug group-hover:text-brand transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Course core specifications - High contrast and clearly visible across all courses */}
                <div className="bg-[#f0f7f0] p-3.5 rounded-xl border border-[#b8d9b8] space-y-2 text-xs text-slate-800 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#143a1b] shrink-0" />
                    <span className="font-bold text-[#143a1b] text-xs sm:text-[13px]">কোর্স সময়কাল: {course.duration}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <BookOpen className="w-4 h-4 text-[#143a1b] shrink-0 mt-0.5" />
                    <div className="leading-relaxed text-slate-800 font-semibold text-xs sm:text-[12.5px]">
                      লাইভ ক্লাস <span className="font-black text-[#143a1b]">{course.liveClasses}টি</span> | রেকর্ড সেশন <span className="font-black text-[#143a1b]">{course.recordedClasses}টি</span> | <span className="font-black text-[#143a1b]">{course.orientation}টি</span> ওরিয়েন্টেশন | <span className="font-black text-[#143a1b]">{course.exams}টি</span> পরীক্ষা
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#c2ddc2] text-[11px] sm:text-xs">
                    <span className="text-slate-700 font-bold">* {course.classDuration}</span>
                    <button
                      type="button"
                      onClick={() => handleOpenDetails(course)}
                      className="text-[#92400e] bg-amber-100/90 hover:bg-amber-200/90 border border-amber-300 font-bold px-2 py-0.5 rounded-md hover:underline cursor-pointer flex items-center transition-colors"
                    >
                      <span>{course.modules?.length || 10}টি মডিউল</span>
                    </button>
                  </div>
                </div>

                {/* Pricing & CTA enrollment triggers */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-gray-100 shrink-0">
                  <div>
                    <span className="text-[10px] text-gray-400 line-through block font-medium">
                      ৳ {Number(course.originalPrice || 0).toLocaleString('bn-BD')}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-amber-600 whitespace-nowrap">
                      ৳ {Number(course.price || 0).toLocaleString('bn-BD')} মাত্র
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* Quick Share Trigger */}
                    <button
                      type="button"
                      onClick={(e) => handleOpenShare(course, e)}
                      className="p-2 sm:p-2.5 rounded-xl bg-gray-50 hover:bg-[#eaf3ea] text-gray-600 hover:text-[#143a1b] border border-gray-200 hover:border-[#cbdccb] transition-all duration-200 flex items-center justify-center cursor-pointer shrink-0"
                      title="ফেসবুক বা হোয়াটসঅ্যাপে শেয়ার করুন"
                      aria-label="Share Course"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDetails(course)}
                      className="flex-1 sm:flex-none bg-[#eaf3ea] hover:bg-[#cbdccb]/60 text-[#143a1b] border border-[#cbdccb]/50 text-xs font-bold px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
                      title="কোর্সের বিস্তারিত তথ্য দেখুন"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>বিস্তারিত</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleEnrollClick(course)}
                      className="flex-1 sm:flex-none bg-brand hover:bg-brand-hover text-brand-contrast hover:text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>ভর্তি হোন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Course Details & Full Syllabus Modal */}
      <CourseDetailsModal
        course={selectedDetailCourse}
        isOpen={isDetailOpen}
        onClose={handleCloseDetails}
        onEnroll={(courseToEnroll) => {
          setSelectedCourse(courseToEnroll);
          setIsEnrollOpen(true);
        }}
      />

      {/* Course Share Modal */}
      <CourseShareModal
        course={shareCourse}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Enroll Modal */}
      <EnrollModal
        course={selectedCourse}
        isOpen={isEnrollOpen}
        onClose={() => setIsEnrollOpen(false)}
      />
    </section>
  );
}
