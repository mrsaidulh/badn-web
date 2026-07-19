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
  const [courseDuration, setCourseDuration] = useState('2 Months');
  const [courseLiveClasses, setCourseLiveClasses] = useState(16);
  const [courseRecordedClasses, setCourseRecordedClasses] = useState(1);
  const [courseOrientation, setCourseOrientation] = useState(1);
  const [courseExams, setCourseExams] = useState(2);
  const [courseClassDuration, setCourseClassDuration] = useState('2 Hours per Class (40 Hours Total)');
  const [coursePrice, setCoursePrice] = useState(12000);
  const [courseOriginalPrice, setCourseOriginalPrice] = useState(15000);
  const [courseImage, setCourseImage] = useState('');
  const [courseCategory, setCourseCategory] = useState('Clinical Nutrition');
  const [courseRating, setCourseRating] = useState(4.9);
  const [courseReviewsCount, setCourseReviewsCount] = useState(120);
  const [courseDescription, setCourseDescription] = useState('');
  const [courseSeatsLeft, setCourseSeatsLeft] = useState(8);
  const [courseStartDate, setCourseStartDate] = useState('August 15, 2026');

  // --- Seminar Form Fields ---
  const [seminarTitle, setSeminarTitle] = useState('');
  const [seminarOrganization, setSeminarOrganization] = useState('BADN');
  const [seminarDescription, setSeminarDescription] = useState('');
  const [seminarExpertName, setSeminarExpertName] = useState('');
  const [seminarExpertRole, setSeminarExpertRole] = useState('');
  const [seminarDate, setSeminarDate] = useState('August 15, 2026');
  const [seminarLocation, setSeminarLocation] = useState('PG Hospital Auditorium, Dhaka');
  const [seminarImage, setSeminarImage] = useState('');

  // --- Testimonial Form Fields ---
  const [testName, setTestName] = useState('');
  const [testRole, setTestRole] = useState('Nutritionist & Dietitian');
  const [testFeedback, setTestFeedback] = useState('');
  const [testImage, setTestImage] = useState('');
  const [testRating, setTestRating] = useState(5);

  const loadAllContent = async () => {
    setLoading(true);
    try {
      const cList = await getCourses();
      const sList = await getSeminarEvents();
      const tList = await getTestimonials();
      setCourses(Array.isArray(cList) ? cList : []);
      setSeminars(Array.isArray(sList) ? sList : []);
      setTestimonials(Array.isArray(tList) ? tList : []);
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
    setCourseDuration('2 Months');
    setCourseLiveClasses(16);
    setCourseRecordedClasses(1);
    setCourseOrientation(1);
    setCourseExams(2);
    setCourseClassDuration('2 Hours per Class (40 Hours Total)');
    setCoursePrice(12000);
    setCourseOriginalPrice(15000);
    setCourseImage('https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600');
    setCourseCategory('Clinical Nutrition');
    setCourseRating(4.9);
    setCourseReviewsCount(120);
    setCourseDescription('');
    setCourseSeatsLeft(8);
    setCourseStartDate('August 15, 2026');
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
    setCourseStartDate(course.startDate || 'August 15, 2026');
    setIsFormOpen(true);
  };

  const handleSaveCourse = async (e: FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) {
      triggerNotification('Please enter the course title!', true);
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
      triggerNotification(editingId ? 'Course successfully updated!' : 'New course successfully uploaded!');
      setIsFormOpen(false);
      loadAllContent();
      window.dispatchEvent(new CustomEvent('courses_updated'));
    } else {
      triggerNotification('Failed to save course. Please try again.', true);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      const success = await deleteCourse(id);
      if (success) {
        triggerNotification('Course successfully deleted!');
        loadAllContent();
        window.dispatchEvent(new CustomEvent('courses_updated'));
      } else {
        triggerNotification('Failed to delete course.', true);
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
    setSeminarDate('August 15, 2026');
    setSeminarLocation('PG Hospital Auditorium, Dhaka');
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
      triggerNotification('Please enter the seminar title!', true);
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
      triggerNotification(editingId ? 'Seminar event successfully updated!' : 'New seminar event successfully created!');
      setIsFormOpen(false);
      loadAllContent();
      window.dispatchEvent(new CustomEvent('seminars_updated'));
    } else {
      triggerNotification('Failed to save seminar.', true);
    }
  };

  const handleDeleteSeminar = async (id: string) => {
    if (confirm('Are you sure you want to delete this seminar event?')) {
      const success = await deleteSeminarEvent(id);
      if (success) {
        triggerNotification('Seminar event successfully deleted!');
        loadAllContent();
        window.dispatchEvent(new CustomEvent('seminars_updated'));
      } else {
        triggerNotification('Failed to delete seminar.', true);
      }
    }
  };

  // --- Testimonial Operations ---
  const handleOpenAddTestimonial = () => {
    setEditingId(null);
    setTestName('');
    setTestRole('Nutritionist & Trainee');
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
      triggerNotification('Please provide both the student name and feedback!', true);
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
      triggerNotification(editingId ? 'Review successfully updated!' : 'New review successfully added!');
      setIsFormOpen(false);
      loadAllContent();
      window.dispatchEvent(new CustomEvent('testimonials_updated'));
    } else {
      triggerNotification('Failed to save review.', true);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      const success = await deleteTestimonial(id);
      if (success) {
        triggerNotification('Review successfully deleted!');
        loadAllContent();
        window.dispatchEvent(new CustomEvent('testimonials_updated'));
      } else {
        triggerNotification('Failed to delete review.', true);
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
            <span>Courses ({courses.length})</span>
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
            <span>Seminar Events ({seminars.length})</span>
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
            <span>Student Reviews ({testimonials.length})</span>
          </button>
        </div>

        <button
          onClick={loadAllContent}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 border border-gray-300 transition-all cursor-pointer"
          title="Refresh List"
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
              {editingId ? 'Edit Content Item' : 'Upload New Content'}
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
                <label className="text-xs font-bold text-gray-700">Course Title:</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Certificate Course in Clinical Nutrition & Dietetics"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Category:</label>
                <select
                  value={courseCategory}
                  onChange={(e) => setCourseCategory(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold cursor-pointer"
                >
                  <option value="Clinical Nutrition">Clinical Nutrition</option>
                  <option value="Sports Nutrition">Sports Nutrition</option>
                  <option value="Child Nutrition">Child Nutrition</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Enrollment Fee (Price - ৳):</label>
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
                <label className="text-xs font-bold text-gray-700">Original Fee (Original Price - ৳):</label>
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
                <label className="text-xs font-bold text-gray-700">Course Duration:</label>
                <input
                  type="text"
                  value={courseDuration}
                  onChange={(e) => setCourseDuration(e.target.value)}
                  placeholder="e.g. 2 Months"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Class Information (Text):</label>
                <input
                  type="text"
                  value={courseClassDuration}
                  onChange={(e) => setCourseClassDuration(e.target.value)}
                  placeholder="e.g. 2 Hours per Class, 40 Hours Total"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Live Classes Count:</label>
                <input
                  type="number"
                  value={courseLiveClasses}
                  onChange={(e) => setCourseLiveClasses(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Recorded Classes Count:</label>
                <input
                  type="number"
                  value={courseRecordedClasses}
                  onChange={(e) => setCourseRecordedClasses(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Orientations Count:</label>
                <input
                  type="number"
                  value={courseOrientation}
                  onChange={(e) => setCourseOrientation(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Exams Count:</label>
                <input
                  type="number"
                  value={courseExams}
                  onChange={(e) => setCourseExams(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Start Date:</label>
                <input
                  type="text"
                  value={courseStartDate}
                  onChange={(e) => setCourseStartDate(e.target.value)}
                  placeholder="e.g. August 15, 2026"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Seats Remaining:</label>
                <input
                  type="number"
                  value={courseSeatsLeft}
                  onChange={(e) => setCourseSeatsLeft(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Thumbnail Image URL:</label>
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
                <label className="text-xs font-bold text-gray-700">Course Description:</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  rows={3}
                  placeholder="Write detailed course descriptions..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  ✓ Save Course
                </button>
              </div>
            </form>
          )}

          {subTab === 'seminars' && (
            <form onSubmit={handleSaveSeminar} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Seminar Title:</label>
                <input
                  type="text"
                  value={seminarTitle}
                  onChange={(e) => setSeminarTitle(e.target.value)}
                  placeholder="e.g. International Seminar on Critical Care Nutrition"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Host Organization:</label>
                <input
                  type="text"
                  value={seminarOrganization}
                  onChange={(e) => setSeminarOrganization(e.target.value)}
                  placeholder="BADN International"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Date & Time:</label>
                <input
                  type="text"
                  value={seminarDate}
                  onChange={(e) => setSeminarDate(e.target.value)}
                  placeholder="e.g. August 15, 2026"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Expert Speaker Name:</label>
                <input
                  type="text"
                  value={seminarExpertName}
                  onChange={(e) => setSeminarExpertName(e.target.value)}
                  placeholder="e.g. Sanghamitra Chakraborty"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Speaker Designation / Role:</label>
                <input
                  type="text"
                  value={seminarExpertRole}
                  onChange={(e) => setSeminarExpertRole(e.target.value)}
                  placeholder="HOD, Nutrition & Dietetics, Medica Kolkata"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Venue / Location:</label>
                <input
                  type="text"
                  value={seminarLocation}
                  onChange={(e) => setSeminarLocation(e.target.value)}
                  placeholder="BIRDEM Hospital Auditorium, Dhaka"
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-700">Banner / Media Image URL:</label>
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
                <label className="text-xs font-bold text-gray-700">Seminar Description:</label>
                <textarea
                  value={seminarDescription}
                  onChange={(e) => setSeminarDescription(e.target.value)}
                  rows={3}
                  placeholder="Write detailed event information..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 leading-relaxed"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  ✓ Save Seminar
                </button>
              </div>
            </form>
          )}

          {subTab === 'testimonials' && (
            <form onSubmit={handleSaveTestimonial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Student Name:</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Jinnatul Zahra Oishe"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Designation / Role:</label>
                <input
                  type="text"
                  value={testRole}
                  onChange={(e) => setTestRole(e.target.value)}
                  placeholder="e.g. Nutrition Graduate & Dietitian"
                  required
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Rating (1-5 Stars):</label>
                <select
                  value={testRating}
                  onChange={(e) => setTestRating(Number(e.target.value))}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 font-semibold cursor-pointer"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Avatar / Profile Image URL:</label>
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
                <label className="text-xs font-bold text-gray-700">Student Feedback / Testimonial:</label>
                <textarea
                  value={testFeedback}
                  onChange={(e) => setTestFeedback(e.target.value)}
                  rows={4}
                  required
                  placeholder="Describe the student's learning experience and review..."
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:ring-1 focus:ring-brand bg-gray-50 leading-relaxed text-justify"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#e97c00] hover:bg-[#d06e00] text-white rounded-lg text-xs font-bold shadow transition-all cursor-pointer"
                >
                  ✓ Save Review
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
            Active Elements Database (Live Panel)
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
                {subTab === 'courses' ? 'Add Course' : 
                 subTab === 'seminars' ? 'Add Seminar' : 'Add Review'}
              </span>
            </button>
          )}
        </div>

        {subTab === 'courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.length === 0 ? (
              <div className="col-span-2 text-center py-12 text-gray-400 text-xs">
                No courses found. Click the button above to upload your first course!
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
                      ৳ {Number(course.price || 0).toLocaleString('en-US')} | {course.duration} | {course.liveClasses} Live Classes
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300 cursor-pointer"
                      title="Edit Course"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer"
                      title="Delete Course"
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
                No seminar events found. Click the button above to upload your first seminar!
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
                      title="Edit Seminar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteSeminar(seminar.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer"
                      title="Delete Seminar"
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
                No reviews or testimonials found. Click the button above to add your first testimonial!
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
                      title="Edit Review"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTestimonial(test.id)}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 cursor-pointer"
                      title="Delete Review"
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
