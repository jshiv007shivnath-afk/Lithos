export interface User {
  uid: string;
  email: string;
  displayName?: string;
  enrolledCourses: string[]; // IDs of enrolled courses
  activeSubscription?: string; // subscription plan ID
  savedSites: string[]; // rock ID or site ID
  balance: number; // Lithos credits
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  studentsCount: number;
  price: number;
  description: string;
  coverImage: string;
  syllabus: string[];
}

export interface RockGuide {
  id: string;
  name: string;
  type: 'Igneous' | 'Sedimentary' | 'Metamorphic';
  age: string;
  formation: string;
  hardness: string;
  description: string;
  specimenUrl: string;
  geologicEra: string;
  mohsHardness: number;
}

export interface GeologicLayer {
  id: string;
  depthRange: string;
  era: string;
  name: string;
  composition: string;
  description: string;
  color: string;
  mineralPotential: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: 'month' | 'year';
  description: string;
  features: string[];
  popular?: boolean;
}

export interface LiveTourSession {
  id: string;
  title: string;
  guideName: string;
  dateTime: string;
  spotsLeft: number;
  description: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  location: string;
}

export interface PaymentReceipt {
  id: string;
  userId: string;
  itemType: 'course' | 'subscription';
  itemId: string;
  itemName: string;
  amount: number;
  timestamp: string;
  cardLast4: string;
  status: 'success' | 'failed';
}
