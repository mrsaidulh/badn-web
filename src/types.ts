export interface Course {
  id: string;
  title: string;
  duration: string;
  liveClasses: number;
  recordedClasses: number;
  orientation: number;
  exams: number;
  classDuration: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  description: string;
  seatsLeft: number;
  startDate: string;
}

export interface Seminar {
  id: string;
  title: string;
  organization: string;
  description: string;
  expertName: string;
  expertRole: string;
  date: string;
  location: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  feedback: string;
  image: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}
