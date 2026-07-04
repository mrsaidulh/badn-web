import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'badn_db';
  const port = parseInt(process.env.DB_PORT || '3306', 10);

  console.log('🚀 BADN Database Auto-Initializer starting...');
  console.log(`📡 Connecting to MySQL server at ${host}:${port} as ${user}...`);

  let connection;
  try {
    // 1. Connect without database first to ensure database existence
    connection = await mysql.createConnection({
      host,
      user,
      password,
      port,
    });

    console.log('✅ Connected to MySQL server!');
    console.log(`📦 Checking if database "${database}" exists, creating if not...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
    await connection.end();

    // 2. Connect directly to the specific database
    connection = await mysql.createConnection({
      host,
      user,
      password,
      database,
      port,
    });
    console.log(`🔌 Successfully connected to database: "${database}"`);

    // 3. Create Tables
    console.log('🔨 Creating tables if they do not exist...');

    // Users / Admins Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   - "users" table created or verified.');

    // Courses Table
    await connection.query(`
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
    console.log('   - "courses" table created or verified.');

    // Seminars Table
    await connection.query(`
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
    console.log('   - "seminars" table created or verified.');

    // Testimonials Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255),
        feedback TEXT,
        image TEXT,
        rating INT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   - "testimonials" table created or verified.');

    // Enrollments Table
    await connection.query(`
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
    console.log('   - "enrollments" table created or verified.');

    // Seminar Registrations Table
    await connection.query(`
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
    console.log('   - "seminar_registrations" table created or verified.');

    // Contact Inquiries Table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id VARCHAR(50) PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        date VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('   - "contact_messages" table created or verified.');

    // ==================== SEED DATA INJECTION ====================
    console.log('\n🌱 Checking seed data...');

    // 1. Seed default user if empty
    const [userRows]: any = await connection.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      console.log('👤 Seeding default Admin/Instructor user...');
      const adminId = 'usr_' + Date.now();
      await connection.query(
        `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
        [adminId, 'saidulgmac@gmail.com', 'Password123!', 'Sajeda Kashem Jyoti', 'instructor']
      );
      console.log('   - Seeding completed. Account: saidulgmac@gmail.com / Password123!');
    } else {
      console.log('   - "users" table already has records. Skipping seed.');
    }

    // 2. Seed default courses if empty
    const [courseRows]: any = await connection.query('SELECT COUNT(*) as count FROM courses');
    if (courseRows[0].count === 0) {
      console.log('📚 Seeding default courses...');
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
        await connection.query(
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
      console.log('   - Seeding completed for 3 default courses.');
    } else {
      console.log('   - "courses" table already has records. Skipping seed.');
    }

    // 3. Seed default seminars if empty
    const [seminarRows]: any = await connection.query('SELECT COUNT(*) as count FROM seminars');
    if (seminarRows[0].count === 0) {
      console.log('🎤 Seeding default seminars...');
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

      for (const seminar of defaultSeminars) {
        await connection.query(
          `INSERT INTO seminars (id, title, organization, description, expertName, expertRole, date, location, image) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            seminar.id, seminar.title, seminar.organization, seminar.description,
            seminar.expertName, seminar.expertRole, seminar.date, seminar.location, seminar.image
          ]
        );
      }
      console.log('   - Seeding completed for 3 default seminars.');
    } else {
      console.log('   - "seminars" table already has records. Skipping seed.');
    }

    // 4. Seed default testimonials if empty
    const [testimonialRows]: any = await connection.query('SELECT COUNT(*) as count FROM testimonials');
    if (testimonialRows[0].count === 0) {
      console.log('⭐️ Seeding default testimonials...');
      const defaultTestimonials = [
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

      for (const test of defaultTestimonials) {
        await connection.query(
          `INSERT INTO testimonials (id, name, role, feedback, image, rating) VALUES (?, ?, ?, ?, ?, ?)`,
          [test.id, test.name, test.role, test.feedback, test.image, test.rating]
        );
      }
      console.log('   - Seeding completed for 3 default testimonials.');
    } else {
      console.log('   - "testimonials" table already has records. Skipping seed.');
    }

    console.log('\n❇️ Database setup and auto-seeding completed with absolute success!');
    await connection.end();
    process.exit(0);

  } catch (err: any) {
    console.error('\n❌ An error occurred during database initialization:', err.message);
    if (connection) {
      try {
        await connection.end();
      } catch (e) {}
    }
    process.exit(1);
  }
}

run();
