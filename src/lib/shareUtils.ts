import { Course } from '../types';

/**
 * Generates direct deep-link URL for a specific course
 */
export function getCourseShareUrl(courseId: string): string {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/?course=${courseId}`;
}

/**
 * Generates well-formatted Bengali text containing full course highlights for WhatsApp and messaging apps
 */
export function getCourseShareText(course: Course): string {
  const shareUrl = getCourseShareUrl(course.id);
  const totalClasses = course.totalClasses || (course.liveClasses + (course.extraClasses || 3));
  const priceFormatted = Number(course.price || 0).toLocaleString('bn-BD');

  return `🎓 *${course.title}*
🏛️ *Bangladesh Academy of Dietetics and Nutrition (BADN)*

📋 *কোর্সের মূল বিবরণ:*
⏱️ সময়কাল: ${course.duration}
🎥 মোট ক্লাস: ${totalClasses}টি (${course.liveClasses}টি লাইভ সেশন)
💰 কোর্স ফি: ৳ ${priceFormatted} টাকা
🏆 ভেরিফাইড সার্টিফিকেট প্রদান করা হবে

📖 কোর্স পরিচিতি, বিস্তারিত বিষয়ভিত্তিক সিলেবাস ও ভর্তি হতে নিচের লিংকে ক্লিক করুন:
👉 ${shareUrl}`;
}

/**
 * Opens WhatsApp with pre-filled course details
 */
export function openWhatsAppShare(course: Course): void {
  const text = getCourseShareText(course);
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

/**
 * Opens Facebook Share dialog for the course deep-link
 */
export function openFacebookShare(course: Course): void {
  const shareUrl = getCourseShareUrl(course.id);
  const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  // Open in a standard centered popup window
  const width = 600;
  const height = 500;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  window.open(
    fbUrl,
    'facebook-share-dialog',
    `width=${width},height=${height},top=${top},left=${left},toolbar=0,menubar=0,status=0`
  );
}

/**
 * Copies course direct link to clipboard
 */
export async function copyCourseLinkToClipboard(course: Course): Promise<boolean> {
  const shareUrl = getCourseShareUrl(course.id);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Copies complete formatted course details text to clipboard
 */
export async function copyCourseTextToClipboard(course: Course): Promise<boolean> {
  const text = getCourseShareText(course);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.error('Failed to copy share text to clipboard', err);
    return false;
  }
}

/**
 * Triggers native device share sheet if supported (mobile browsers, etc.)
 */
export async function triggerNativeShare(course: Course): Promise<boolean> {
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: course.title,
        text: getCourseShareText(course),
        url: getCourseShareUrl(course.id),
      });
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed or dismissed:', err);
      }
      return false;
    }
  }
  return false;
}
