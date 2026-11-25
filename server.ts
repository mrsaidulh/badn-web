import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const portArgIndex = process.argv.indexOf('--port');
const cliPort = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : NaN;
const PORT = !isNaN(cliPort) ? cliPort : (Number(process.env.PORT) || 3000);

const hostArgIndex = process.argv.indexOf('--host');
const cliHost = hostArgIndex !== -1 ? process.argv[hostArgIndex + 1] : undefined;
const HOST = cliHost || process.env.HOST || "0.0.0.0";

// Database connection pool (lazy initialized)
let pool: mysql.Pool | null = null;
let dbInitializationPromise: Promise<mysql.Pool | null> | null = null;

async function getDbPool() {
  if (pool) return pool;
  if (dbInitializationPromise) return dbInitializationPromise;

  dbInitializationPromise = (async () => {
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASSWORD;
    const database = process.env.DB_NAME || 'badn_db';
    const port = parseInt(process.env.DB_PORT || '3306', 10);

    if (!host) {
      console.warn('⚠️ DB_HOST environment variable is not defined. Using client-side LocalStorage fallback for demo/development.');
      return null;
    }

    try {
      // Connect without a database first, to ensure database existence
      const tempConnection = await mysql.createConnection({
        host,
        user,
        password,
        port
      });

      console.log(`📡 Connected to MySQL server at ${host}:${port}. Checking database "${database}"...`);
      await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
      await tempConnection.end();

      // Create the connection pool with the selected database
      const newPool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });

      // Automatically create tables if they do not exist
      await initializeTables(newPool);

      pool = newPool;
      return pool;
    } catch (error: any) {
      console.error('❌ Failed to connect or initialize MySQL database:', error.message);
      pool = null;
      dbInitializationPromise = null; // Reset so that next request can retry if failed
      return null;
    }
  })();

  return dbInitializationPromise;
}

