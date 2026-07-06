// Full-stack API Client for Bangladesh Academy of Dietetics and Nutrition (BADN)
// Synchronizes seamlessly between Server-side MySQL and client LocalStorage fallback.

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
      localStorage.setItem('badn_enrollments', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching enrollments. Using localStorage fallback:', err);
  }
  return JSON.parse(localStorage.getItem('badn_enrollments') || '[]');
}

export async function addEnrollment(enrollment: any): Promise<boolean> {
  // Sync to local storage first
  const local = JSON.parse(localStorage.getItem('badn_enrollments') || '[]');
  localStorage.setItem('badn_enrollments', JSON.stringify([...local, enrollment]));

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
  const local = JSON.parse(localStorage.getItem('badn_enrollments') || '[]');
  const updated = local.map((item: any) => item.id === id ? { ...item, status } : item);
  localStorage.setItem('badn_enrollments', JSON.stringify(updated));

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
  const local = JSON.parse(localStorage.getItem('badn_enrollments') || '[]');
  const filtered = local.filter((item: any) => item.id !== id);
  localStorage.setItem('badn_enrollments', JSON.stringify(filtered));

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
      localStorage.setItem('badn_seminar_registrations', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching seminars. Using localStorage fallback:', err);
  }
  return JSON.parse(localStorage.getItem('badn_seminar_registrations') || '[]');
}

export async function addSeminarRegistration(registration: any): Promise<boolean> {
  const local = JSON.parse(localStorage.getItem('badn_seminar_registrations') || '[]');
  localStorage.setItem('badn_seminar_registrations', JSON.stringify([...local, registration]));

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
  const local = JSON.parse(localStorage.getItem('badn_seminar_registrations') || '[]');
  const updated = local.map((item: any) => item.id === id ? { ...item, status } : item);
  localStorage.setItem('badn_seminar_registrations', JSON.stringify(updated));

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
  const local = JSON.parse(localStorage.getItem('badn_seminar_registrations') || '[]');
  const filtered = local.filter((item: any) => item.id !== id);
  localStorage.setItem('badn_seminar_registrations', JSON.stringify(filtered));

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
      localStorage.setItem('badn_contact_messages', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching inquiries. Using localStorage fallback:', err);
  }
  return JSON.parse(localStorage.getItem('badn_contact_messages') || '[]');
}

export async function addInquiry(inquiry: any): Promise<boolean> {
  const local = JSON.parse(localStorage.getItem('badn_contact_messages') || '[]');
  localStorage.setItem('badn_contact_messages', JSON.stringify([...local, inquiry]));

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
  const local = JSON.parse(localStorage.getItem('badn_contact_messages') || '[]');
  const filtered = local.filter((item: any) => item.id !== id);
  localStorage.setItem('badn_contact_messages', JSON.stringify(filtered));

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
      localStorage.setItem('badn_certificates', JSON.stringify(result.data));
      return result.data;
    }
  } catch (err) {
    console.warn('API error fetching certificates. Using localStorage fallback:', err);
  }
  const local = localStorage.getItem('badn_certificates');
  if (!local || local.includes('জিন্নাতুল') || local.includes('আফরিনা')) {
    localStorage.setItem('badn_certificates', JSON.stringify(DEFAULT_LOCAL_CERTS));
    return DEFAULT_LOCAL_CERTS;
  }
  return JSON.parse(local);
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
  localStorage.setItem('badn_certificates', JSON.stringify(local));

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
  localStorage.setItem('badn_certificates', JSON.stringify(filtered));

  try {
    const res = await fetch(`/api/certificates/${id}`, { method: 'DELETE' });
    const result = await res.json();
    return result.success;
  } catch (err) {
    console.warn('API error deleting certificate:', err);
    return true; // Return true as it succeeded locally
  }
}
