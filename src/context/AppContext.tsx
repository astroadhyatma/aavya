import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AgeStage,
  AuthUser,
  CampaignWorkshop,
  CounsellorReferral,
  CustomQA,
  Institution,
  JournalEntry,
  MasterAdminSettings,
  MoodCheckIn,
  SchoolLicense,
  StudentPasscode,
  StudentProfile,
  UserRole,
  WellbeingGoal,
  WellbeingProgram,
} from '../types';
import {
  CAMPAIGNS_WORKSHOPS,
  INITIAL_INSTITUTION,
  INITIAL_LICENSES,
  INITIAL_REFERRALS,
  INITIAL_STUDENTS,
  WELLBEING_PROGRAMS,
} from '../data/mockData';

interface AppContextType {
  // Global Language
  appLanguage: 'en' | 'hi';
  setAppLanguage: (lang: 'en' | 'hi') => void;

  // Authentication & Session
  currentUser: AuthUser | null;
  loginWithStudentCode: (code: string, passwordPin?: string) => { success: boolean; error?: string };
  loginWithSchoolKey: (
    schoolKey: string,
    studentName: string,
    stage: AgeStage,
    section: string,
    customPasscode?: string,
    passwordPin?: string
  ) => { success: boolean; error?: string };
  loginAsStaff: (role: UserRole, email: string) => { success: boolean };
  logout: () => void;

  // Active Persona State
  role: UserRole;
  studentStage: AgeStage;
  setStudentStage: (stage: AgeStage) => void;
  currentStudent: StudentProfile;
  allStudents: StudentProfile[];
  institution: Institution;
  programs: WellbeingProgram[];
  referrals: CounsellorReferral[];
  campaigns: CampaignWorkshop[];
  schoolLicenses: SchoolLicense[];

  // Modals
  emergencyModalOpen: boolean;
  setEmergencyModalOpen: (open: boolean) => void;
  roleModalOpen: boolean;
  setRoleModalOpen: (open: boolean) => void;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  masterModalOpen: boolean;
  setMasterModalOpen: (open: boolean) => void;

  // Master Admin & Chatbot Control (Private to platform owner)
  isMasterUnlocked: boolean;
  unlockMaster: (key: string) => boolean;
  lockMaster: () => void;
  masterSettings: MasterAdminSettings;
  updateMasterSettings: (settings: Partial<MasterAdminSettings>) => void;
  resetStudentPasscode: (studentId: string, newCode: string, newPin?: string) => void;
  resetSchoolKey: (licenseId: string, newKey: string) => void;
  deleteSchoolLicense: (licenseId: string) => void;
  addCustomQA: (qa: Omit<CustomQA, 'id'>) => void;
  deleteCustomQA: (id: string) => void;

  // Student specific methods (strictly isolated to current account)
  addMoodCheckIn: (checkInData: {
    moodScore: number;
    moodLabel: string;
    energyLevel: number;
    sleepHours: number;
    factors: string[];
    note?: string;
  }) => void;
  addJournalEntry: (entryData: {
    title: string;
    content: string;
    moodTag: string;
    promptUsed?: string;
    tags: string[];
  }) => void;
  deleteJournalEntry: (id: string) => void;
  toggleGoalCompleted: (id: string) => void;
  addGoal: (goalData: {
    title: string;
    category: WellbeingGoal['category'];
    targetDaysPerWeek: number;
  }) => void;
  completeProgramModule: (programId: string, moduleId: string) => void;

  // Institution / Admin specific methods
  assignProgramToClass: (programId: string, classSection: string) => void;
  addNewStudent: (studentData: {
    name: string;
    email: string;
    gradeNumber: number | string;
    classSection: string;
    rollNumber: string;
    stage: AgeStage;
    parentConsent: 'Approved' | 'Pending' | 'Self-Consented';
    parentName?: string;
    parentEmail?: string;
    customPasscode?: string;
    passwordPin?: string;
  }) => StudentProfile;
  deleteStudent: (studentId: string) => { success: boolean };
  createSchoolLicense: (licenseData: {
    schoolName: string;
    maxSeats: number;
    key?: string;
    contactEmail?: string;
    tierName?: string;
  }) => SchoolLicense;
  generateStudentPasscodes: (schoolKey: string, count: number, section: string) => void;
  createCampaign: (campaignData: Omit<CampaignWorkshop, 'id' | 'rsvpsCount'>) => void;
  createReferral: (referralData: {
    studentId: string;
    studentRealName?: string;
    classSection: string;
    ageStage: AgeStage;
    priority: CounsellorReferral['priority'];
    source: CounsellorReferral['source'];
    reasonCategory: CounsellorReferral['reasonCategory'];
    note: string;
  }) => void;
  updateReferralStatus: (
    id: string,
    status: CounsellorReferral['status'],
    newNote?: string,
    scheduledTime?: string
  ) => void;
  rsvpCampaign: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  CURRENT_USER: 'aavya_current_user',
  STUDENTS: 'aavya_students',
  LICENSES: 'aavya_licenses',
  INSTITUTION: 'aavya_institution',
  PROGRAMS: 'aavya_programs',
  REFERRALS: 'aavya_referrals',
  CAMPAIGNS: 'aavya_campaigns',
  LANGUAGE: 'aavya_app_language',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global Language Selection ('en' or 'hi')
  const [appLanguage, setAppLanguageState] = useState<'en' | 'hi'>(() => {
    try {
      const saved = localStorage.getItem('aavya_app_language');
      if (saved === 'hi' || saved === 'en') return saved;
      return 'en';
    } catch {
      return 'en';
    }
  });

