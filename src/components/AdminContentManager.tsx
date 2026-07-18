import { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, Edit, Trash2, Check, X, BookOpen, Calendar, Star, 
  MessageSquare, Image, Layers, RefreshCw, Loader2, Play 
} from 'lucide-react';
import { 
  getCourses, addCourse, deleteCourse,
  getSeminarEvents, addSeminarEvent, deleteSeminarEvent,
  getTestimonials, addTestimonial, deleteTestimonial
} from '../lib/api';
import { Course, Seminar, Testimonial } from '../types';

export default function AdminContentManager() {
  const [subTab, setSubTab] = useState<'courses' | 'seminars' | 'testimonials'>('courses');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Data states
  const [courses, setCourses] = useState<Course[]>([]);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- Course Form Fields ---
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDuration, setCourseDuration] = useState('২ মাস (2 Months)');
  const [courseLiveClasses, setCourseLiveClasses] = useState(16);
  const [courseRecordedClasses, setCourseRecordedClasses] = useState(1);
  const [courseOrientation, setCourseOrientation] = useState(1);
  const [courseExams, setCourseExams] = useState(2);
  const [courseClassDuration, setCourseClassDuration] = useState('২ ঘণ্টা করে মোট ৪০ ঘণ্টা');
  const [coursePrice, setCoursePrice] = useState(12000);
  const [courseOriginalPrice, setCourseOriginalPrice] = useState(15000);
  const [courseImage, setCourseImage] = useState('');
  const [courseCategory, setCourseCategory] = useState('Clinical Nutrition');
  const [courseRating, setCourseRating] = useState(4.9);
  const [courseReviewsCount, setCourseReviewsCount] = useState(120);
  const [courseDescription, setCourseDescription] = useState('');
  const [courseSeatsLeft, setCourseSeatsLeft] = useState(8);
  const [courseStartDate, setCourseStartDate] = useState('১৫ আগস্ট, ২০২৬');

  // --- Seminar Form Fields ---
  const [seminarTitle, setSeminarTitle] = useState('');
  const [seminarOrganization, setSeminarOrganization] = useState('BADN');
  const [seminarDescription, setSeminarDescription] = useState('');
  const [seminarExpertName, setSeminarExpertName] = useState('');
  const [seminarExpertRole, setSeminarExpertRole] = useState('');
  const [seminarDate, setSeminarDate] = useState('১৫ আগস্ট, ২০২৬');
  const [seminarLocation, setSeminarLocation] = useState('ঢাকার পিজি হাসপাতাল অডিটোরিয়াম, ঢাকা');
  const [seminarImage, setSeminarImage] = useState('');

  // --- Testimonial Form Fields ---
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('পুষ্টিবিদ ও ডায়েটেশিয়ান');
  const [testFeedback, setTestFeedback] = useState('');
  const [testImage, setTestImage] = useState('');
  const [testRating, setTestRating] = useState(5);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const cList = await getCourses();
      const sList = await getSeminarEvents();
      const tList = await getTestimonials();
      setCourses(cList);
      setSeminars(sList);
      setTestimonials(tList);
    } catch (err) {
      console.error('Error loading contents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
  }, []);

  const triggerNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleOpenAddCourse = () => {
    setEditingId(null);
    setCourseTitle('');
    setCourseDuration('২ মাস (2 Months)');
    setCourseLiveClasses(16);
    setCourseRecordedClasses(1);
    setCourseOrientation(1);
    setCourseExams(2);
    setCourseClassDuration('২ ঘণ্টা করে মোট ৪০ ঘণ্টা');
    setCoursePrice(12000);
    setCourseOriginalPrice(15000);
    setCourseImage('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600');
    setCourseCategory('Clinical Nutrition');
    setCourseRating(4.9);
    setCourseReviewsCount(120);
    setCourseDescription('');
    setCourseSeatsLeft(8);
    setCourseStartDate('১৫ আগস্ট, ২০২৬');
    setIsFormOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingId(course.id);
    setCourseTitle(course.title);
    setCourseDuration(course.duration);
    setCourseLiveClasses(course.liveClasses);
    setCourseRecordedClasses(course.recordedClasses);
    setCourseOrientation(course.orientation);
    setCourseExams(course.exams);
    setCourseClassDuration(course.classDuration);
    setCoursePrice(course.price);
    setCourseOriginalPrice(course.originalPrice || course.price + 3000);
    setCourseImage(course.image);
    setCourseCategory(course.category);
    setCourseRating(course.rating || 4.9);
    setCourseReviewsCount(course.reviewsCount || 120);
    setCourseDescription(course.description);
    setCourseSeatsLeft(course.seatsLeft);
    setCourseStartDate(course.startDate || '১৫ আগস্ট, ২০২৬');
    setIsFormOpen(true);
  };

  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      triggerNotification('কোর্সের শিরোনাম লিখুন!', true);
      return;
    }

    const newId = editingId || `c_new_${Date.now()}`;
    const payload: Course = {
      id: newId,
      title: courseTitle,
      duration: courseDuration,
      liveClasses: Number(courseLiveClasses),
      recordedClasses: Number(courseRecordedClasses),
      orientation: Number(courseOrientation),
      exams: Number(courseExams),
      classDuration: courseClassDuration,
      price: Number(coursePrice),
      originalPrice: Number(courseOriginalPrice),
      image: courseImage || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600',
      category: courseCategory,
      rating: Number(courseRating),
      reviewsCount: Number(courseReviewsCount),
      description: courseDescription,
      seatsLeft: Number(courseSeatsLeft),
      startDate: courseStartDate
    };

    const success = await addCourse(payload);
    if (success) {
      triggerNotification(editingId ? 'কোর্স সফলভাবে আপডেট করা হয়েছে!' : 'নতুন কোর্স সফলভাবে আপলোড করা হয়েছে!');
      setIsFormOpen(false);
      loadAllContent();
      window.dispatchEvent(new CustomEvent('courses_updated'));
    } else {
      triggerNotification('কোর্স সংরক্ষণ করা সম্ভব হয়নি। আবার চেষ্টা করুন।', true);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?')) {
      const success = await deleteCourse(id);
      if (success) {
        triggerNotification('কোর্স সফলভাবে মুছে ফেলা হয়েছে!');
        loadAllContent();
        window.dispatchEvent(new CustomEvent('courses_updated'));
      } else {
        triggerNotification('কোর্স মুছতে সমস্যা হয়েছে।', true);
      }
    }
  };

  // --- Seminar Event Operations ---
  const handleOpenAddSeminar = () => {
    setEditingId(null);
    setSeminarTitle('');
    setSeminarOrganization('BADN');
    setSeminarDescription('');
    setSeminarExpertName('');
    setSeminarExpertRole('');
    setSeminarDate('১৫ আগস্ট, ২০২৬');
    setSeminarLocation('ঢাকার পিজি হাসপাতাল অডিটোরিয়াম, ঢাকা');
    setSeminarImage('https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600');
    setIsFormOpen(true);
  };

  const handleEditSeminar = (seminar: Seminar) => {
    setEditingId(seminar.id);
    setSeminarTitle(seminar.title);
    setSeminarOrganization(seminar.organization);
    setSeminarDescription(seminar.description);
    setSeminarExpertName(seminar.expertName);
    setSeminarExpertRole(seminar.expertRole);
    setSeminarDate(seminar.date);
    setSeminarLocation(seminar.location);
    setSeminarImage(seminar.image);
    setIsFormOpen(true);
  };

  const handleSaveSeminar = async (e: FormEvent) => {
    e.preventDefault();
    if (!seminarTitle.trim()) {
      triggerNotification('সেমিনারের শিরোনাম লিখুন!', true);
      return;
    }

    const newId = editingId || `s_new_${Date.now()}`;
    const payload: Seminar = {
      id: newId,
      title: seminarTitle,
      organization: seminarOrganization,
      description: seminarDescription,
      expertName: seminarExpertName,
      expertRole: seminarExpertRole,
      date: seminarDate,
      location: seminarLocation,
      image: seminarImage || 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=600'
    };

    const success = await addSeminarEvent(payload);
    if (success) {
      triggerNotification(editingId ? 'সেমিনার ইভেন্ট সফলভাবে আপডেট করা হয়েছে!' : 'নতুন সেমিনার ইভেন্ট সফলভাবে তৈরি করা হয়েছে!');
      setIsFormOpen(false);
      loadAllContent();
      window.dispatchEvent(new CustomEvent('seminars_updated'));
    } else {
      triggerNotification('সেমিনার সংরক্ষণ করা সম্ভব হয়নি।', true);
    }
  };

  const handleDeleteSeminar = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই সেমিনার ইভেন্টটি মুছে ফেলতে চান?')) {
      const success = await deleteSeminarEvent(id);
      if (success) {
        triggerNotification('সেমিনার ইভেন্ট সফলভাবে মুছে ফেলা হয়েছে!');
        loadAllContent();
        window.dispatchEvent(new CustomEvent('seminars_updated'));
      } else {
        triggerNotification('সেমিনার মুছতে সমস্যা হয়েছে।', true);
      }
    }
  };

  // --- Testimonial Operations ---
  const handleOpenAddTestimonial = () => {
    setEditingId(null);
    setTestName('');
    setTestRole('পুষ্টিবিদ ও ট্রেইনি');
    setTestFeedback('');
    setTestImage('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150');
    setTestRating(5);
    setIsFormOpen(true);
  };

  const handleEditTestimonial = (test: Testimonial) => {
    setEditingId(test.id);
    setTestName(test.name);
    setTestRole(test.role);
    setTestFeedback(test.feedback);
    setTestImage(test.image);
    setTestRating(test.rating || 5);
    setIsFormOpen(true);
  };

  const handleSaveTestimonial = async (e: FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !testFeedback.trim()) {
      triggerNotification('শিক্ষার্থীর নাম ও মতামত উভয়ই পূরণ করুন!', true);
      return;
    }

    const newId = editingId || `t_new_${Date.now()}`;
    const payload: Testimonial = {
      id: newId,
      name: testName,
      role: testRole,
      feedback: testFeedback,
      image: testImage || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
      rating: Number(testRating)
    };

    const success = await addTestimonial(payload);
    if (success) {
      triggerNotification(editingId ? 'রিভিউ সফলভাবে আপডেট করা হয়েছে!' : 'নতুন রিভিউ সফলভাবে যুক্ত করা হয়েছে!');
      setIsFormOpen(false);
      loadAllContent();
      window.dispatchEvent(new CustomEvent('testimonials_updated'));
    } else {
      triggerNotification('রিভিউ সংরক্ষণ করা সম্ভব হয়নি।', true);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই রিভিউটি মুছে ফেলতে চান?')) {
      const success = await deleteTestimonial(id);
      if (success) {
        triggerNotification('রিভিউ সফলভাবে মুছে ফেলা হয়েছে!');
        loadAllContent();
        window.dispatchEvent(new CustomEvent('testimonials_updated'));
      } else {
        triggerNotification('রিভিউ মুছতে সমস্যা হয়েছে।', true);
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs navigation */}
      <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => { setSubTab('courses'); setIsFormOpen(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'courses' 
                ? 'bg-[#e97c00] text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>কোর্সসমূহ ({courses.length})</span>
          </button>
          <button
            onClick={() => { setSubTab('seminars'); setIsFormOpen(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'seminars' 
                ? 'bg-[#e97c00] text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>সেমিনার ইভেন্টসমূহ ({seminars.length})</span>
          </button>
          <button
            onClick={() => { setSubTab('testimonials'); setIsFormOpen(false); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              subTab === 'testimonials' 
                ? 'bg-[#e97c00] text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>প্রশিক্ষণার্থীদের রিভিউসমূহ ({testimonials.length})</span>
          </button>
        </div>

        <button
          onClick={loadAllContent}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 border border-gray-300 transition-all cursor-pointer"
          title="রিফ্রেশ করুন"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-[#e97c00]" /> : <RefreshCw className="w-4 h-4" />}
        </button>
      </div>

      {/* Dynamic Alerts */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-extrabold flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs font-extrabold flex items-center gap-2">
          <X className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form Display */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-2xl border-2 border-[#e97c00]/30 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center border-b border-gray-100 pb-3">
            <h4 className="text-sm font-extrabold text-[#e97c00] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-5 h-5" />
              {editingId ? 'আইটেম এডিট করুন (Edit Content)' : 'নতুন কন্টেন্ট আপলোড করুন (Upload New Content)'}
            </h4>
            <button
              onClick={() => setIsFormOpen(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form switch depend on subTab */}
          {subTab === 'courses' && (
            <form onSubmit={handleSaveCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">কোর্সের শিরোনাম (Title):</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="উদা: সার্টিফিকেট কোর্স - ক্লিনিক্যাল নিউট্রিশন এন্ড ডায়েটেটিক্স (সিসিএনডি)"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ক্যাটাগরি (Category):</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold cursor-pointer"
                >
                  <option value="Clinical Nutrition">Clinical Nutrition (ক্লিনিক্যাল)</option>
                  <option value="Sports Nutrition">Sports Nutrition (স্পোর্টস)</option>
                  <option value="Child Nutrition">Child Nutrition (শিশু পুষ্টি)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ভর্তি ফি (Price - ৳):</label>
                <input
                  type="number"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  placeholder="12000"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">আসল ফি (Original Price - ৳):</label>
                <input
                  type="number"
                  value={courseOriginalPrice}
                  onChange={(e) => setCourseOriginalPrice(Number(e.target.value))}
                  placeholder="15000"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">কোর্সের সময়কাল (Duration):</label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  placeholder="২ মাস (2 Months)"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ক্লাসের তথ্য (Class Duration Text):</label>
                <input
                  type="text"
                  value={courseClassDuration}
                  onChange={(e) => setCourseClassDuration(e.target.value)}
                  placeholder="২ ঘণ্টা করে মোট ৪০ ঘণ্টা"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">লাইভ ক্লাস সংখ্যা:</label>
                <input
                  type="number"
                  value={courseLiveClasses}
                  onChange={(e) => setCourseLiveClasses(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">রেকর্ড ক্লাস সংখ্যা:</label>
                <input
                  type="number"
                  value={courseRecordedClasses}
                  onChange={(e) => setCourseRecordedClasses(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">ওরিয়েন্টেশন সংখ্যা:</label>
                <input
                  type="number"
                  value={courseOrientation}
                  onChange={(e) => setCourseOrientation(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">পরীক্ষা সংখ্যা:</label>
                <input
                  type="number"
                  value={courseExams}
                  onChange={(e) => setCourseExams(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">শুরুর তারিখ (Start Date):</label>
                <input
                  type="text"
                  value={courseStartDate}
                  onChange={(e) => setCourseStartDate(e.target.value)}
                  placeholder="১৫ জুলাই, ২০২৬"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">বাকি থাকা সিট সংখ্যা:</label>
                <input
                  type="number"
                  value={courseSeatsLeft}
                  onChange={(e) => setCourseSeatsLeft(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">মিডিয়া / থাম্বনেইল ছবি URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={courseImage}
                    onChange={(e) => setCourseImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 flex-1"
                  />
                  <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden shrink-0">
                    <img src={courseImage} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=150"; }} />
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">কোর্সের সংক্ষিপ্ত বিবরণ (Description):</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={3}
                  placeholder="কোর্সের বিস্তারিত এখানে লিখুন..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  ✓ কোর্স সংরক্ষণ করুন
                </button>
              </div>
            </form>
          )}

          {subTab === 'seminars' && (
            <form onSubmit={handleSaveSeminar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">সেমিনারের শিরোনাম (Title):</label>
                <input
                  type="text"
                  value={seminarTitle}
                  onChange={(e) => setSeminarTitle(e.target.value)}
                  placeholder="উদা: ক্রিটিক্যাল কেয়ার নিউট্রিশন নিয়ে আন্তর্জাতিক সেমিনার"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">আয়োজক প্রতিষ্ঠান (Organization):</label>
                <input
                  type="text"
                  value={seminarOrganization}
                  onChange={(e) => setSeminarOrganization(e.target.value)}
                  placeholder="BADN ইন্টারন্যাশনাল"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">তারিখ ও সময় (Date):</label>
                <input
                  type="text"
                  value={seminarDate}
                  onChange={(e) => setSeminarDate(e.target.value)}
                  placeholder="১৮ এপ্রিল, ২০২৬"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">বিশেষজ্ঞ স্পিকারের নাম (Expert Name):</label>
                <input
                  type="text"
                  value={seminarExpertName}
                  onChange={(e) => setSeminarExpertName(e.target.value)}
                  placeholder="উদা: সাংহামিত্রা চক্রবর্তী"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">স্পিকারের পদবী (Expert Designation):</label>
                <input
                  type="text"
                  value={seminarExpertRole}
                  onChange={(e) => setSeminarExpertRole(e.target.value)}
                  placeholder="HOD, Nutrition & Dietetics, Medica Kolkata"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">সেমিনারের স্থান (Location):</label>
                <input
                  type="text"
                  value={seminarLocation}
                  onChange={(e) => setSeminarLocation(e.target.value)}
                  placeholder="বারডেম হাসপাতাল অডিটোরিয়াম, ঢাকা"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">ব্যানার / মিডিয়া ছবি URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={seminarImage}
                    onChange={(e) => setSeminarImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 flex-1"
                  />
                  <div className="w-10 h-10 border border-gray-300 rounded-lg overflow-hidden shrink-0">
                    <img src={seminarImage} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150"; }} />
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">সেমিনারের বিবরণ (Description):</label>
                <textarea
                  value={seminarDescription}
                  onChange={(e) => setSeminarDescription(e.target.value)}
                  rows={3}
                  placeholder="সেমিনার বা ওয়ার্কশপের বিস্তারিত এখানে লিখুন..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  ✓ সেমিনার সংরক্ষণ করুন
                </button>
              </div>
            </form>
          )}

          {subTab === 'testimonials' && (
            <form onSubmit={handleSaveTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">শিক্ষার্থীর নাম (Student Name):</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="উদা: জিন্নাতুল জাহরা ঐশী"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">পরিচয় / পদবী (Designation):</label>
                <input
                  type="text"
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value)}
                  placeholder="উদা: নিউট্রিয়াম গ্র্যাজুয়েট ও পুষ্টিবিদ"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">রেটিং (Rating 1-5 Star):</label>
                <select
                  value={testRating}
                  onChange={(e) => setTestRating(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (৫ স্টার)</option>
                  <option value={4}>⭐⭐⭐⭐ (৪ স্টার)</option>
                  <option value={3}>⭐⭐⭐ (৩ স্টার)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">প্রোফাইল ছবি URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testImage}
                    onChange={(e) => setTestImage(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 flex-1"
                  />
                  <div className="w-10 h-10 border border-gray-300 rounded-full overflow-hidden shrink-0">
                    <img src={testImage} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"; }} />
                  </div>
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">শিক্ষার্থীর মতামত (Feedback):</label>
                <textarea
                  value={testFeedback}
                  onChange={(e) => setTestFeedback(e.target.value)}
                  rows={4}
                  required
                  placeholder="এখানে শিক্ষার্থীর বাস্তব মূল্যায়ন বা প্রশংসামূলক মতামত লিখুন..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 leading-relaxed text-justify"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  ✓ রিভিউ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Grid listing depend on subTab */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h5 className="text-xs font-bold uppercase tracking-wider text-gray-500">
            বিদ্যমান আইটেম তালিকা (Current Active Elements)
          </h5>

          {!isFormOpen && (
            <button
              onClick={() => {
                if (subTab === 'courses') handleOpenAddCourse();
                else if (subTab === 'seminars') handleOpenAddSeminar();
                else handleOpenAddTestimonial();
              }}
              className="px-3.5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>
                {subTab === 'courses' ? 'নতুন কোর্স আপলোড' : 
                 subTab === 'seminars' ? 'নতুন সেমিনার আপলোড' : 'নতুন রিভিউ যুক্ত করুন'}
              </span>
            </button>
          )}
        </div>

        {subTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400 text-xs">
                কোনো কোর্স খুঁজে পাওয়া যায়নি। উপরের বাটনটি ক্লিক করে প্রথম কোর্স আপলোড করুন!
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                    <img src={course.image} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=150"; }} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-2 py-0.5 rounded">
                      {course.category}
                    </span>
                    <h4 className="text-xs font-black text-gray-900 truncate" title={course.title}>
                      {course.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-bold">
                      ৳ {course.price.toLocaleString('bn-BD')} | {course.duration} | {course.liveClasses}টি লাইভ ক্লাস
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 cursor-pointer"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {subTab === 'seminars' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seminars.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400 text-xs">
                কোনো সেমিনার ইভেন্ট খুঁজে পাওয়া যায়নি।
              </div>
            ) : (
              seminars.map((seminar) => (
                <div key={seminar.id} className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-50">
                    <img src={seminar.image} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=150"; }} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <span className="text-[9px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded">
                      {seminar.organization}
                    </span>
                    <h4 className="text-xs font-black text-gray-900 truncate" title={seminar.title}>
                      {seminar.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-bold truncate">
                      👤 {seminar.expertName} | 📅 {seminar.date}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEditSeminar(seminar)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 cursor-pointer"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSeminar(seminar.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {subTab === 'testimonials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testimonials.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400 text-xs">
                কোনো রিভিউ বা প্রশংসামূলক মতামত খুঁজে পাওয়া যায়নি।
              </div>
            ) : (
              testimonials.map((test) => (
                <div key={test.id} className="bg-white p-4 rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-50 border border-brand/25">
                    <img src={test.image} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"; }} />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3 h-3 fill-amber-500" />
                      <span className="text-[10px] font-bold">{test.rating || 5}.0</span>
                    </div>
                    <h4 className="text-xs font-black text-gray-900 truncate">
                      {test.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate font-semibold">
                      {test.role}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEditTestimonial(test)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 cursor-pointer"
                      title="সম্পাদনা করুন"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(test.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

    </div>
  );
}