export const DEFAULT_COURSES = [
  {
    id: 'c1',
    title: 'সার্টিফিকেট কোর্স ইন ক্লিনিক্যাল নিউট্রিশন অ্যান্ড ডায়েটেটিক্স (CCND)',
    duration: '২ মাস (2 Months)',
    liveClasses: 16,
    recordedClasses: 1,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ৪০ ঘণ্টা',
    price: 12000.00,
    originalPrice: 15000.00,
    image: 'https://i.ibb.co.com/VYhH9KGM/CCND.jpg',
    category: 'Clinical Nutrition',
    rating: 4.9,
    reviewsCount: 320,
    description: 'ক্লিনিক্যাল ক্যারিয়ার গঠনে দেশের সবচাইতে কার্যকরী ও সমৃদ্ধ ব্যবহারিক পাঠ্যক্রম সমৃদ্ধ কোর্স। বাস্তবধর্মী কেস স্টাডি ও অভিজ্ঞ পুষ্টিবিদদের নির্দেশনায় সরাসরি শিখুন।',
    seatsLeft: 8,
    startDate: '১৫ জুলাই, ২০২৬'
  },
  {
    id: 'c4',
    title: 'সার্টিফিকেট কোর্স ইন রেনাল নিউট্রিশন (CRN)',
    duration: '১ মাস (1 Month)',
    liveClasses: 6,
    recordedClasses: 2,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ৪০ ঘণ্টা',
    price: 5000.00,
    originalPrice: 8000.00,
    image: 'https://i.ibb.co.com/4RVL9YLF/Renal-Nutrition.jpg',
    category: 'Renal Nutrition',
    rating: 4.9,
    reviewsCount: 164,
    description: 'সিকেডি (CKD) স্টেজ ১-৫, ডায়ালাইসিস ও কিডনি ট্রান্সপ্লান্ট রোগীদের প্রোটিন, সোডিয়াম, পটাসিয়াম ও ফ্লুইড ক্যালকুলেশন নিয়ে আন্তর্জাতিক মানের ব্যবহারিক কোর্স।',
    seatsLeft: 6,
    startDate: '২৫ জুলাই, ২০২৬'
  },
  {
    id: 'c5',
    title: 'সার্টিফিকেট কোর্স ইন অনকো-নিউট্রিশন (CON)',
    duration: '১ মাস (1 Month)',
    liveClasses: 6,
    recordedClasses: 2,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ৫০ ঘণ্টা',
    price: 5000.00,
    originalPrice: 8000.00,
    image: 'https://i.ibb.co.com/wZMQhYgz/Onco-Nutrition.png',
    category: 'Onco Nutrition',
    rating: 5.0,
    reviewsCount: 112,
    description: 'ক্যান্সার রোগীদের কেমোথেরাপি ও রেডিওথেরাপির সময় টিউমার মেটাবলিজম, অ্যানোরেক্সিয়া-ক্যাচেক্সিয়া সিন্ড্রোম ও ইমিউনোনিউট্রিশন সাপোর্টের ওপর বিশেষায়িত কোর্স।',
    seatsLeft: 4,
    startDate: '১০ আগস্ট, ২০২৬'
  },
  {
    id: 'c6',
    title: 'সার্টিফিকেট কোর্স ইন ক্রিটিক্যাল কেয়ার নিউট্রিশন (CCN)',
    duration: '১ মাস (1 Month)',
    liveClasses: 6,
    recordedClasses: 2,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ৪৫ ঘণ্টা',
    price: 5000.00,
    originalPrice: 8000.00,
    image: 'https://i.ibb.co.com/chWrS0Qb/10.png',
    category: 'Critical Care Nutrition',
    rating: 4.9,
    reviewsCount: 188,
    description: 'আইসিইউ ও এইচডিইউতে ভেন্টিলেশন, সেপসিস ও ট্রমা রোগীদের এন্টারাল ও প্যারেন্টেরাল নিউট্রিশন (EN & TPN), ইলেকট্রোলাইট ও মেটাবলিক ব্যালেন্সিং নিয়ে স্পেশালাইজড কোর্স।',
    seatsLeft: 7,
    startDate: '০৫ আগস্ট, ২০২৬'
  },
  {
    id: 'c3',
    title: 'সার্টিফিকেট কোর্স ইন চাইল্ড নিউট্রিশন (CN)',
    duration: '১ মাস (1 Month)',
    liveClasses: 6,
    recordedClasses: 1,
    orientation: 1,
    exams: 1,
    classDuration: '১.৫ ঘণ্টা করে মোট ২০ ঘণ্টা',
    price: 3500.00,
    originalPrice: 6000.00,
    image: 'https://i.ibb.co.com/6J49g293/11.png',
    category: 'Child Nutrition',
    rating: 5.0,
    reviewsCount: 98,
    description: 'গর্ভকালীন পুষ্টি এবং শিশুর জন্মের পর প্রথম ১০০০ দিনের পুষ্টি চাহিদা পূরণ ও পথ্য পরিকল্পনা নিয়ে বিশেষায়িত কোর্স।',
    seatsLeft: 5,
    startDate: '২০ জুলাই, ২০২৬'
  },
  {
    id: 'c2',
    title: 'সার্টিফিকেট কোর্স ইন স্পোর্টস নিউট্রিশন (CSN)',
    duration: '১ মাস (1 Month)',
    liveClasses: 6,
    recordedClasses: 2,
    orientation: 1,
    exams: 2,
    classDuration: '২ ঘণ্টা করে মোট ১২ ঘণ্টা',
    price: 5000.00,
    originalPrice: 8000.00,
    image: 'https://i.ibb.co.com/1JtL1f2B/Sports-Nutrition.jpg',
    category: 'Sports Nutrition',
    rating: 4.8,
    reviewsCount: 145,
    description: 'অ্যাথলেট ও ক্রীড়াবিদদের খাদ্যতালিকা প্রণয়ন, ক্যালরি পরিমাপ এবং স্পোর্টস পারফরম্যান্স বুস্ট করার জন্য বৈজ্ঞানিক ডায়েট গাইডলাইন।',
    seatsLeft: 12,
    startDate: '০১ আগস্ট, ২০২৬'
  }
];

