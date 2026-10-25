// Full-stack API Client for Bangladesh Academy of Dietetics and Nutrition (BADN)
// Synchronizes seamlessly between Server-side MySQL and client LocalStorage fallback.
import { COURSES, SEMINARS as STATIC_SEMINAR_EVENTS, TESTIMONIALS as STATIC_TESTIMONIALS } from '../data';
import { safeLocalStorage, safeJsonParse } from './storage';

export async function getDbStatus() {
  try {
    const res = await fetch('/api/db-status');
    return await res.json();
  } catch (error) {
    return { connected: false, message: 'Cannot connect to server API' };
  }
}

// ==================== ENROLLMENTS ====================

export async function getEnrollments(): Promise<any[]> {
  try {
    const res = await fetch('/api/enrollments');
    const result = await res.json();
    if (result.success && result.data) {
      // Sync local storage so it remains updated
      safeLocalStorage.setItem('badn_enrollments', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching enrollments. Using localStorage fallback:', err);
  }
  return safeJsonParse(safeLocalStorage.getItem('badn_enrollments'), []);
}

export async function addEnrollment(enrollment: any): Promise<boolean> {
  // Sync to local storage first
  const local = safeJsonParse(safeLocalStorage.getItem('badn_enrollments'), []);
  safeLocalStorage.setItem('badn_enrollments', JSON.stringify([...local, enrollment]));

  try {
    const res = await fetch('/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrollment)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding enrollment:', err);
    return false;
  }
}

export async function updateEnrollmentStatus(id: string, status: string): Promise<boolean> {
  // Sync local storage
  const local = safeJsonParse(safeLocalStorage.getItem('badn_enrollments'), []);
  const updated = local.map((item: any) => item.id === id ? { ...item, status } : item);
  safeLocalStorage.setItem('badn_enrollments', JSON.stringify(updated));

  try {
    const res = await fetch(`/api/enrollments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error updating enrollment status:', err);
    return false;
  }
}

export async function deleteEnrollment(id: string): Promise<boolean> {
  // Sync local storage
  const local = safeJsonParse(safeLocalStorage.getItem('badn_enrollments'), []);
  const filtered = local.filter((item: any) => item.id !== id);
  safeLocalStorage.setItem('badn_enrollments', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/enrollments/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting enrollment:', err);
    return false;
  }
}

// ==================== SEMINARS ====================

export async function getSeminars(): Promise<any[]> {
  try {
    const res = await fetch('/api/seminars');
    const result = await res.json();
    if (result.success && result.data) {
      safeLocalStorage.setItem('badn_seminar_registrations', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching seminars. Using localStorage fallback:', err);
  }
  return safeJsonParse(safeLocalStorage.getItem('badn_seminar_registrations'), []);
}

export async function addSeminarRegistration(registration: any): Promise<boolean> {
  const local = safeJsonParse(safeLocalStorage.getItem('badn_seminar_registrations'), []);
  safeLocalStorage.setItem('badn_seminar_registrations', JSON.stringify([...local, registration]));

  try {
    const res = await fetch('/api/seminars', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registration)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding seminar registration:', err);
    return false;
  }
}

export async function updateSeminarRegistrationStatus(id: string, status: string): Promise<boolean> {
  const local = safeJsonParse(safeLocalStorage.getItem('badn_seminar_registrations'), []);
  const updated = local.map((item: any) => item.id === id ? { ...item, status } : item);
  safeLocalStorage.setItem('badn_seminar_registrations', JSON.stringify(updated));

  try {
    const res = await fetch(`/api/seminars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error updating seminar registration status:', err);
    return false;
  }
}

export async function deleteSeminarRegistration(id: string): Promise<boolean> {
  const local = safeJsonParse(safeLocalStorage.getItem('badn_seminar_registrations'), []);
  const filtered = local.filter((item: any) => item.id !== id);
  safeLocalStorage.setItem('badn_seminar_registrations', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/seminars/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting seminar registration:', err);
    return false;
  }
}

// ==================== INQUIRIES ====================

export async function getInquiries(): Promise<any[]> {
  try {
    const res = await fetch('/api/inquiries');
    const result = await res.json();
    if (result.success && result.data) {
      safeLocalStorage.setItem('badn_contact_messages', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching inquiries. Using localStorage fallback:', err);
  }
  return safeJsonParse(safeLocalStorage.getItem('badn_contact_messages'), []);
}

export async function addInquiry(inquiry: any): Promise<boolean> {
  const local = safeJsonParse(safeLocalStorage.getItem('badn_contact_messages'), []);
  safeLocalStorage.setItem('badn_contact_messages', JSON.stringify([...local, inquiry]));

  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiry)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding inquiry:', err);
    return false;
  }
}

export async function deleteInquiry(id: string): Promise<boolean> {
  const local = safeJsonParse(safeLocalStorage.getItem('badn_contact_messages'), []);
  const filtered = local.filter((item: any) => item.id !== id);
  safeLocalStorage.setItem('badn_contact_messages', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting inquiry:', err);
    return false;
  }
}

// ==================== CERTIFICATES ====================

const DEFAULT_LOCAL_CERTS = [
  {
    id: 'BADN-2026-1001',
    studentName: 'Zinnatul Zahra Oishe',
    courseTitle: 'Certificate Course in Clinical Nutrition & Dietetics (CCND)',
    issueDate: 'July 05, 2026',
    status: 'Active'
  },
  {
    id: 'BADN-2026-1002',
    studentName: 'Afrina Sharmin Tona',
    courseTitle: 'Certificate Course in Clinical Nutrition & Dietetics (CCND)',
    issueDate: 'July 05, 2026',
    status: 'Active'
  }
];

export async function getCertificates(): Promise<any[]> {
  try {
    const res = await fetch('/api/certificates');
    const result = await res.json();
    if (result.success && result.data) {
      safeLocalStorage.setItem('badn_certificates', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching certificates. Using localStorage fallback:', err);
  }
  const local = safeLocalStorage.getItem('badn_certificates');
  if (!local || local.includes('জিন্নাতুল') || local.includes('আফরিনা')) {
    safeLocalStorage.setItem('badn_certificates', JSON.stringify(DEFAULT_LOCAL_CERTS));
    return DEFAULT_LOCAL_CERTS;
  }
  return safeJsonParse(local, DEFAULT_LOCAL_CERTS);
}

export async function getCertificateById(id: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/certificates/${id}`);
    const result = await res.json();
    if (result.success && result.data) {
      return result.data;
    }
  } catch (err) {
    console.warn('API error getting certificate. Using localStorage search:', err);
  }
  const certs = await getCertificates();
  return certs.find((c: any) => c.id.trim().toUpperCase() === id.trim().toUpperCase()) || null;
}

export async function addCertificate(certificate: any): Promise<boolean> {
  const local = await getCertificates();
  const index = local.findIndex((c: any) => c.id === certificate.id);
  if (index >= 0) {
    local[index] = certificate;
  } else {
    local.push(certificate);
  }
  safeLocalStorage.setItem('badn_certificates', JSON.stringify(local));

  try {
    const res = await fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificate)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding certificate:', err);
    return true; // Return true as it succeeded locally
  }
}

export async function deleteCertificate(id: string): Promise<boolean> {
  const local = await getCertificates();
  const filtered = local.filter((c: any) => c.id !== id);
  safeLocalStorage.setItem('badn_certificates', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting certificate:', err);
    return true; // Return true as it succeeded locally
  }
}

// ==================== DYNAMIC COURSES ====================

export async function getCourses(): Promise<any[]> {
  try {
    const res = await fetch('/api/courses');
    const result = await res.json();
    if (result.success && result.data && result.data.length > 0) {
      const dbCourses: any[] = result.data;
      const dbIds = new Set(dbCourses.map((c: any) => c.id));
      const missingDefaults = COURSES.filter(dc => !dbIds.has(dc.id));
      let mergedCourses = [...dbCourses, ...missingDefaults].map((c: any) => {
        const staticMatch = COURSES.find(sc => sc.id === c.id);
        if (staticMatch) {
          let finalImg = c.image;
          if (c.id === 'c1') finalImg = 'https://i.ibb.co.com/VYhH9KGM/CCND.jpg';
          else if (c.id === 'c6') finalImg = 'https://i.ibb.co.com/chWrS0Qb/10.png';
          else if (c.id === 'c2') finalImg = (c.image && !c.image.includes('10.png')) ? c.image : 'https://i.ibb.co.com/B25ChBhp/6.jpg';
          else if (c.id === 'c3') finalImg = 'https://i.ibb.co.com/6J49g293/11.png';
          else if (c.id === 'c4') finalImg = c.image || '/renal-nutrition-banner.png';
          else if (c.id === 'c5') finalImg = 'https://i.ibb.co.com/wZMQhYgz/Onco-Nutrition.png';

          let finalPrice = staticMatch.price;
          if (c.id === 'c2' || c.id === 'c3' || c.id === 'c4' || c.id === 'c6') {
            finalPrice = 5000;
          } else if (c.id === 'c5') {
            finalPrice = 3500;
          } else if (c.price) {
            finalPrice = Number(c.price);
          }

          let finalOriginalPrice = staticMatch.originalPrice;
          if (c.id === 'c2' || c.id === 'c4' || c.id === 'c6') finalOriginalPrice = 8000;
          else if (c.id === 'c3') finalOriginalPrice = 7000;
          else if (c.id === 'c5') finalOriginalPrice = 6000;

          return {
            ...staticMatch,
            ...c,
            price: finalPrice,
            originalPrice: finalOriginalPrice,
            image: finalImg,
            modules: c.modules && c.modules.length > 0 ? c.modules : staticMatch.modules,
            learningOutcomes: c.learningOutcomes && c.learningOutcomes.length > 0 ? c.learningOutcomes : staticMatch.learningOutcomes,
            learningMethodology: c.learningMethodology && c.learningMethodology.length > 0 ? c.learningMethodology : staticMatch.learningMethodology,
            perks: c.perks && c.perks.length > 0 ? c.perks : staticMatch.perks,
            targetAudience: c.targetAudience && c.targetAudience.length > 0 ? c.targetAudience : staticMatch.targetAudience,
            overviewBn: c.overviewBn || staticMatch.overviewBn,
            whyChoose: c.whyChoose || staticMatch.whyChoose,
            certificateInfo: c.certificateInfo || staticMatch.certificateInfo,
            whatsappNumber: c.whatsappNumber || staticMatch.whatsappNumber,
            totalClasses: c.totalClasses || staticMatch.totalClasses,
            extraClasses: c.extraClasses || staticMatch.extraClasses,
            medium: c.medium || staticMatch.medium
          };
        }
        return c;
      });
      const courseOrderMap = new Map(COURSES.map((c, index) => [c.id, index]));
      mergedCourses.sort((a, b) => {
        const orderA = courseOrderMap.has(a.id) ? courseOrderMap.get(a.id)! : 999;
        const orderB = courseOrderMap.has(b.id) ? courseOrderMap.get(b.id)! : 999;
        return orderA - orderB;
      });
      safeLocalStorage.setItem('badn_dynamic_courses', JSON.stringify(mergedCourses));
      return mergedCourses;
    }
  } catch (err) {
    console.warn('API error fetching courses. Using localStorage fallback:', err);
  }
  const local = safeLocalStorage.getItem('badn_dynamic_courses');
  if (!local) {
    safeLocalStorage.setItem('badn_dynamic_courses', JSON.stringify(COURSES));
    return COURSES;
  }
  const parsed = safeJsonParse(local, COURSES);
  const existingIds = new Set(parsed.map((c: any) => c.id));
  const fullList = [...parsed];
  for (const staticCourse of COURSES) {
    if (!existingIds.has(staticCourse.id)) {
      fullList.push(staticCourse);
      existingIds.add(staticCourse.id);
    }
  }
  const courseOrderMap = new Map(COURSES.map((c, index) => [c.id, index]));
  const updated = fullList.map((course: any) => {
    const staticMatch = COURSES.find(c => c.id === course.id);
    if (staticMatch) {
      let finalImg = course.image;
      if (course.id === 'c1') finalImg = 'https://i.ibb.co.com/VYhH9KGM/CCND.jpg';
      else if (course.id === 'c6') finalImg = 'https://i.ibb.co.com/chWrS0Qb/10.png';
      else if (course.id === 'c2') finalImg = (course.image && !course.image.includes('10.png')) ? course.image : 'https://i.ibb.co.com/B25ChBhp/6.jpg';
      else if (course.id === 'c3') finalImg = 'https://i.ibb.co.com/6J49g293/11.png';
      else if (course.id === 'c4') finalImg = course.image || '/renal-nutrition-banner.png';
      else if (course.id === 'c5') finalImg = 'https://i.ibb.co.com/wZMQhYgz/Onco-Nutrition.png';
      else if (course.image?.includes('course_thumbnail') || !course.image) finalImg = staticMatch.image;

      let finalPrice = staticMatch.price;
      if (course.id === 'c2' || course.id === 'c3' || course.id === 'c4' || course.id === 'c6') {
        finalPrice = 5000;
      } else if (course.id === 'c5') {
        finalPrice = 3500;
      } else if (course.price) {
        finalPrice = Number(course.price);
      }

      let finalOriginalPrice = staticMatch.originalPrice;
      if (course.id === 'c2' || course.id === 'c4' || course.id === 'c6') finalOriginalPrice = 8000;
      else if (course.id === 'c3') finalOriginalPrice = 7000;
      else if (course.id === 'c5') finalOriginalPrice = 6000;

      return {
        ...staticMatch,
        ...course,
        price: finalPrice,
        originalPrice: finalOriginalPrice,
        image: finalImg,
        modules: course.modules && course.modules.length > 0 ? course.modules : staticMatch.modules,
        learningOutcomes: course.learningOutcomes && course.learningOutcomes.length > 0 ? course.learningOutcomes : staticMatch.learningOutcomes,
        learningMethodology: course.learningMethodology && course.learningMethodology.length > 0 ? course.learningMethodology : staticMatch.learningMethodology,
        perks: course.perks && course.perks.length > 0 ? course.perks : staticMatch.perks,
        targetAudience: course.targetAudience && course.targetAudience.length > 0 ? course.targetAudience : staticMatch.targetAudience,
        overviewBn: course.overviewBn || staticMatch.overviewBn,
        whyChoose: course.whyChoose || staticMatch.whyChoose,
        certificateInfo: course.certificateInfo || staticMatch.certificateInfo,
        whatsappNumber: course.whatsappNumber || staticMatch.whatsappNumber,
        totalClasses: course.totalClasses || staticMatch.totalClasses,
        extraClasses: course.extraClasses || staticMatch.extraClasses,
        medium: course.medium || staticMatch.medium
      };
    }
    return course;
  });
  updated.sort((a, b) => {
    const orderA = courseOrderMap.has(a.id) ? courseOrderMap.get(a.id)! : 999;
    const orderB = courseOrderMap.has(b.id) ? courseOrderMap.get(b.id)! : 999;
    return orderA - orderB;
  });
  safeLocalStorage.setItem('badn_dynamic_courses', JSON.stringify(updated));
  return updated;
}

export async function addCourse(course: any): Promise<boolean> {
  const local = await getCourses();
  const index = local.findIndex((c: any) => c.id === course.id);
  if (index >= 0) {
    local[index] = course;
  } else {
    local.push(course);
  }
  safeLocalStorage.setItem('badn_dynamic_courses', JSON.stringify(local));

  try {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(course)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding/updating course:', err);
    return true; // Return true as it succeeded locally
  }
}

export async function deleteCourse(id: string): Promise<boolean> {
  const local = await getCourses();
  const filtered = local.filter((c: any) => c.id !== id);
  safeLocalStorage.setItem('badn_dynamic_courses', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting course:', err);
    return true; // Return true as it succeeded locally
  }
}

// ==================== DYNAMIC SEMINAR EVENTS ====================

export async function getSeminarEvents(): Promise<any[]> {
  try {
    const res = await fetch('/api/seminar-events');
    const result = await res.json();
    if (result.success && result.data && result.data.length > 0) {
      const dbSeminars: any[] = result.data;
      const dbIds = new Set(dbSeminars.map((s: any) => s.id));
      const missingDefaults = STATIC_SEMINAR_EVENTS.filter(ds => !dbIds.has(ds.id));
      let mergedSeminars = [...dbSeminars, ...missingDefaults].map((s: any) => {
        const staticMatch = STATIC_SEMINAR_EVENTS.find(sm => sm.id === s.id);
        if (staticMatch) {
          let finalImg = s.image;
          if (s.id === 's1') finalImg = 'https://i.ibb.co.com/v62LhVDm/Critical-Care-International-Seminar.jpg';
          else if (s.id === 's2') finalImg = 'https://i.ibb.co.com/FLN94kyk/gynomix-and-nutrigenix.jpg';
          else if (s.id === 's3') finalImg = 'https://i.ibb.co.com/qYVdj7pr/Sports-Nutritions.jpg';
          else if (s.id === 's4') finalImg = s.image || '/seminar-user-5.jpg';
          else if (s.id === 's5') finalImg = s.image || '/seminar-user-6.jpg';
          else if (s.id === 's6') finalImg = s.image || '/first-main.jpg';
          return { ...staticMatch, ...s, image: finalImg };
        }
        return s;
      });
      if (missingDefaults.length > 0) {
        fetch('/api/seminar-events/sync-defaults', { method: 'POST' }).catch(() => {});
      }
      safeLocalStorage.setItem('badn_dynamic_seminar_events', JSON.stringify(mergedSeminars));
      return mergedSeminars;
    }
  } catch (err) {
    console.warn('API error fetching seminar events. Using localStorage fallback:', err);
  }
  const local = safeLocalStorage.getItem('badn_dynamic_seminar_events');
  if (!local) {
    safeLocalStorage.setItem('badn_dynamic_seminar_events', JSON.stringify(STATIC_SEMINAR_EVENTS));
    return STATIC_SEMINAR_EVENTS;
  }
  const parsed = safeJsonParse(local, STATIC_SEMINAR_EVENTS);
  const filteredParsed = Array.isArray(parsed) ? parsed : STATIC_SEMINAR_EVENTS;
  const existingSeminarIds = new Set(filteredParsed.map((s: any) => s.id));
  const fullSeminarList = [...filteredParsed];
  for (const staticSeminar of STATIC_SEMINAR_EVENTS) {
    if (!existingSeminarIds.has(staticSeminar.id)) {
      fullSeminarList.push(staticSeminar);
      existingSeminarIds.add(staticSeminar.id);
    }
  }
  const updated = fullSeminarList.map((seminar: any) => {
    const staticMatch = STATIC_SEMINAR_EVENTS.find(s => s.id === seminar.id);
    if (staticMatch) {
      if (seminar.id === 's1') {
        return { ...seminar, image: 'https://i.ibb.co.com/v62LhVDm/Critical-Care-International-Seminar.jpg' };
      }
      if (seminar.id === 's2') {
        return { ...seminar, image: 'https://i.ibb.co.com/FLN94kyk/gynomix-and-nutrigenix.jpg' };
      }
      if (seminar.id === 's3') {
        return { ...seminar, image: 'https://i.ibb.co.com/qYVdj7pr/Sports-Nutritions.jpg' };
      }
      if (seminar.id === 's4') {
        return { ...seminar, image: seminar.image || '/seminar-user-5.jpg' };
      }
      if (seminar.id === 's5') {
        return { ...seminar, image: seminar.image || '/seminar-user-6.jpg' };
      }
      if (seminar.id === 's6') {
        return { ...seminar, image: seminar.image || '/first-main.jpg' };
      }
      if (seminar.image?.includes('unsplash') || seminar.image?.includes('9mJcbjDC') || !seminar.image) {
        return { ...seminar, image: staticMatch.image };
      }
    }
    return seminar;
  });
  safeLocalStorage.setItem('badn_dynamic_seminar_events', JSON.stringify(updated));
  return updated;
}

export async function addSeminarEvent(seminar: any): Promise<boolean> {
  const local = await getSeminarEvents();
  const index = local.findIndex((s: any) => s.id === seminar.id);
  if (index >= 0) {
    local[index] = seminar;
  } else {
    local.push(seminar);
  }
  safeLocalStorage.setItem('badn_dynamic_seminar_events', JSON.stringify(local));

  try {
    const res = await fetch('/api/seminar-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(seminar)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding/updating seminar event:', err);
    return true; // Return true as it succeeded locally
  }
}

export async function deleteSeminarEvent(id: string): Promise<boolean> {
  const local = await getSeminarEvents();
  const filtered = local.filter((s: any) => s.id !== id);
  safeLocalStorage.setItem('badn_dynamic_seminar_events', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/seminar-events/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting seminar event:', err);
    return true; // Return true as it succeeded locally
  }
}

// ==================== DYNAMIC TESTIMONIALS ====================

export async function getTestimonials(): Promise<any[]> {
  try {
    const res = await fetch('/api/testimonials');
    const result = await res.json();
    if (result.success && result.data && result.data.length > 0) {
      safeLocalStorage.setItem('badn_dynamic_testimonials', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching testimonials. Using localStorage fallback:', err);
  }
  const local = safeLocalStorage.getItem('badn_dynamic_testimonials');
  if (!local) {
    safeLocalStorage.setItem('badn_dynamic_testimonials', JSON.stringify(STATIC_TESTIMONIALS));
    return STATIC_TESTIMONIALS;
  }
  return safeJsonParse(local, STATIC_TESTIMONIALS);
}

export async function addTestimonial(testimonial: any): Promise<boolean> {
  const local = await getTestimonials();
  const index = local.findIndex((t: any) => t.id === testimonial.id);
  if (index >= 0) {
    local[index] = testimonial;
  } else {
    local.push(testimonial);
  }
  safeLocalStorage.setItem('badn_dynamic_testimonials', JSON.stringify(local));

  try {
    const res = await fetch('/api/testimonials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial)
    });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error adding/updating testimonial:', err);
    return true; // Return true as it succeeded locally
  }
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const local = await getTestimonials();
  const filtered = local.filter((t: any) => t.id !== id);
  safeLocalStorage.setItem('badn_dynamic_testimonials', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting testimonial:', err);
    return true; // Return true as it succeeded locally
  }
}
