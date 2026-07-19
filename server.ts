import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

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

async function initializeTables(dbPool: mysql.Pool) {
  try {
    // Check if tables are already initialized by querying 'users' table presence
    const [rows]: any = await dbPool.query("SHOW TABLES LIKE 'users'");
    if (rows && rows.length > 0) {
      console.log('📡 Connected to MySQL database. Table structure is already verified.');
      return;
    }
  } catch (err: any) {
    console.warn('⚠️ Error checking table existence, proceeding with safety creation:', err.message);
  }

  console.log('📦 Automatically initializing database tables...');
  
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

  // Seed default courses if empty
  const [courseRows]: any = await dbPool.query('SELECT COUNT(*) as count FROM courses');
  if (courseRows[0].count === 0) {
    const defaultCourses = [
      {
        id: 'c1',
        title: 'সার্টিফিকেট কোর্স - ক্লিনিক্যাল নিউট্রিশন এন্ড ডায়েটেটিক্স (সিসিএনডি)',
        duration: '২ মাস (2 Months)',
        liveClasses: 16,
        recordedClasses: 1,
        orientation: 1,
        exams: 2,
        classDuration: '২ ঘণ্টা করে মোট ৪০ ঘণ্টা',
        price: 12000.00,
        originalPrice: 15000.00,
        image: '/src/assets/images/course_thumbnail_1783175481540.jpg',
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
        price: 16000.00,
        originalPrice: 20000.00,
        image: '/src/assets/images/hero_nutrition_banner_1783175357872.jpg',
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
        price: 8000.00,
        originalPrice: 10000.00,
        image: '/src/assets/images/classroom_seminar_1783175376672.jpg',
        category: 'Child Nutrition',
        rating: 5.0,
        reviewsCount: 98,
        description: 'গর্ভকালীন পুষ্টি এবং শিশুর জন্মের পর প্রথম ১০০০ দিনের পুষ্টি চাহিদা পূরণ ও পথ্য পরিকল্পনা নিয়ে বিশেষায়িত কোর্স।',
        seatsLeft: 5,
        startDate: '২০ জুলাই, ২০২৬'
      }
    ];

    for (const course of defaultCourses) {
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
    }
  }

  // Seed default seminars if empty
  const [seminarRows]: any = await dbPool.query('SELECT COUNT(*) as count FROM seminars');
  if (seminarRows[0].count === 0) {
    const defaultSeminars = [
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
        description: 'ঢাকায় বাংলাদেশে প্রথমবার “International Workshop on Understanding Nutrigenetics: The Science behind Personalized Nutrition” সফলভাবে অনুষ্ঠিত হয়। কর্মশালাটি Institute of Nutrigenetics, India কর্তৃক সার্টিфাইড ছিল এবং পার্সোনালাইজড ডায়েট ডিজাইনের ওপর গুরুত্বপূর্ণ আলোচনা করা হয়।',
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

    for (const seminar of defaultSeminars) {
      await dbPool.query(
        `INSERT INTO seminars (id, title, organization, description, expertName, expertRole, date, location, image) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          seminar.id, seminar.title, seminar.organization, seminar.description,
          seminar.expertName, seminar.expertRole, seminar.date, seminar.location, seminar.image
        ]
      );
    }
  }

  // Seed default testimonials if empty
  const [testimonialRows]: any = await dbPool.query('SELECT COUNT(*) as count FROM testimonials');
  if (testimonialRows[0].count === 0) {
    const defaultTestimonials = [
      {
        id: 't1',
        name: 'জিন্নাতুল জাহরা ঐশী',
        role: 'নিউট্রিয়াম গ্র্যাজুয়েট ও পুষ্টিবিদ',
        feedback: 'একাডেমিক পড়াশোনায় যে ঘাটতিগুলো ছিলো, курс করার ফলে সেগুলো অনেকটাই পূরণ হয়েছে। নিজের মধ্যে কনফিডেন্স এসেছে, জানার আগ্রহ আরও বেড়েছে। BADN কে ধন্যবাদ এই অসাধারণ কোর্সটি আয়োজন করার জন্য।',
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

    for (const test of defaultTestimonials) {
      await dbPool.query(
        `INSERT INTO testimonials (id, name, role, feedback, image, rating) VALUES (?, ?, ?, ?, ?, ?)`,
        [test.id, test.name, test.role, test.feedback, test.image, test.rating]
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
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM courses');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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

// Seminar Events
app.get('/api/seminar-events', async (req, res) => {
  const db = await getDbPool();
  if (!db) {
    return res.json({ success: false, message: 'Database not connected. Local fallback active.' });
  }
  try {
    const [rows] = await db.query('SELECT * FROM seminars');
    res.json({ success: true, source: 'database', data: rows });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
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
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Full-stack BADN Server is running on port ${PORT}`);
  });
}

startServer();