export const DEFAULT_SEMINARS = [
  {
    id: 's1',
    title: 'ক্রিটিক্যাল কেয়ার নিউট্রিশন নিয়ে আন্তর্জাতিক সেমিনার',
    organization: 'BADN ইন্টারন্যাশনাল',
    description: 'BADN এর উদ্যোগে ঢাকার বারডেম হাসপাতালে সফলভাবে অনুষ্ঠিত হয় International Workshop on Critical Care Nutrition। ভারতের প্রখ্যাত ডায়েটেটিশিয়ান সাংহামিত্রা চক্রবর্তী (HOD, Nutrition & Dietetics, Medica Superspecialty Hospital, কলকাতা) কর্মশালাটি পরিচালনা করেন। এতে নিউট্রিশনিস্ট, ডায়েটেটিশিয়ান, চিকিৎসকসহ বিভিন্ন স্বাস্থ্য পেশাজীবীরা অংশ নেন।',
    expertName: 'সাংহামিত্রা চক্রবর্তী',
    expertRole: 'HOD, Nutrition & Dietetics, Medica Hospital, কলকাতা',
    date: '১৮ এপ্রিল, ২০১৮ (Apr 18, 2018)',
    location: 'বারডেম হাসপাতাল অডিটোরিয়াম, ঢাকা',
    image: 'https://i.ibb.co.com/v62LhVDm/Critical-Care-International-Seminar.jpg'
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
    image: 'https://i.ibb.co.com/FLN94kyk/gynomix-and-nutrigenix.jpg'
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
    image: 'https://i.ibb.co.com/qYVdj7pr/Sports-Nutritions.jpg'
  },
  {
    id: 's4',
    title: 'রিসার্চ, ইনোভেশন অ্যান্ড সাসটেইনেবল ডেভেলপমেন্ট সেমিনার',
    organization: 'BADN একাডেমি উইং',
    description: 'পুষ্টিবিজ্ঞানে আধুনিক গবেষণা পদ্ধতি, কমিউনিটি এঙ্গেজমেন্ট এবং গবেষণালব্ধ জ্ঞানের বাস্তব প্রয়োগ নিয়ে অনুষ্ঠিত হয় এই ন্যাশনাল সেমিনার। দেশের প্রখ্যাত গবেষক ও পুষ্টিবিদরা এতে অংশ নিয়ে তথ্য উপস্থাপন করেন।',
    expertName: 'প্রফেসর শাহনীন আহমেদ',
    expertRole: 'সাবেক অধ্যক্ষ ও পুষ্টিবিদ, হোম ইকনোমিক্স কলেজ',
    date: '১২ নভেম্বর, ২০২৩ (Nov 12, 2023)',
    location: 'কৃষিবিদ ইনস্টিটিউশন বাংলাদেশ (KIB), ঢাকা',
    image: '/seminar-user-5.jpg'
  },
  {
    id: 's5',
    title: 'ওয়ার্কশপ অন নিউট্রিশনাল সাপ্লিমেন্ট অ্যান্ড পাবলিক হেলথ',
    organization: 'BADN ও ফার্মাসিউটিক্যাল সায়েন্সেস',
    description: 'ডায়েটেশিয়ান ও ক্লিনিক্যাল প্র্যাকটিশনারদের জন্য নিউট্রাসিউটিক্যালস এবং ভিটামিন-মিনারেল সাপ্লিমেন্টের সঠিক ক্লিনিক্যাল প্রয়োগ ও সেফটি প্রোটোকলের ওপর আয়োজিত বিশেষায়িত কর্মশালা।',
    expertName: 'সাংহামিত্রা চক্রবর্তী ও ডা. মো. আদিত মুকতাদির',
    expertRole: 'ক্লিনিক্যাল নিউট্রিশনিস্ট ও সিনিয়র গবেষক',
    date: '১৭ মার্চ, ২০২৩ (Mar 17, 2023)',
    location: 'খামারবাড়ি মিল্কি অডিটোরিয়াম, ঢাকা',
    image: '/seminar-user-6.jpg'
  },
  {
    id: 's6',
    title: 'ন্যাশনাল কনফারেন্স অন ক্লিনিক্যাল নিউট্রিশন অ্যান্ড ডায়েটেটিক্স',
    organization: 'বাংলাদেশ একাডেমি অব ডায়েটেটিক্স অ্যান্ড নিউট্রিশন',
    description: 'সারাদেশের ক্লিনিক্যাল ডায়েটেশিয়ান, ইন্টার্ন এবং পুষ্টি শিক্ষার্থীদের অংশগ্রহণে পেশাগত স্বীকৃতি, ক্লিনিক্যাল কেস অ্যানালাইসিস এবং আধুনিক ডায়েট প্ল্যানিং নিয়ে জাতীয় সম্মেলন।',
    expertName: 'ডায়েটেশিয়ান সাজেদা কাশেম জ্যোতি',
    expertRole: 'প্রধান পুষ্টিবিদ ও প্রতিষ্ঠাতা, BADN',
    date: '০৫ জানুয়ারি, ২০২৪ (Jan 05, 2024)',
    location: 'আইডিইবি অডিটোরিয়াম, কাকরাইল, ঢাকা',
    image: '/first-main.jpg'
  }
];