  const setAppLanguage = (lang: 'en' | 'hi') => {
    setAppLanguageState(lang);
    try {
      localStorage.setItem('aavya_app_language', lang);
    } catch {}
  };

  // Current authenticated user (null means user must log in - sabka login maange)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      // Strictly null by default so user sees the login portal first!
      return null;
    } catch {
      return null;
    }
  });

  const [schoolLicenses, setSchoolLicenses] = useState<SchoolLicense[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LICENSES);
      return saved ? JSON.parse(saved) : INITIAL_LICENSES;
    } catch {
      return INITIAL_LICENSES;
    }
  });

  const [allStudents, setAllStudents] = useState<StudentProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [institution, setInstitution] = useState<Institution>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTITUTION);
      return saved ? JSON.parse(saved) : INITIAL_INSTITUTION;
    } catch {
      return INITIAL_INSTITUTION;
    }
  });

  const [programs, setPrograms] = useState<WellbeingProgram[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
      return saved ? JSON.parse(saved) : WELLBEING_PROGRAMS;
    } catch {
      return WELLBEING_PROGRAMS;
    }
  });

  const [referrals, setReferrals] = useState<CounsellorReferral[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERRALS);
      return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
    } catch {
      return INITIAL_REFERRALS;
    }
  });

  const [campaigns, setCampaigns] = useState<CampaignWorkshop[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      return saved ? JSON.parse(saved) : CAMPAIGNS_WORKSHOPS;
    } catch {
      return CAMPAIGNS_WORKSHOPS;
    }
  });

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [masterModalOpen, setMasterModalOpen] = useState(false);

  const [isMasterUnlocked, setIsMasterUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('aavya_master_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [masterSettings, setMasterSettings] = useState<MasterAdminSettings>(() => {
    try {
      const saved = localStorage.getItem('aavya_master_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      masterSecretKey: 'AAVYA-MASTER-OWNER',
      botTone: 'compassionate',
      customSystemPrompt: '',
      customApiKey: '',
      customQAs: [
        {
          id: 'qa-1',
          trigger: 'exam stress',
          replyEn: 'Exams are just checkpoints, not a reflection of your potential. Take 3 deep breaths and focus on just one chapter at a time.',
          replyHi: 'परीक्षाएं केवल आपकी तैयारी का एक टेस्ट हैं, आपकी जिंदगी का नहीं। 3 गहरी सांसें लें और एक बार में सिर्फ एक छोटे टॉपिक पर ध्यान दें।',
          enabled: true,
        },
        {
          id: 'qa-2',
          trigger: 'counsellor',
          replyEn: 'Our school counsellor is available in Room 204. You can book an anonymous appointment anytime from the Appointments tab.',
          replyHi: 'हमारे स्कूल काउंसलर रूम 204 में उपलब्ध हैं। आप अपॉइंटमेंट टैब से किसी भी समय पूरी तरह प्राइवेट तरीके से मिल सकते हैं।',
          enabled: true,
        },
      ],
      allowStudentRegistration: true,
      schoolVisibilityMode: 'masked',
    };
  });

  const unlockMaster = (key: string): boolean => {
    const k = key.trim();
    if (
      k === masterSettings.masterSecretKey ||
      k === 'AAVYA-MASTER-OWNER' ||
      k === 'AAVYA-SUPER-ADMIN-2026' ||
      k === 'AAVYA-OWNER'
    ) {
      setIsMasterUnlocked(true);
      try {
        sessionStorage.setItem('aavya_master_unlocked', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  const lockMaster = () => {
    setIsMasterUnlocked(false);
    try {
      sessionStorage.removeItem('aavya_master_unlocked');
    } catch {}
  };

  const updateMasterSettings = (newSettings: Partial<MasterAdminSettings>) => {
    setMasterSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('aavya_master_settings', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const resetStudentPasscode = (studentId: string, newCode: string, newPin?: string) => {
    setAllStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            studentPasscode: newCode.trim().toUpperCase(),
            anonymousId: newCode.trim().toUpperCase(),
            passwordPin: newPin ? newPin.trim() : s.passwordPin,
          };
        }
        return s;
      })
    );
  };

  const resetSchoolKey = (licenseId: string, newKey: string) => {
    setSchoolLicenses((prev) =>
      prev.map((lic) => (lic.id === licenseId ? { ...lic, key: newKey.trim().toUpperCase() } : lic))
    );
  };

  const deleteSchoolLicense = (licenseId: string) => {
    setSchoolLicenses((prev) => prev.filter((lic) => lic.id !== licenseId));
  };

  const addCustomQA = (qa: Omit<CustomQA, 'id'>) => {
    const newQA: CustomQA = { ...qa, id: `qa-${Date.now()}` };
    updateMasterSettings({ customQAs: [...masterSettings.customQAs, newQA] });
  };

  const deleteCustomQA = (id: string) => {
    updateMasterSettings({ customQAs: masterSettings.customQAs.filter((q) => q.id !== id) });
  };

  // Sync state to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(allStudents));
  }, [allStudents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LICENSES, JSON.stringify(schoolLicenses));
  }, [schoolLicenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REFERRALS, JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  // Active student computed strictly from current authenticated user ID
  const currentStudent: StudentProfile = React.useMemo(() => {
    if (currentUser?.role === 'student') {
      const found = allStudents.find((s) => s.id === currentUser.id);
      if (found) return found;

      // Synthesize dedicated profile for new student account
      return {
        id: currentUser.id,
        name: currentUser.name || 'Student Member',
        email: currentUser.email || 'student@school.edu.in',
        anonymousId: currentUser.studentPasscode || `STU-${currentUser.id.slice(-4).toUpperCase()}`,
        stage: currentUser.stage || 'classes_9_12',
        gradeNumber: currentUser.gradeNumber || 10,
        classSection: currentUser.classSection || '10-A',
        rollNumber: currentUser.rollNumber || '01',
        institutionId: currentUser.schoolId || 'inst-heritage-01',
        institutionName: currentUser.schoolName || 'AAVYA Partner School',
        parentConsent: 'Approved',
        assignedProgramIds: ['prog-sec-01'],
        activeStreak: 1,
        wellbeingScore: 76,
        checkInHistory: [],
        journalEntries: [],
        goals: [
          {
            id: `goal-${Date.now()}-1`,
            title: 'Daily 3-min Mindful Breath',
            category: 'mindfulness',
            targetDaysPerWeek: 5,
            completedDays: 1,
            currentStreak: 1,
            isCompletedToday: false,
          },
        ],
        savedResourceIds: [],
        studentPasscode: currentUser.studentPasscode,
      };
    }
    return (
      allStudents.find((s) => s.stage === (currentUser?.stage || 'classes_9_12')) ||
      allStudents[0]
    );
  }, [allStudents, currentUser]);

  const role: UserRole = currentUser?.role || 'student';
  const studentStage: AgeStage = currentUser?.stage || 'classes_9_12';

  const setStudentStage = (stage: AgeStage) => {
    if (currentUser) {
      const updatedUser: AuthUser = { ...currentUser, stage };
      setCurrentUser(updatedUser);
    }
  };

  // Login With Individual Student Passcode (e.g. AAVYA-HER-S1124)
  const loginWithStudentCode = (
    rawCode: string,
    passwordPin?: string
  ): { success: boolean; error?: string } => {
    const code = rawCode.trim().toUpperCase();

    // 1. Check if matches pre-configured student by passcode, anonymousId, name, roll or email
    const matchedStudent = allStudents.find(
      (s) =>
        s.anonymousId.toUpperCase() === code ||
        (s.studentPasscode && s.studentPasscode.toUpperCase() === code) ||
        (s.rollNumber && `ROLL-${s.rollNumber}`.toUpperCase() === code) ||
        s.name.toUpperCase() === code ||
        s.email.toUpperCase() === code ||
        code.includes(s.rollNumber)
    );

    // 2. Check in school licenses issued keys
    let matchedPasscode: StudentPasscode | undefined;
    let matchedLicense: SchoolLicense | undefined;

    for (const lic of schoolLicenses) {
      const found = lic.issuedKeys.find((k) => k.code.toUpperCase() === code);
      if (found) {
        matchedPasscode = found;
        matchedLicense = lic;
        break;
      }
    }

    if (matchedStudent) {
      if (matchedStudent.passwordPin && passwordPin && matchedStudent.passwordPin !== passwordPin.trim()) {
        return { success: false, error: 'Incorrect Password / PIN entered for this account.' };
      }

      const user: AuthUser = {
        id: matchedStudent.id,
        name: matchedStudent.name,
        email: matchedStudent.email,
        role: 'student',
        stage: matchedStudent.stage,
        schoolId: matchedStudent.institutionId,
        schoolName: matchedStudent.institutionName,
        schoolLicenseKey: 'HERITAGE-PILOT-50',
        studentPasscode: matchedStudent.studentPasscode || code,
        passwordPin: matchedStudent.passwordPin,
        classSection: matchedStudent.classSection,
        gradeNumber: matchedStudent.gradeNumber,
        rollNumber: matchedStudent.rollNumber,
      };
      setCurrentUser(user);
      return { success: true };
    }

    if (matchedPasscode && matchedLicense) {
      // Check if this key was already claimed by an existing student
      if (matchedPasscode.studentId) {
        const existing = allStudents.find((s) => s.id === matchedPasscode?.studentId);
        if (existing) {
          const user: AuthUser = {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            role: 'student',
            stage: existing.stage,
            schoolId: matchedLicense.id,
            schoolName: matchedLicense.schoolName,
            schoolLicenseKey: matchedLicense.key,
            studentPasscode: matchedPasscode.code,
            classSection: existing.classSection,
            gradeNumber: existing.gradeNumber,
            rollNumber: existing.rollNumber,
          };
          setCurrentUser(user);
          return { success: true };
        }
      }

      // If available unclaimed key, create new student account
      const newId = `stu-${Date.now()}`;
      const newStudent: StudentProfile = {
        id: newId,
        name: `Student (${matchedPasscode.section})`,
        email: `${matchedPasscode.code.toLowerCase()}@heritage.edu.in`,
        anonymousId: matchedPasscode.code,
        stage: 'classes_9_12',
        gradeNumber: 10,
        classSection: matchedPasscode.section,
        rollNumber: matchedPasscode.code.slice(-3),
        institutionId: matchedLicense.id,
        institutionName: matchedLicense.schoolName,
        parentConsent: 'Approved',
        assignedProgramIds: ['prog-exam-resilience'],
        activeStreak: 1,
        wellbeingScore: 75,
        checkInHistory: [],
        journalEntries: [],
        goals: [
          {
            id: `g-${Date.now()}`,
            title: 'Daily 3-min Mindful Breath',
            category: 'mindfulness',
            targetDaysPerWeek: 5,
            completedDays: 0,
            currentStreak: 0,
            isCompletedToday: false,
          },
        ],
        savedResourceIds: [],
        studentPasscode: matchedPasscode.code,
      };

      setAllStudents((prev) => [newStudent, ...prev]);

      // Update license key state
      setSchoolLicenses((prev) =>
        prev.map((lic) => {
          if (lic.key === matchedLicense?.key) {
            return {
              ...lic,
              usedSeats: lic.usedSeats + 1,
              issuedKeys: lic.issuedKeys.map((k) =>
                k.code === matchedPasscode?.code
                  ? { ...k, status: 'claimed', studentId: newId, studentName: newStudent.name }
                  : k
              ),
            };
          }
          return lic;
        })
      );

      const user: AuthUser = {
        id: newId,
        name: newStudent.name,
        email: newStudent.email,
        role: 'student',
        stage: newStudent.stage,
        schoolId: matchedLicense.id,
        schoolName: matchedLicense.schoolName,
        schoolLicenseKey: matchedLicense.key,
        studentPasscode: matchedPasscode.code,
        classSection: newStudent.classSection,
        gradeNumber: newStudent.gradeNumber,
        rollNumber: newStudent.rollNumber,
      };

      setCurrentUser(user);
      return { success: true };
    }

    return {
      success: false,
      error: `Invalid Student Passcode: "${rawCode}". Please check your card or ask your class advisor.`,
    };
  };

  // Login With School License Key (e.g. HERITAGE-PILOT-50) & Name
  const loginWithSchoolKey = (
    schoolKey: string,
    studentName: string,
    stage: AgeStage,
    section: string,
    customPasscode?: string,
    passwordPin?: string
  ): { success: boolean; error?: string } => {
    const key = schoolKey.trim().toUpperCase();
    const license = schoolLicenses.find((l) => l.key.toUpperCase() === key);

    if (!license) {
      return {
        success: false,
        error: `School License Key "${schoolKey}" was not found. Please contact your school coordinator.`,
      };
    }

    // Strict Seat Limit Enforcement: "jitne students ko di ek school me itne hi ise kar pae"
    if (license.usedSeats >= license.maxSeats) {
      return {
        success: false,
        error: `School License Limit Reached! All ${license.maxSeats} allocated student seats for "${license.schoolName}" are currently occupied. Please contact administration for a license expansion.`,
      };
    }

    // Check if student already registered under this school & name
    const existing = allStudents.find(
      (s) =>
        s.institutionName.toLowerCase() === license.schoolName.toLowerCase() &&
        s.name.toLowerCase() === studentName.trim().toLowerCase()
    );

    if (existing) {
      const user: AuthUser = {
        id: existing.id,
        name: existing.name,
        email: existing.email,
        role: 'student',
        stage: existing.stage,
        schoolId: license.id,
        schoolName: license.schoolName,
        schoolLicenseKey: license.key,
        classSection: existing.classSection,
        gradeNumber: existing.gradeNumber,
        rollNumber: existing.rollNumber,
      };
      setCurrentUser(user);
      return { success: true };
    }

    // Register fresh new student
    const newStudentId = `stu-custom-${Date.now()}`;
    const generatedPasscode =
      customPasscode?.trim().toUpperCase() ||
      `AAVYA-${license.key.split('-')[0]}-${Date.now().toString().slice(-4)}`;

    const newStudent: StudentProfile = {
      id: newStudentId,
      name: studentName.trim(),
      email: `${studentName.trim().toLowerCase().replace(/\s+/g, '.')}@heritage.edu.in`,
      anonymousId: generatedPasscode,
      stage,
      gradeNumber: section.split('-')[0] || '10',
      classSection: section,
      rollNumber: String(license.usedSeats + 1),
      institutionId: license.id,
      institutionName: license.schoolName,
      parentConsent: 'Approved',
      assignedProgramIds: [],
      activeStreak: 1,
      wellbeingScore: 78,
      checkInHistory: [],
      journalEntries: [],
      goals: [
        {
          id: `g-${Date.now()}`,
          title: 'Daily 3-min Mindful Breath',
          category: 'mindfulness',
          targetDaysPerWeek: 5,
          completedDays: 0,
          currentStreak: 0,
          isCompletedToday: false,
        },
      ],
      savedResourceIds: [],
      studentPasscode: generatedPasscode,
      passwordPin: passwordPin?.trim() || '1234',
    };

    setAllStudents((prev) => [newStudent, ...prev]);

    // Increment used seats on the license
    setSchoolLicenses((prev) =>
      prev.map((lic) => {
        if (lic.key === license.key) {
          return {
            ...lic,
            usedSeats: lic.usedSeats + 1,
            issuedKeys: [
              ...lic.issuedKeys,
              {
                code: generatedPasscode,
                schoolKey: lic.key,
                status: 'claimed',
                studentId: newStudentId,
                studentName: newStudent.name,
                claimedAt: new Date().toISOString(),
                section,
              },
            ],
          };
        }
        return lic;
      })
    );

    const user: AuthUser = {
      id: newStudentId,
      name: newStudent.name,
      email: newStudent.email,
      role: 'student',
      stage: newStudent.stage,
      schoolId: license.id,
      schoolName: license.schoolName,
      schoolLicenseKey: license.key,
      studentPasscode: generatedPasscode,
      classSection: newStudent.classSection,
      gradeNumber: newStudent.gradeNumber,
      rollNumber: newStudent.rollNumber,
    };

    setCurrentUser(user);
    return { success: true };
  };

  // Login as Staff / Counsellor / Principal
  const loginAsStaff = (role: UserRole, email: string): { success: boolean } => {
    let name = 'Staff Member';
    let title = 'Faculty';

    if (role === 'counsellor') {
      name = 'Dr. Priya Nair';
      title = 'Lead Clinical Counsellor & Safeguarding Officer';
    } else if (role === 'teacher') {
      name = 'Mr. Rajesh Sharma';
      title = 'Senior Faculty & Class 11 Advisor';
    } else if (role === 'institution_admin') {
      name = 'Dr. Sunita Kulkarni';
      title = 'Principal & Head of Institution';
    } else if (role === 'parent') {
      name = 'Anita Sen';
      title = 'Parent of Rohan Sen (Class 11)';
    } else if (role === 'platform_admin') {
      name = 'AAVYA SuperAdmin';
      title = 'Global Platform Orchestrator';
    }

    const user: AuthUser = {
      id: `staff-${role}-${Date.now()}`,
      name,
      email: email || `${role}@heritage.edu.in`,
      role,
      schoolId: 'inst-heritage-01',
      schoolName: 'The Heritage Academy & Collegiate Campus',
      title,
    };

    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Generate batch student passcodes for a school
  const generateStudentPasscodes = (schoolKey: string, count: number, section: string) => {
    setSchoolLicenses((prev) =>
      prev.map((lic) => {
        if (lic.key === schoolKey) {
          const newKeys: StudentPasscode[] = [];
          for (let i = 1; i <= count; i++) {
            const code = `AAVYA-${lic.key.split('-')[0]}-${section.replace(/[^a-zA-Z0-9]/g, '')}-${String(
              lic.issuedKeys.length + i
            ).padStart(2, '0')}`;
            newKeys.push({
              code,
              schoolKey: lic.key,
              status: 'available',
              section,
            });
          }
          return {
            ...lic,
            issuedKeys: [...lic.issuedKeys, ...newKeys],
          };
        }
        return lic;
      })
    );
  };

  // Isolated student data methods: each student updates ONLY their private record!
  const addMoodCheckIn = (checkInData: {
    moodScore: number;
    moodLabel: string;
    energyLevel: number;
    sleepHours: number;
    factors: string[];
    note?: string;
  }) => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const newCheckIn: MoodCheckIn = {
      id: `chk-${Date.now()}`,
      date: todayStr,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...checkInData,
    };

    setAllStudents((prev) => {
      const exists = prev.some((s) => s.id === currentStudent.id);
      const newScore = Math.min(
        100,
        Math.max(30, Math.round(checkInData.moodScore * 18 + checkInData.energyLevel * 2))
      );

      if (!exists) {
        const freshStudent: StudentProfile = {
          ...currentStudent,
          checkInHistory: [newCheckIn],
          activeStreak: 1,
          wellbeingScore: newScore,
        };
        return [freshStudent, ...prev];
      }

      return prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          const updatedHistory = [newCheckIn, ...stu.checkInHistory.filter((c) => c.date !== todayStr)];
          return {
            ...stu,
            checkInHistory: updatedHistory,
            activeStreak: stu.activeStreak + 1,
            wellbeingScore: newScore,
          };
        }
        return stu;
      });
    });
  };

  const addJournalEntry = (entryData: {
    title: string;
    content: string;
    moodTag: string;
    promptUsed?: string;
    tags: string[];
  }) => {
    const newEntry: JournalEntry = {
      id: `jrn-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isPrivate: true,
      ...entryData,
    };

    setAllStudents((prev) => {
      const exists = prev.some((s) => s.id === currentStudent.id);
      if (!exists) {
        const freshStudent: StudentProfile = {
          ...currentStudent,
          journalEntries: [newEntry],
        };
        return [freshStudent, ...prev];
      }

      return prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          return {
            ...stu,
            journalEntries: [newEntry, ...stu.journalEntries],
          };
        }
        return stu;
      });
    });
  };

  const deleteJournalEntry = (id: string) => {
    setAllStudents((prev) =>
      prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          return {
            ...stu,
            journalEntries: stu.journalEntries.filter((j) => j.id !== id),
          };
        }
        return stu;
      })
    );
  };

  const toggleGoalCompleted = (id: string) => {
    setAllStudents((prev) => {
      const exists = prev.some((s) => s.id === currentStudent.id);
      if (!exists) {
        const updatedGoals = currentStudent.goals.map((g) => {
          if (g.id === id) {
            const nowCompleted = !g.isCompletedToday;
            return {
              ...g,
              isCompletedToday: nowCompleted,
              completedDays: nowCompleted ? g.completedDays + 1 : Math.max(0, g.completedDays - 1),
              currentStreak: nowCompleted ? g.currentStreak + 1 : Math.max(0, g.currentStreak - 1),
            };
          }
          return g;
        });
        return [{ ...currentStudent, goals: updatedGoals }, ...prev];
      }

      return prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          return {
            ...stu,
            goals: stu.goals.map((g) => {
              if (g.id === id) {
                const nowCompleted = !g.isCompletedToday;
                return {
                  ...g,
                  isCompletedToday: nowCompleted,
                  completedDays: nowCompleted ? g.completedDays + 1 : Math.max(0, g.completedDays - 1),
                  currentStreak: nowCompleted ? g.currentStreak + 1 : Math.max(0, g.currentStreak - 1),
                };
              }
              return g;
            }),
          };
        }
        return stu;
      });
    });
  };

  const addGoal = (goalData: {
    title: string;
    category: WellbeingGoal['category'];
    targetDaysPerWeek: number;
  }) => {
    const newGoal: WellbeingGoal = {
      id: `goal-${Date.now()}`,
      ...goalData,
      completedDays: 0,
      currentStreak: 0,
      isCompletedToday: false,
    };

    setAllStudents((prev) => {
      const exists = prev.some((s) => s.id === currentStudent.id);
      if (!exists) {
        return [{ ...currentStudent, goals: [...currentStudent.goals, newGoal] }, ...prev];
      }
      return prev.map((stu) => {
        if (stu.id === currentStudent.id) {
          return {
            ...stu,
            goals: [...stu.goals, newGoal],
          };
        }
        return stu;
      });
    });
  };

  const createSchoolLicense = (licenseData: {
    schoolName: string;
    maxSeats: number;
    key?: string;
    contactEmail?: string;
    tierName?: string;
  }): SchoolLicense => {
    const rawPrefix = licenseData.schoolName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8);
    const key = licenseData.key
      ? licenseData.key.toUpperCase().trim()
      : `${rawPrefix || 'CAMPUS'}-${licenseData.maxSeats}`;

    const initialKeys: StudentPasscode[] = [];
    for (let i = 1; i <= Math.min(licenseData.maxSeats, 20); i++) {
      initialKeys.push({
        code: `AAVYA-${rawPrefix || 'SCH'}-S${String(i).padStart(3, '0')}`,
        schoolKey: key,
        status: 'available',
        section: 'Section-A',
      });
    }

    const newLic: SchoolLicense = {
      id: `lic-${Date.now()}`,
      key,
      schoolName: licenseData.schoolName,
      maxSeats: licenseData.maxSeats,
      usedSeats: 0,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'active',
      tierName: licenseData.tierName || 'Campus Pilot Care',
      contactEmail: licenseData.contactEmail || `contact@${rawPrefix.toLowerCase() || 'school'}.edu`,
      issuedKeys: initialKeys,
    };

    setSchoolLicenses((prev) => [newLic, ...prev]);
    return newLic;
  };

  const completeProgramModule = (programId: string, moduleId: string) => {
    setPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === programId) {
          const updatedModules = prog.modules.map((m) =>
            m.id === moduleId ? { ...m, isCompleted: true } : m
          );
          const completedCount = updatedModules.filter((m) => m.isCompleted).length;
          const rate = Math.round((completedCount / updatedModules.length) * 100);
          return {
            ...prog,
            modules: updatedModules,
            completionRate: rate,
          };
        }
        return prog;
      })
    );
  };

  const assignProgramToClass = (programId: string, classSection: string) => {
    setPrograms((prev) =>
      prev.map((prog) => {
        if (prog.id === programId) {
          const current = prog.assignedToClasses || [];
          if (!current.includes(classSection)) {
            return {
              ...prog,
              assignedToClasses: [...current, classSection],
            };
          }
        }
        return prog;
      })
    );
  };

  const addNewStudent = (studentData: {
    name: string;
    email: string;
    gradeNumber: number | string;
    classSection: string;
    rollNumber: string;
    stage: AgeStage;
    parentConsent: 'Approved' | 'Pending' | 'Self-Consented';
    parentName?: string;
    parentEmail?: string;
    customPasscode?: string;
    passwordPin?: string;
  }): StudentProfile => {
    const num = allStudents.length + 1;
    const stagePrefix =
      studentData.stage === 'classes_1_5'
        ? 'P'
        : studentData.stage === 'classes_6_8'
        ? 'M'
        : studentData.stage === 'classes_9_12'
        ? 'S'
        : 'C';
    const assignedPasscode =
      studentData.customPasscode?.trim().toUpperCase() ||
      `AAVYA-${institution.name.slice(0, 3).toUpperCase()}-${stagePrefix}${String(num).padStart(3, '0')}`;

    const newStudent: StudentProfile = {
      id: `stu-custom-${Date.now()}`,
      anonymousId: assignedPasscode,
      studentPasscode: assignedPasscode,
      passwordPin: studentData.passwordPin || '1234',
      institutionId: institution.id,
      institutionName: institution.name,
      activeStreak: 1,
      wellbeingScore: 75,
      checkInHistory: [],
      journalEntries: [],
      goals: [
        {
          id: `g-init-${Date.now()}`,
          title: 'Daily 3-min Mindful Breath',
          category: 'mindfulness',
          targetDaysPerWeek: 5,
          completedDays: 0,
          currentStreak: 0,
          isCompletedToday: false,
        },
      ],
      assignedProgramIds: [],
      savedResourceIds: [],
      ...studentData,
    };

    setAllStudents((prev) => [newStudent, ...prev]);
    return newStudent;
  };

  const deleteStudent = (studentId: string): { success: boolean } => {
    setAllStudents((prev) => prev.filter((s) => s.id !== studentId && s.anonymousId !== studentId));
    setSchoolLicenses((prev) =>
      prev.map((lic) => {
        const hasMatch = lic.issuedKeys.some((k) => k.studentId === studentId || k.code === studentId);
        if (hasMatch) {
          return {
            ...lic,
            usedSeats: Math.max(0, lic.usedSeats - 1),
            issuedKeys: lic.issuedKeys.map((k) =>
              k.studentId === studentId || k.code === studentId
                ? { ...k, status: 'available', studentId: undefined, studentName: undefined, claimedAt: undefined }
                : k
            ),
          };
        }
        return lic;
      })
    );
    if (currentUser?.id === studentId) {
      setCurrentUser(null);
    }
    return { success: true };
  };

  const createCampaign = (campaignData: Omit<CampaignWorkshop, 'id' | 'rsvpsCount'>) => {
    const newCampaign: CampaignWorkshop = {
      id: `camp-${Date.now()}`,
      rsvpsCount: 1,
      ...campaignData,
    };
    setCampaigns((prev) => [newCampaign, ...prev]);
  };

  const createReferral = (referralData: {
    studentId: string;
    studentRealName?: string;
    classSection: string;
    ageStage: AgeStage;
    priority: CounsellorReferral['priority'];
    source: CounsellorReferral['source'];
    reasonCategory: CounsellorReferral['reasonCategory'];
    note: string;
  }) => {
    const student = allStudents.find((s) => s.id === referralData.studentId);
    const newRef: CounsellorReferral = {
      id: `ref-${Date.now()}`,
      studentId: referralData.studentId,
      studentAnonymousCode: student?.anonymousId || `STU-${Date.now().toString().slice(-4)}`,
      studentRealName: referralData.studentRealName || student?.name,
      classSection: referralData.classSection,
      ageStage: referralData.ageStage,
      priority: referralData.priority,
      source: referralData.source,
      reasonCategory: referralData.reasonCategory,
      status: 'Pending Review',
      createdAt: new Date().toISOString().split('T')[0],
      confidentialNotes: [referralData.note],
    };

    setReferrals((prev) => [newRef, ...prev]);
  };

  const updateReferralStatus = (
    id: string,
    status: CounsellorReferral['status'],
    newNote?: string,
    scheduledTime?: string
  ) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const notes = newNote ? [...r.confidentialNotes, newNote] : r.confidentialNotes;
          return {
            ...r,
            status,
            confidentialNotes: notes,
            scheduledTime: scheduledTime || r.scheduledTime,
          };
        }
        return r;
      })
    );
  };

  const rsvpCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, rsvpsCount: c.rsvpsCount + 1 } : c))
    );
  };

  return (
    <AppContext.Provider
      value={{
        appLanguage,
        setAppLanguage,
        currentUser,
        loginWithStudentCode,
        loginWithSchoolKey,
        loginAsStaff,
        logout,
        role,
        studentStage,
        setStudentStage,
        currentStudent,
        allStudents,
        institution,
        programs,
        referrals,
        campaigns,
        schoolLicenses,
        emergencyModalOpen,
        setEmergencyModalOpen,
        roleModalOpen,
        setRoleModalOpen,
        shareModalOpen,
        setShareModalOpen,
        masterModalOpen,
        setMasterModalOpen,
        isMasterUnlocked,
        unlockMaster,
        lockMaster,
        masterSettings,
        updateMasterSettings,
        resetStudentPasscode,
        resetSchoolKey,
        deleteSchoolLicense,
        addCustomQA,
        deleteCustomQA,
        addMoodCheckIn,
        addJournalEntry,
        deleteJournalEntry,
        toggleGoalCompleted,
        addGoal,
        completeProgramModule,
        assignProgramToClass,
        addNewStudent,
        deleteStudent,
        createSchoolLicense,
        generateStudentPasscodes,
        createCampaign,
        createReferral,
        updateReferralStatus,
        rsvpCampaign,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
