export type UserRole =
  | 'student'
  | 'parent'
  | 'counsellor'
  | 'teacher'
  | 'institution_admin'
  | 'platform_admin';

export type AgeStage =
  | 'classes_1_5'
  | 'classes_6_8'
  | 'classes_9_12'
  | 'college'
  | 'corporate';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  stage?: AgeStage;
  schoolId: string;
  schoolName: string;
  schoolLicenseKey?: string;
  studentPasscode?: string;
  passwordPin?: string;
  classSection?: string;
  gradeNumber?: number | string;
  rollNumber?: string;
  title?: string; // For staff e.g. "Lead Counsellor" or "Principal"
}

export interface StudentPasscode {
  code: string;
  schoolKey: string;
  status: 'available' | 'claimed';
  studentId?: string;
  studentName?: string;
  claimedAt?: string;
  section: string;
}

export interface SchoolLicense {
  id: string;
  key: string;
  schoolName: string;
  maxSeats: number;
  usedSeats: number;
  expiryDate: string;
  status: 'active' | 'expired' | 'full';
  tierName: string;
  contactEmail: string;
  issuedKeys: StudentPasscode[];
}

export interface MoodCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  moodScore: number; // 1 to 5 (1 = Low, 5 = Flourishing)
  moodLabel: string;
  energyLevel: number; // 1 to 5
  sleepHours: number;
  factors: string[]; // 'Academics', 'Peers', 'Sleep', 'Family', 'Exams', 'Screen Time', etc.
  note?: string;
}

export interface JournalEntry {
  id: string;
  createdAt: string;
  title: string;
  content: string;
  moodTag: string;
  promptUsed?: string;
  isPrivate: boolean; // Always true for student privacy
  tags: string[];
}

export interface WellbeingGoal {
  id: string;
  title: string;
  category: 'sleep' | 'mindfulness' | 'movement' | 'academics' | 'social' | 'digital_balance';
  targetDaysPerWeek: number;
  completedDays: number;
  currentStreak: number;
  isCompletedToday: boolean;
  notes?: string;
}

export interface ProgramModule {
  id: string;
  title: string;
  durationMinutes: number;
  description: string;
  isCompleted: boolean;
  exerciseType?: 'breathing' | 'grounding' | 'journal' | 'reflection' | 'quiz';
}

export interface WellbeingProgram {
  id: string;
  title: string;
  tagline: string;
  targetStages: AgeStage[];
  modulesCount: number;
  durationWeeks: number;
  category: 'Emotional Resilience' | 'Exam Performance & Calm' | 'Social Empathy' | 'Sleep & Rest' | 'Transitions & Independence';
  description: string;
  modules: ProgramModule[];
  assignedToClasses?: string[];
  completionRate?: number;
}

export interface CampaignWorkshop {
  id: string;
  title: string;
  type: 'campaign' | 'workshop' | 'webinar';
  date: string;
  targetAudience: string;
  facilitator: string;
  rsvpsCount: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
}

export interface CounsellorReferral {
  id: string;
  studentId: string;
  studentAnonymousCode: string; // e.g., 'STU-9402' for privacy
  studentRealName?: string; // Only visible to counsellor upon authorized referral
  classSection: string;
  ageStage: AgeStage;
  priority: 'low' | 'medium' | 'high' | 'urgent_safeguarding';
  source: 'Student Self-Referral' | 'Teacher Observation' | 'Automated Mood Alert' | 'Parent Request';
  reasonCategory: 'Academic Anxiety' | 'Social Withdrawal' | 'Grief & Loss' | 'Sleep Disturbance' | 'Family Stress';
  status: 'Pending Review' | 'Scheduled' | 'In Consultation' | 'Resolved';
  createdAt: string;
  scheduledTime?: string;
  confidentialNotes: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  anonymousId: string;
  stage: AgeStage;
  gradeNumber: number | string;
  classSection: string;
  rollNumber: string;
  institutionId: string;
  institutionName: string;
  parentConsent: 'Approved' | 'Pending' | 'Self-Consented';
  parentName?: string;
  parentEmail?: string;
  assignedProgramIds: string[];
  activeStreak: number;
  wellbeingScore: number;
  checkInHistory: MoodCheckIn[];
  journalEntries: JournalEntry[];
  goals: WellbeingGoal[];
  savedResourceIds: string[];
  studentPasscode?: string;
  passwordPin?: string;
}

export interface Institution {
  id: string;
  name: string;
  type: 'K-12 School' | 'Senior Secondary' | 'College / University' | 'Corporate Campus';
  totalStudents: number;
  totalTeachers: number;
  totalCounsellors: number;
  departments: {
    id: string;
    name: string;
    sections: string[];
    studentCount: number;
  }[];
  subscriptionTier: 'Pilot' | 'Campus Core' | 'Comprehensive Campus Care' | 'Multi-Campus Enterprise';
  subscriptionRenewal: string;
  safeguardingLead: {
    name: string;
    email: string;
    phone: string;
    title: string;
  };
}

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'aavi';
  text: string;
  timestamp: string;
  crisisDetected?: boolean;
}

export interface CustomQA {
  id: string;
  trigger: string;
  replyEn: string;
  replyHi: string;
  enabled: boolean;
}

export interface MasterAdminSettings {
  masterSecretKey: string;
  botTone: 'compassionate' | 'coaching' | 'exam_calm' | 'playful';
  customSystemPrompt: string;
  customApiKey?: string;
  customQAs: CustomQA[];
  allowStudentRegistration: boolean;
  schoolVisibilityMode: 'masked' | 'minimal' | 'full';
}