export async function syncDefaultCourses(dbPool: mysql.Pool) {
  for (const course of DEFAULT_COURSES) {
    const [existing]: any = await dbPool.query('SELECT id FROM courses WHERE id = ?', [course.id]);
    if (existing.length === 0) {
      await dbPool.query(
        `INSERT INTO courses (id, title, duration, liveClasses, recordedClasses, orientation, exams, classDuration, price, originalPrice, image, category, rating, reviewsCount, description, seatsLeft, startDate) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          course.id, course.title, course.duration, course.liveClasses, course.recordedClasses,
          course.orientation, course.exams, course.classDuration, course.price, course.originalPrice,
          course.image, course.category, course.rating, course.reviewsCount, course.description,
          course.seatsLeft, course.startDate
        ]
      );
    } else {
      await dbPool.query(
        'UPDATE courses SET title = ?, duration = ?, liveClasses = ?, image = ?, price = ?, originalPrice = ? WHERE id = ?',
        [course.title, course.duration, course.liveClasses, course.image, course.price, course.originalPrice, course.id]
      );
    }
  }
}

export async function syncDefaultSeminars(dbPool: mysql.Pool) {
  for (const seminar of DEFAULT_SEMINARS) {
    const [existing]: any = await dbPool.query('SELECT id FROM seminars WHERE id = ?', [seminar.id]);
    if (existing.length === 0) {
      await dbPool.query(
        `INSERT INTO seminars (id, title, organization, description, expertName, expertRole, date, location, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seminar.id, seminar.title, seminar.organization, seminar.description,
          seminar.expertName, seminar.expertRole, seminar.date, seminar.location, seminar.image
        ]
      );
    } else {
      await dbPool.query('UPDATE seminars SET image = ? WHERE id = ?', [seminar.image, seminar.id]);
    }
  }
}

