import { Course, Seminar, Testimonial, FAQ, FeatureItem } from './types';

// Let's import the actual generated images
import heroBanner from './assets/images/hero_nutrition_banner_1783175357872.jpg';
import classroomSeminarImg from './assets/images/classroom_seminar_1783175376672.jpg';
import graduationWorkshopImg from './assets/images/nutritionist_workshop_1783175413017.jpg';
import courseThumbnailImg from './assets/images/course_thumbnail_1783175481540.jpg';

export const HERO_IMAGE = heroBanner;
export const SEMINAR_VIDEO_PLACEHOLDER = classroomSeminarImg;
export const WORKSHOP_MAIN_IMAGE = graduationWorkshopImg;

export const FEATURES: FeatureItem[] = [
  {
    id: 'f1',
    title: 'প্রশিক্ষণ নিন',
    description: 'পেশাগত দক্ষতা বাড়াতে প্রশিক্ষণের বিকল্প নেই। প্রশিক্ষণ নিয়ে সময়ের সাথে সাথে নিজেকে প্রস্তুত রাখুন।',
    iconName: 'GraduationCap'
  },
  {
    id: 'f2',
    title: 'রিসার্চ এন্ড পাবলিকেশনস',
    description: 'যে প্রয়োজনই হোক, আমাদের সার্টিফাইড Nutritionists প্রস্তুত আপনার পাশে সব সময় পরামর্শ ও গবেষণায় সাহায্য করতে।',
    iconName: 'BookOpen'
  },
  {
    id: 'f3',
    title: 'ডায়েট কন্সাল্টেশন',
    description: 'আপনার স্বাস্থ্য আলাদা—তাই আপনার ডায়েটও আলাদা হওয়া উচিত। সঠিক পরিকল্পনা অনুযায়ী আপনার পুষ্টির চাহিদা পূরণ করুন।',
    iconName: 'Activity'
  }
];

export const ABOUT_FEATURES = [
  {
    id: 'af1',
    title: 'অনলাইন কোর্স',
    description: 'কর্মব্যস্ততা, দেশি-বিদেশি প্রশিক্ষকদের অভিজ্ঞতা বিবেচনায় রেখে অনলাইনে আমাদের কোর্সগুলো বেশ জনপ্রিয়তা অর্জন করেছে।'
  },
  {
    id: 'af2',
    title: 'অফলাইন কোর্স',
    description: 'বিশেষ পরিস্থিতি এবং শিক্ষার্থীদের চাহিদা ও সুবিধার কথা বিবেচনা করে অফলাইনে হ্যান্ডস-অন প্রশিক্ষণের আয়োজন করা হয়ে থাকে।'
  },
  {
    id: 'af3',
    title: 'সেমিনার-ওয়ার্কশপ',
    description: 'দেশী-বিদেশী প্রশিক্ষক ও পেশাজীবীদের জ্ঞানের আদান-প্রদানে প্রায় প্রতি বছরই পুষ্টি সংক্রান্ত নানা সেমিনার ও ওয়ার্কশপের আয়োজন করা হয়।'
  }
];

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'সার্টিফিকেট কোর্স - ক্লিনিক্যাল নিউট্রিশন এন্ড ডায়েটেটিক্স (সিসিএনডি)',
    duration: '২ মাস (2 Months)',
    liveClasses: 16,
    recordedClasses: 1,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ৪০ ঘণ্টা',
    price: 12000,
    originalPrice: 15000,
    image: courseThumbnailImg,
    category: 'Clinical Nutrition',
    rating: 4.9,
    reviewsCount: 320,
    description: 'ক্লিনিক্যাল ক্যারিয়ার গঠনে দেশের সবচাইতে কার্যকরী ও সমৃদ্ধ ব্যবহারিক পাঠ্যক্রম সমৃদ্ধ কোর্স। বাস্তবধর্মী কেস স্টাডি ও অভিজ্ঞ পুষ্টিবিদদের নির্দেশনায় সরাসরি শিখুন।',
    seatsLeft: 8,
    startDate: '১৫ জুলাই, ২০২৬'
  },
  {
    id: 'c2',
    title: 'অ্যাডভান্সড স্পোর্টস নিউট্রিশন অ্যান্ড পারফরম্যান্স',
    duration: '৩ মাস (3 Months)',
    liveClasses: 24,
    recordedClasses: 2,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ৪৮ ঘণ্টা',
    price: 16000,
    originalPrice: 20000,
    image: heroBanner, // Reusing high-quality asset
    category: 'Sports Nutrition',
    rating: 4.8,
    reviewsCount: 145,
    description: 'অ্যাথলেট ও ক্রীড়াবিদদের খাদ্যতালিকা প্রণয়ন, ক্যালরি পরিমাপ এবং স্পোর্টস পারফরম্যান্স বুস্ট করার জন্য বৈজ্ঞানিক ডায়েট গাইডলাইন।',
    seatsLeft: 12,
    startDate: '০১ আগস্ট, ২০২৬'
  },
  {
    id: 'c3',
    title: 'ম্যাটারনাল অ্যান্ড চাইল্ড নিউট্রিশন মাস্টারক্লাস',
    duration: '৬ সপ্তাহ (6 Weeks)',
    liveClasses: 12,
    recordedClasses: 1,
    orientation: 1,
    exams: 1,
    classDuration: '১.৫ ঘণ্টা করে মোট ২০ ঘণ্টা',
    price: 8000,
    originalPrice: 10000,
    image: classroomSeminarImg, // Reusing classroom seminar image
    category: 'Child Nutrition',
    rating: 5.0,
    reviewsCount: 98,
    description: 'গর্ভকালীন পুষ্টি এবং শিশুর জন্মের পর প্রথম ১০০০ দিনের পুষ্টি চাহিদা পূরণ ও পথ্য পরিকল্পনা নিয়ে বিশেষায়িত কোর্স।',
    seatsLeft: 5,
    startDate: '২০ জুলাই, ২০২৬'
  }
];