async function initializeTables(dbPool: mysql.Pool) {
  console.log('📦 Verifying and synchronizing database tables & default records...');
  
  // Users Table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Courses Table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS courses (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      duration VARCHAR(100),
      liveClasses INT,
      recordedClasses INT,
      orientation INT,
      exams INT,
      classDuration VARCHAR(100),
      price DECIMAL(10, 2),
      originalPrice DECIMAL(10, 2),
      image TEXT,
      category VARCHAR(100),
      rating DECIMAL(3, 2),
      reviewsCount INT,
      description TEXT,
      seatsLeft INT,
      startDate VARCHAR(100)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seminars Table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS seminars (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      organization VARCHAR(255),
      description TEXT,
      expertName VARCHAR(255),
      expertRole VARCHAR(255),
      date VARCHAR(100),
      location VARCHAR(255),
      image TEXT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Testimonials Table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(255),
      feedback TEXT,
      image TEXT,
      rating INT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Enrollments table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS enrollments (
      id VARCHAR(50) PRIMARY KEY,
      courseId VARCHAR(50) NOT NULL,
      courseTitle VARCHAR(255) NOT NULL,
      studentName VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      background VARCHAR(255),
      paymentMethod VARCHAR(50),
      note TEXT,
      price DECIMAL(10, 2),
      status VARCHAR(50) DEFAULT 'Pending',
      date VARCHAR(50)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seminar registrations table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS seminar_registrations (
      id VARCHAR(50) PRIMARY KEY,
      seminarId VARCHAR(50) NOT NULL,
      seminarTitle VARCHAR(255) NOT NULL,
      studentName VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255),
      profession VARCHAR(255),
      status VARCHAR(50) DEFAULT 'Registered',
      date VARCHAR(50)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Certificates table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS certificates (
      id VARCHAR(50) PRIMARY KEY,
      studentName VARCHAR(255) NOT NULL,
      courseTitle VARCHAR(255) NOT NULL,
      issueDate VARCHAR(100) NOT NULL,
      status VARCHAR(50) DEFAULT 'Active',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default certificates if empty
  const [certCountRows]: any = await dbPool.query('SELECT COUNT(*) as count FROM certificates');
  if (certCountRows[0].count === 0) {
    await dbPool.query(
      `INSERT INTO certificates (id, studentName, courseTitle, issueDate, status) VALUES 
       ('BADN-2026-1001', 'Zinnatul Zahra Oishe', 'Certificate Course in Clinical Nutrition & Dietetics (CCND)', 'July 05, 2026', 'Active'),
       ('BADN-2026-1002', 'Afrina Sharmin Tona', 'Certificate Course in Clinical Nutrition & Dietetics (CCND)', 'July 05, 2026', 'Active')`
    );
  } else {
    // If the database has records but they contain Bengali names, update them so the default is fully English
    await dbPool.query(
      `UPDATE certificates SET studentName = 'Zinnatul Zahra Oishe', courseTitle = 'Certificate Course in Clinical Nutrition & Dietetics (CCND)', issueDate = 'July 05, 2026' WHERE id = 'BADN-2026-1001' AND studentName LIKE '%জি%'`
    );
    await dbPool.query(
      `UPDATE certificates SET studentName = 'Afrina Sharmin Tona', courseTitle = 'Certificate Course in Clinical Nutrition & Dietetics (CCND)', issueDate = 'July 05, 2026' WHERE id = 'BADN-2026-1002' AND studentName LIKE '%আ%'`
    );
  }

  // Contact inquiries table
  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id VARCHAR(50) PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255),
      email VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      date VARCHAR(50)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // Seed default admin/instructor if users empty
  const [userRows]: any = await dbPool.query('SELECT COUNT(*) as count FROM users');
  if (userRows[0].count === 0) {
    const adminId = 'usr_' + Date.now();
    await dbPool.query(
      `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
      [adminId, 'saidulgmac@gmail.com', 'Password123!', 'Sajeda Kashem Jyoti', 'instructor']
    );
  }

  // Synchronize default courses (safely inserts any missing courses)
  await syncDefaultCourses(dbPool);

  // Synchronize default seminars (safely inserts any missing seminars)
  await syncDefaultSeminars(dbPool);

  // Seed / sync default testimonials
  const defaultTestimonials = [
    {
      id: 't1',
      name: 'জিন্নাতুল জাহরা ঐশী',
      role: 'পুষ্টিবিদ',
      feedback: 'একাডেমিক পড়াশোনায় যে ঘাটতিগুলো ছিলো, কোর্স করার ফলে সেগুলো অনেকটাই পূরণ হয়েছে। নিজের মধ্যে কনফিডেন্স এসেছে, জানার আগ্রহ আরও বেড়েছে। BADN কে ধন্যবাদ এই অসাধারণ কোর্সটি আয়োজন করার জন্য।',
      image: '/assets/aistudio/_______________________________ebc64f5f.jpeg',
      rating: 5
    },
    {
      id: 't2',
      name: 'আফরিনা শারমিন তৃনা',
      role: 'ডায়েটিশিয়ান, প্রাভা হেলথ্ কেয়ার',
      feedback: 'খাদ্য ও পুষ্টি বিজ্ঞানের ছাত্রী হিসেবে পুষ্টি বিষয়ে গভীরভাবে শেখার ইচ্ছা ছিল। BADN-এর CCND কোর্স সেই ইচ্ছাকে আরও উজ্জীবিত করেছে। দেশের ও দেশের বাইরে স্বনামধন্য পুষ্টিবিদদের কাছ থেকে নতুন বিষয় শিখার সুযোগ পেয়েছি। বিশেষ ধন্যবাদ জানাই সাজেদা আপুকে, যিনি কঠিন বিষয়গুলোও সহজভাবে শেখান।',
      image: '/assets/aistudio/____________________________________________________90fcf9c1.jpeg',
      rating: 5
    },
    {
      id: 't3',
      name: 'ইসরাত জাহান প্রিয়ানা',
      role: 'নিউট্রিশন এন্ড ডায়েট কনসালটেন্ট, গ্রীন ফার্টিলিটি কেয়ার',
      feedback: 'আমি অনেক সিনিয়রদের কাছ থেকে CCND কোর্সের কথা শুনেছিলাম। এনরোল করার পর বুঝতে পারি, বাংলাদেশে এমন সুন্দর, ইনফরমেটিভ এবং হাই লেভেলের কোর্স পাওয়া দুষ্কর। কোর্সের স্টাডি ম্যাটেরিয়ালস খুবই কার্যকরী। ইন্টার্ন নিউট্রিশনিস্ট হিসেবে প্রাকটিক্যাল নলেজ কাজে লাগাতে পেরেছি। জ্যোতি আপু খুবই নলেজেবল এবং বন্ধুবৎসল!',
      image: '/assets/aistudio/______________________________________________________________________________284e9dfa.jpeg',
      rating: 5
    },
    {
      id: 't4',
      name: 'সায়কা শারমিন',
      role: 'নিউট্রিশনিস্ট ও ডেপুটি ম্যানেজার, আবুল খায়ের গ্রুপ',
      feedback: 'খুবই শিক্ষণীয় একটি কোর্স। এত সুন্দর ও গোছানোভাবে বিষয়গুলো উপস্থাপন করা হয়েছে যে, সত্যিকার অর্থেই সঠিকভাবে শেখার সুযোগ হয়েছে। এই কোর্স থেকে সার্টিফিকেট অর্জন করা আমার জন্য একটি বিরল অভিজ্ঞতা। তাই এই শিক্ষাটি আমার পেশাগত জীবনে অনেক কাজে লাগবে বলে আশা করছি।\n\nঅসাধারণ মেন্টর ও শিক্ষকের মাধ্যমে কোর্সটি পরিচালিত হয়েছে। যারা পুষ্টি সেক্টরে ক্যারিয়ার গড়তে চান, তাদের জন্য Clinical Nutrition & Dietetics কোর্সটি অত্যন্ত উপযোগী।\n\nধন্যবাদ BADN-কে এমন একটি সুন্দর ও মানসম্মত কোর্স আয়োজন করার জন্য।',
      image: '/assets/aistudio/Sayka_Sharmin_Review_8e06834b.jpeg',
      rating: 5
    },
    {
      id: 't5',
      name: 'মাইফুল নাহার সাজিন',
      role: 'ক্লিনিক্যাল ডায়েটিশিয়ান, সিএমএইচ, চট্টগ্রাম',
      feedback: 'আমি মাইফুল নাহার সাজিন। বর্তমানে ডায়েটিশিয়ান হিসেবে বাংলাদেশ আর্মি (CMH)-এ কর্মরত আছি।\n\nআমি গত ৩ বছর ধরে BADN-এর সঙ্গে যুক্ত আছি। BADN থেকে আমি রেনাল নিউট্রিশন এবং CCND কোর্স সম্পন্ন করেছি। পাশাপাশি বিভিন্ন সেমিনারেও অংশগ্রহণ করেছি। BADN-এ দেশ-বিদেশের স্বনামধন্য ফ্যাকাল্টি এবং ট্রেইনাররা ক্লাস নেন, যার মাধ্যমে কোর্সে অংশগ্রহণকারী সকলে উপকৃত হন। এখানে এমন অনেক খুঁটিনাটি বিষয় সম্পর্কে ধারণা পাওয়া যায়, যা শুধুমাত্র বই পড়ে শেখা সম্ভব নয়। BADN আমাকে আরও বেশি আত্মবিশ্বাসী হতে শিখিয়েছে, যা আমার কর্মক্ষেত্রে সফলতার সঙ্গে এগিয়ে যেতে সাহায্য করছে। আমি বর্তমানে আরও ২টি কোর্সে এনরোল করেছি এবং আশা করছি ভবিষ্যতেও তাদের আরও কোর্স করব।\n\nআমি BADN-এর উত্তরোত্তর সাফল্য কামনা করছি।\nধন্যবাদ BADN।',
      image: '/assets/aistudio/Sajin_CMH_Review_2fb8a74a.jpeg',
      rating: 5
    },
    {
      id: 't6',
      name: 'হাফছা ইয়াসমিন',
      role: 'ডায়েটিশিয়ান, এপোলো ইম্পেরিয়াল হসপিটাল, চট্টগ্রাম',
      feedback: 'BADN-এর কোর্সগুলো অত্যন্ত শিক্ষণীয় ও সুন্দরভাবে সাজানো। অভিজ্ঞ ফ্যাকাল্টিদের কাছ থেকে পুষ্টিবিজ্ঞান ও ডায়েটেটিক্স সম্পর্কে বাস্তবভিত্তিক জ্ঞান অর্জনের সুযোগ রয়েছে। যারা এই সেক্টরে ক্যারিয়ার গড়তে চান, তাদের জন্য BADN একটি চমৎকার প্ল্যাটফর্ম। আমি অনেকগুলো কোর্স সম্পন্ন করেছি এখানে, যা আমার পেশাগত জীবনে অনেক কাজে লেগেছে।\n\nBADN-এর উত্তরোত্তর সাফল্য কামনা করছি।',
      image: '/assets/aistudio/Hafsa_Yeasmin_Review_6164d7e5.jpeg',
      rating: 5
    }
  ];

  for (const test of defaultTestimonials) {
    const [existingTest]: any = await dbPool.query('SELECT id FROM testimonials WHERE id = ?', [test.id]);
    if (existingTest.length === 0) {
      await dbPool.query(
        `INSERT INTO testimonials (id, name, role, feedback, image, rating) VALUES (?, ?, ?, ?, ?, ?)`,
        [test.id, test.name, test.role, test.feedback, test.image, test.rating]
      );
    } else {
      await dbPool.query(
        `UPDATE testimonials SET name = ?, role = ?, feedback = ?, image = ? WHERE id = ?`,
        [test.name, test.role, test.feedback, test.image, test.id]
      );
    }
  }

  console.log('✅ Database tables initialized and auto-seeded successfully!');
}

// ==================== REST API ENDPOINTS ====================

// Check connection and database status
app.get('/api/db-status', async (req, res) => {
  const db = await getDbPool();
  if (db) {
    res.json({
      connected: true,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME || 'badn_db'
    });
  } else {
    res.json({
      connected: false,
      message: 'Using in-memory/client fallback because MySQL credentials are not supplied in .env'
    });
  }
});

// Enrollments Endpoints
app.get('/api/enrollments', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM enrollments ORDER BY date DESC, id DESC');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/enrollments', async (req, res) => {
  const db = await getDbPool();
  const { id, courseId, courseTitle, studentName, phone, email, background, paymentMethod, note, price, status, date } = req.body;
  
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query(
      `INSERT INTO enrollments (id, courseId, courseTitle, studentName, phone, email, background, paymentMethod, note, price, status, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, courseId, courseTitle, studentName, phone, email || null, background || null, paymentMethod || null, note || null, price || 0, status || 'Pending', date]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/enrollments/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  const { status } = req.body;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query('UPDATE enrollments SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/enrollments/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query('DELETE FROM enrollments WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Seminar Registrations Endpoints
app.get('/api/seminars', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM seminar_registrations ORDER BY date DESC, id DESC');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/seminars', async (req, res) => {
  const db = await getDbPool();
  const { id, seminarId, seminarTitle, studentName, phone, email, profession, date, status } = req.body;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query(
      `INSERT INTO seminar_registrations (id, seminarId, seminarTitle, studentName, phone, email, profession, status, date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, seminarId, seminarTitle, studentName, phone, email || null, profession || null, status || 'Registered', date]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/seminars/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  const { status } = req.body;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query('UPDATE seminar_registrations SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/seminars/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query('DELETE FROM seminar_registrations WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Contact Inquiries Endpoints
app.get('/api/inquiries', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM contact_messages ORDER BY date DESC, id DESC');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  const db = await getDbPool();
  const { id, firstName, lastName, email, message, date } = req.body;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query(
      `INSERT INTO contact_messages (id, firstName, lastName, email, message, date) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, firstName, lastName || null, email, message, date]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== CERTIFICATE VERIFICATION ENDPOINTS ====================

app.get('/api/certificates', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM certificates ORDER BY createdAt DESC');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/certificates/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows]: any = await db.query('SELECT * FROM certificates WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json({ success: true, source: 'database', data: rows[0] });
    } else {
      res.json({ success: false, message: 'Certificate not found' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/certificates', async (req, res) => {
  const db = await getDbPool();
  const { id, studentName, courseTitle, issueDate, status } = req.body;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query(
      `INSERT INTO certificates (id, studentName, courseTitle, issueDate, status) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE studentName = VALUES(studentName), courseTitle = VALUES(courseTitle), issueDate = VALUES(issueDate), status = VALUES(status)`,
      [id, studentName, courseTitle, issueDate, status || 'Active']
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/certificates/:id', async (req, res) => {
  const db = await getDbPool();
  const { id } = req.params;
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    await db.query('DELETE FROM certificates WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== DYNAMIC CONTENT ENDPOINTS ====================

// Courses
app.get('/api/courses', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: true, source: 'fallback', data: DEFAULT_COURSES });
  }
  try {
    let [rows]: any = await db.query("SELECT * FROM courses ORDER BY FIELD(id, 'c1', 'c4', 'c5', 'c6', 'c3', 'c2')");
    const existingIds = new Set(rows.map((r: any) => r.id));
    const missing = DEFAULT_COURSES.some(c => !existingIds.has(c.id));
    if (missing) {
      await syncDefaultCourses(db);
      [rows] = await db.query("SELECT * FROM courses ORDER BY FIELD(id, 'c1', 'c4', 'c5', 'c6', 'c3', 'c2')");
    }
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/courses/sync-defaults', async (req, res) => {
  const db = await getDbPool();
  if (!db) return res.json({ success: false, message: 'Database not connected' });
  try {
    await syncDefaultCourses(db);
    const [rows]: any = await db.query("SELECT * FROM courses ORDER BY FIELD(id, 'c1', 'c4', 'c5', 'c6', 'c3', 'c2')");
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/courses', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  const { id, title, duration, liveClasses, recordedClasses, orientation, exams, classDuration, price, originalPrice, image, category, rating, reviewsCount, description, seatsLeft, startDate } = req.body;
  try {
    await db.query(
      `INSERT INTO courses (id, title, duration, liveClasses, recordedClasses, orientation, exams, classDuration, price, originalPrice, image, category, rating, reviewsCount, description, seatsLeft, startDate) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), duration = VALUES(duration), liveClasses = VALUES(liveClasses), recordedClasses = VALUES(recordedClasses), orientation = VALUES(orientation), exams = VALUES(exams), classDuration = VALUES(classDuration), price = VALUES(price), originalPrice = VALUES(originalPrice), image = VALUES(image), category = VALUES(category), rating = VALUES(rating), reviewsCount = VALUES(reviewsCount), description = VALUES(description), seatsLeft = VALUES(seatsLeft), startDate = VALUES(startDate)`,
      [id, title, duration, liveClasses, recordedClasses, orientation, exams, classDuration, price, originalPrice, image, category, rating, reviewsCount, description, seatsLeft, startDate]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  const { id } = req.params;
  try {
    await db.query('DELETE FROM courses WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/seminar-events', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: true, source: 'fallback', data: DEFAULT_SEMINARS });
  }
  try {
    let [rows]: any = await db.query("SELECT * FROM seminars ORDER BY id ASC");
    const existingIds = new Set(rows.map((r: any) => r.id));
    const missing = DEFAULT_SEMINARS.some(s => !existingIds.has(s.id));
    if (missing) {
      await syncDefaultSeminars(db);
      [rows] = await db.query("SELECT * FROM seminars ORDER BY id ASC");
    }
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.json({ success: true, source: 'fallback_error', data: DEFAULT_SEMINARS });
  }
});

app.post('/api/seminar-events/sync-defaults', async (req, res) => {
  const db = await getDbPool();
  if (!db) return res.json({ success: false, message: 'Database not connected' });
  try {
    await syncDefaultSeminars(db);
    const [rows]: any = await db.query('SELECT * FROM seminars ORDER BY id ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/sync-defaults', async (req, res) => {
  const db = await getDbPool();
  if (!db) return res.json({ success: false, message: 'Database not connected' });
  try {
    await syncDefaultCourses(db);
    await syncDefaultSeminars(db);
    res.json({ success: true, message: 'Default courses and seminars synchronized successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/seminar-events', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  const { id, title, organization, description, expertName, expertRole, date, location, image } = req.body;
  try {
    await db.query(
      `INSERT INTO seminars (id, title, organization, description, expertName, expertRole, date, location, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), organization = VALUES(organization), description = VALUES(description), expertName = VALUES(expertName), expertRole = VALUES(expertRole), date = VALUES(date), location = VALUES(location), image = VALUES(image)`,
      [id, title, organization, description, expertName, expertRole, date, location, image]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/seminar-events/:id', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  const { id } = req.params;
  try {
    await db.query('DELETE FROM seminars WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM testimonials');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  const { id, name, role, feedback, image, rating } = req.body;
  try {
    await db.query(
      `INSERT INTO testimonials (id, name, role, feedback, image, rating) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), feedback = VALUES(feedback), image = VALUES(image), rating = VALUES(rating)`,
      [id, name, role, feedback, image, rating]
    );
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  const { id } = req.params;
  try {
    await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ==================== STATIC ASSETS & VITE MIDDLEWARE ====================

async function startServer() {
  // Serve optimized and public static assets with high-performance caching headers
  app.use('/optimized', express.static(path.join(process.cwd(), 'public', 'optimized'), {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res) => {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }));

  app.use(express.static(path.join(process.cwd(), 'public'), {
    maxAge: '7d',
    setHeaders: (res, filePath) => {
      if (/\.(webp|jpg|jpeg|png|svg|ico)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=864000, immutable');
      }
    }
  }));

  const escapeHtmlAttr = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  const injectShareMetaTags = async (html: string, req: express.Request): Promise<string> => {
    const courseId = typeof req.query.course === 'string' ? req.query.course.trim() : '';
    if (!courseId) return html;

    let course = DEFAULT_COURSES.find((c) => c.id === courseId);
    const db = await getDbPool();
    if (db) {
      try {
        const [rows]: any = await db.query('SELECT * FROM courses WHERE id = ? LIMIT 1', [courseId]);
        if (rows && rows.length > 0) {
          course = { ...(course || {}), ...rows[0] };
        }
      } catch {
        // Fallback to DEFAULT_COURSES
      }
    }
    if (!course) return html;

    const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'https';
    const host = req.get('host');
    const origin = host ? `${protocol}://${host}` : '';
    const imageUrl = course.image.startsWith('http') ? course.image : `${origin}${course.image}`;
    const safeTitle = escapeHtmlAttr(`${course.title} | BADN Academy`);
    const safeDesc = escapeHtmlAttr(course.description || '');
    const safeImg = escapeHtmlAttr(imageUrl);

    return html
      .replace(/<title>.*?<\/title>/i, `<title>${safeTitle}</title>`)
      .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${safeTitle}" />`)
      .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${safeDesc}" />`)
      .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${safeImg}" />`)
      .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${safeTitle}" />`)
      .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${safeDesc}" />`)
      .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${safeImg}" />`);
  };

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });

    app.get('/', async (req, res, next) => {
      if (typeof req.query.course !== 'string') {
        return next();
      }
      try {
        const rawHtml = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, rawHtml);
        const withMeta = await injectShareMetaTags(transformed, req);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(withMeta);
      } catch (e) {
        next(e);
      }
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false }));
    app.get('*', async (req, res) => {
      try {
        const rawHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
        const withMeta = await injectShareMetaTags(rawHtml, req);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(withMeta);
      } catch {
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`🚀 Full-stack BADN Server is running on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error('❌ Server error:', err);
    }
  });
}

startServer();