export const WHY_CHOOSE_US_POINTS = [
  {
    id: 'w1',
    title: 'দেশি বিদেশি প্রশিক্ষক',
    description: 'দেশ-বিদেশের অভিজ্ঞ ক্লিনিক্যাল পুষ্টিবিদ ও শিক্ষকদের সরাসরি তত্ত্বাবধান এবং দীর্ঘদিনের মাঠপর্যায়ের অভিজ্ঞতা অর্জনের সুযোগ।'
  },
  {
    id: 'w2',
    title: 'বিশেষজ্ঞ পুষ্টিবিদের পরামর্শ',
    description: 'চিকিৎসা মানেই শুধু ঔষধ নয়, বরং সুস্থ থাকার জন্য BADN রেজিস্টার্ড পুষ্টিবিদের পরামর্শের সুযোগ পাবেন সরাসরি।'
  },
  {
    id: 'w3',
    title: 'কার্যকরী প্রশিক্ষণ',
    description: 'জটিল ও সূক্ষ্ম ক্লিনিক্যাল বিষয়গুলোকে সহজ ও বাস্তবসম্মত কেস স্টাডির মাধ্যমে উপস্থাপন ও হাতে-কলমে শেখার প্ল্যাটফর্ম।'
  },
  {
    id: 'w4',
    title: 'মানের প্রশ্নে আপোষহীন',
    description: 'সিলেবাস প্রণয়ন থেকে শুরু করে প্রশিক্ষণ পরিচালনা এবং সার্টিফিকেশন প্রতিটি ধাপে আন্তর্জাতিক মান বজায় রাখতে আমরা বদ্ধপরিকর।'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'জিন্নাতুল জাহরা ঐশী',
    role: 'নিউট্রিয়াম গ্র্যাজুয়েট ও পুষ্টিবিদ',
    feedback: 'একাডেমিক পড়াশোনায় যে ঘাটতিগুলো ছিলো, কোর্স করার ফলে সেগুলো অনেকটাই পূরণ হয়েছে। নিজের মধ্যে কনফিডেন্স এসেছে, জানার আগ্রহ আরও বেড়েছে। BADN কে ধন্যবাদ এই অসাধারণ কোর্সটি আয়োজন করার জন্য।',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 5
  },
  {
    id: 't2',
    name: 'আফরিনা শারমিন তনা',
    role: 'ক্লিনিক্যাল ডায়েটেশিয়ান',
    feedback: 'খাদ্য ও পুষ্টি বিজ্ঞানের ছাত্রী হিসেবে পুষ্টি বিষয়ে গভীরভাবে শেখার ইচ্ছা ছিল। BADN-এর CCND কোর্স সেই ইচ্ছাকে আরও উজ্জীবিত করেছে। দেশের ও দেশের বাইরে স্বনামধন্য পুষ্টিবিদদের কাছ থেকে নতুন বিষয় শিখার সুযোগ পেয়েছি। বিশেষ ধন্যবাদ জানাই সাজেদা আপুকে, যিনি কঠিন বিষয়গুলোও সহজভাবে শেখান।',
    image: 'https://images.unsplash.com/photo-1594744803329-e58b31de215f?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 5
  },
  {
    id: 't3',
    name: 'ইসরাত জাহান প্রিয়ানা',
    role: 'জুনিয়র নিউট্রিশন কনসালটেন্ট',
    feedback: 'আমি অনেক সিনিয়রদের কাছ থেকে CCND কোর্সের কথা শুনেছিলাম। এনরোল করার পর বুঝতে পারি, বাংলাদেশে এমন সুন্দর, ইনফরমেটিভ এবং হাই লেভেলের কোর্স পাওয়া দুষ্কর। কোর্সের স্টাডি ম্যাটেরিয়ালস খুবই কার্যকরী। ইন্টার্ন নিউট্রিশনিস্ট হিসেবে প্রাকটিক্যাল নলেজ কাজে লাগাতে পেরেছি। জ্যোতি আপু খুবই নলেজেবল এবং বন্ধুবৎসল!',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    rating: 5
  }
];

export const SEMINARS: Seminar[] = [
  {
    id: 's1',
    title: 'ক্রিটিক্যাল কেয়ার নিউট্রিশন নিয়ে আন্তর্জাতিক সেমিনার',
    organization: 'BADN ইন্টারন্যাশনাল',
    description: 'BADN এর উদ্যোগে ঢাকার বারডেম হাসপাতালে সফলভাবে অনুষ্ঠিত হয় International Workshop on Critical Care Nutrition। ভারতের প্রখ্যাত ডায়েটেটিশিয়ান সাংহামিত্রা চক্রবর্তী (HOD, Nutrition & Dietetics, Medica Superspecialty Hospital, কলকাতা) কর্মশালাটি পরিচালনা করেন। এতে নিউট্রিশনিস্ট, ডায়েটেটিশিয়ান, চিকিৎসকসহ বিভিন্ন স্বাস্থ্য পেশাজীবীরা অংশ নেন।',
    expertName: 'সাংহামিত্রা চক্রবর্তী',
    expertRole: 'HOD, Nutrition & Dietetics, Medica Hospital, কলকাতা',
    date: '১৮ এপ্রিল, ২০১৮ (Apr 18, 2018)',
    location: 'বারডেম হাসপাতাল অডিটোরিয়াম, ঢাকা',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: 's2',
    title: 'জিনোমিক্স এন্ড নিউট্রিজেনেটিক্স বিষয়ে আন্তর্জাতিক সেমিনার',
    organization: 'BADN ও Institute of Nutrigenetics, India',
    description: 'ঢাকায় বাংলাদেশে প্রথমবার “International Workshop on Understanding Nutrigenetics: The Science behind Personalized Nutrition” সফলভাবে অনুষ্ঠিত হয়। কর্মশালাটি Institute of Nutrigenetics, India কর্তৃক সার্টিফাইড ছিল এবং পার্সোনালাইজড ডায়েট ডিজাইনের ওপর গুরুত্বপূর্ণ আলোচনা করা হয়।',
    expertName: 'ড. অশোক কুমার',
    expertRole: 'গবেষক, নিউট্রিজেনেটিক্স ইনস্টিটিউট',
    date: '১৮ এপ্রিল, ২০১৮ (Apr 18, 2018)',
    location: 'প্যান প্যাসিফিক সোনারগাঁও, ঢাকা',
    image: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: 's3',
    title: 'স্পোর্টস নিউট্রিশন বিষয়ে আন্তর্জাতিক সেমিনার',
    organization: 'BADN স্পোর্টস উইং',
    description: 'ঢাকায় ৩ দিনব্যাপী “International Workshop on Sports Nutrition” সফলভাবে অনুষ্ঠিত হয়। কর্মশালাটি পরিচালনা করেন ভারতের প্রখ্যাত স্পোর্টস নিউট্রিশন বিশেষজ্ঞ মিসেস রাশমি চেরিয়ান, RD। অ্যাথলেটদের পুষ্টি চাহিদা এবং সাপ্লিমেন্টের সঠিক ব্যবহার নিয়ে বিস্তারিত গাইড প্রদান করা হয়।',
    expertName: 'মিসেস রাশমি চেরিয়ান',
    expertRole: 'রেজিস্টার্ড ডায়েটেশিয়ান (RD), স্পোর্টস পুষ্টিবিদ',
    date: '১৮ এপ্রিল, ২০১৮ (Apr 18, 2018)',
    location: 'কমনওয়েলথ অডিটোরিয়াম, ঢাকা',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800&h=450'
  }
];

export const FAQS: FAQ[] = [
  {
    id: 'faq1',
    question: 'BADN কী ধরনের প্রতিষ্ঠান?',
    answer: 'বাংলাদেশ একাডেমী অব ডায়েটেটিক্স এন্ড নিউট্রিশন (BADN) দেশে পুষ্টিবিদ ও ডায়েটেশিয়ানদের পুষ্টিসংক্রান্ত পেশাগত দক্ষতা বৃদ্ধির সবচেয়ে বড় এবং বিশ্বস্ত শিক্ষা ও প্রশিক্ষণ প্রদানকারী প্রতিষ্ঠান।'
  },
  {
    id: 'faq2',
    question: 'BADN কি সরকারি নিবন্ধিত?',
    answer: 'হ্যাঁ, BADN একটি সরকারিভাবে অনুমোদিত এবং নিবন্ধিত অলাভজনক পেশাজীবী প্রশিক্ষণ ও শিক্ষা একাডেমী যা বাংলাদেশে পুষ্টি ও ডায়েটেটিক্স শিক্ষার মানোন্নয়নে কাজ করে যাচ্ছে।'
  },
  {
    id: 'faq3',
    question: 'কোর্স করলে কি চাকরির সুযোগ পাওয়া যায়?',
    answer: 'আমাদের কোর্সগুলো অত্যন্ত বাস্তবমুখী ও ব্যবহারিক জ্ঞানভিত্তিক। দেশের প্রায় সকল কর্পোরেট হাসপাতাল এবং ডায়েট সেন্টারে BADN-এর প্রশিক্ষণপ্রাপ্ত পুষ্টিবিদ ও ডায়েটেশিয়ানগণ অত্যন্ত সফলভাবে এবং সুনামের সাথে কাজ করছেন।'
  },
  {
    id: 'faq4',
    question: 'BADN এর সার্টিফিকেট কি আন্তর্জাতিকভাবে স্বীকৃত?',
    answer: 'হ্যাঁ, আমাদের সার্টিফিকেট কোর্সগুলোর সিলেবাস আন্তর্জাতিক মানের এবং দেশ-বিদেশের অনেক স্বনামধন্য বিশেষজ্ঞদের মাধ্যমে প্রশিক্ষণের আয়োজন করা হয়ে থাকে, যা ক্যারিয়ার গঠনে সহায়ক ও সমাদৃত।'
  },
  {
    id: 'faq5',
    question: 'প্রশিক্ষক কারা?',
    answer: 'প্রশিক্ষক হিসেবে দায়িত্ব পালন করেন দেশ-বিদেশের অভিজ্ঞ ক্লিনিক্যাল পুষ্টিবিদ, ডায়েটেশিয়ান, গবেষক এবং স্বনামধন্য চিকিৎসাবিদগণ।'
  },
  {
    id: 'faq6',
    question: 'কে আবেদন করতে পারবেন?',
    answer: 'খাদ্য ও পুষ্টি বিজ্ঞান, হোম ইকোনমিক্স, নার্সিং, লাইফ সায়েন্স বা মেডিকেল ব্যাকগ্রাউন্ডের শিক্ষার্থী ও পেশাজীবীগণ আমাদের কোর্সগুলোতে অংশ নিতে পারবেন।'
  }
];
