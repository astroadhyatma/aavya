import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgeStage, UserRole } from '../../types';
import {
  KeyRound,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Lock,
  Heart,
  CheckCircle2,
  PlusCircle,
  School,
  Share2,
  Trash2,
  Eye,
  EyeOff,
  Languages,
  UserX,
  FileKey,
  BookOpen,
} from 'lucide-react';

export const LoginPortal: React.FC = () => {
  const {
    appLanguage,
    setAppLanguage,
    loginWithStudentCode,
    loginWithSchoolKey,
    loginAsStaff,
    schoolLicenses,
    allStudents,
    addNewStudent,
    deleteStudent,
    createSchoolLicense,
    setShareModalOpen,
  } = useApp();

  const isHi = appLanguage === 'hi';

  const [activeTab, setActiveTab] = useState<
    'student_login' | 'new_student' | 'id_manager' | 'staff_login' | 'new_school'
  >('student_login');

  // Student Login Form State
  const [studentCode, setStudentCode] = useState('');
  const [studentPin, setStudentPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // New Student Registration Form State
  const [schoolKey, setSchoolKey] = useState(schoolLicenses[0]?.key || 'HERITAGE-PILOT-50');
  const [newStudentName, setNewStudentName] = useState('');
  const [customLoginId, setCustomLoginId] = useState('');
  const [customPassword, setCustomPassword] = useState('');
  const [studentStage, setStudentStage] = useState<AgeStage>('classes_9_12');
  const [studentSection, setStudentSection] = useState('11-Sci');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  // ID Manager Add Form State
  const [mgrName, setMgrName] = useState('');
  const [mgrId, setMgrId] = useState('');
  const [mgrPin, setMgrPin] = useState('');
  const [mgrStage, setMgrStage] = useState<AgeStage>('classes_9_12');
  const [mgrSection, setMgrSection] = useState('10-A');
  const [mgrMsg, setMgrMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Staff Form State
  const [staffRole, setStaffRole] = useState<UserRole>('counsellor');
  const [staffEmail, setStaffEmail] = useState('priya.nair@heritage.edu.in');
  const [staffPassword, setStaffPassword] = useState('••••••••');

  // New School Form State
  const [newSchoolName, setNewSchoolName] = useState('');
  const [newSchoolSeats, setNewSchoolSeats] = useState<number>(50);
  const [newSchoolEmail, setNewSchoolEmail] = useState('');
  const [schoolCreatedMsg, setSchoolCreatedMsg] = useState<string | null>(null);

  // Handle Student Login Submit
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!studentCode.trim()) {
      setLoginError(isHi ? 'कृपया अपना स्टूडेंट आईडी या पासकोड दर्ज करें।' : 'Please enter your Student ID or Passcode.');
      return;
    }

    const res = await loginWithStudentCode(studentCode.trim(), studentPin.trim() || undefined);
    if (!res.success) {
      setLoginError(
        res.error ||
          (isHi
            ? 'अमान्य आईडी या पासवर्ड। कृपया पुनः जांचें।'
            : 'Invalid Login ID or Password. Please try again.')
      );
    }
  };

  // Handle New Student Registration Submit
  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);
    if (!newStudentName.trim()) {
      setRegError(isHi ? 'कृपया विद्यार्थी का नाम दर्ज करें।' : 'Please enter student name.');
      return;
    }

    const res = loginWithSchoolKey(
      schoolKey.trim(),
      newStudentName.trim(),
      studentStage,
      studentSection.trim() || 'General',
      customLoginId.trim() || undefined,
      customPassword.trim() || undefined
    );

    if (!res.success) {
      setRegError(res.error || (isHi ? 'पंजीकरण विफल रहा।' : 'Registration failed.'));
    } else {
      setRegSuccess(
        isHi
          ? 'पंजीकरण सफल! आपका व्यक्तिगत पोर्टल लोड हो रहा है...'
          : 'Registration successful! Entering your sanctuary...'
      );
    }
  };

  // Handle ID Manager Add
  const handleIdManagerAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setMgrMsg(null);
    if (!mgrName.trim()) {
      setMgrMsg({ type: 'error', text: isHi ? 'कृपया नाम भरें।' : 'Please enter student name.' });
      return;
    }

    const created = addNewStudent({
      name: mgrName.trim(),
      email: `${mgrName.toLowerCase().replace(/\s+/g, '.')}@heritage.edu.in`,
      gradeNumber: mgrSection.split('-')[0] || '10',
      classSection: mgrSection || '10-A',
      rollNumber: String(allStudents.length + 1),
      stage: mgrStage,
      parentConsent: 'Approved',
      customPasscode: mgrId.trim() || undefined,
      passwordPin: mgrPin.trim() || '1234',
    });

    setMgrMsg({
      type: 'success',
      text: isHi
        ? `सफलतापूर्वक नया छात्र खाता बनाया गया! आईडी: ${created.studentPasscode} | पिन: ${created.passwordPin}`
        : `Successfully added new ID! ID: ${created.studentPasscode} | PIN: ${created.passwordPin}`,
    });

    setMgrName('');
    setMgrId('');
    setMgrPin('');
  };

  // Handle Delete Student ID
  const handleDeleteId = (studentId: string, studentName: string) => {
    const confirmMsg = isHi
      ? `क्या आप सचमुच विद्यार्थी "${studentName}" (आईडी: ${studentId}) को हटाना चाहते हैं? उनकी सीट खाली हो जाएगी।`
      : `Are you sure you want to remove student "${studentName}" (ID: ${studentId})? This will delete the account and free up their seat.`;

    if (window.confirm(confirmMsg)) {
      deleteStudent(studentId);
      setMgrMsg({
        type: 'success',
        text: isHi
          ? `आईडी "${studentId}" को सफलतापूर्वक हटा दिया गया है।`
          : `ID "${studentId}" has been removed. Seat freed.`,
      });
    }
  };

  // Handle Staff Submit
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStaff(staffRole, staffEmail);
  };

  // Handle Create School Submit
  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    const created = createSchoolLicense({
      schoolName: newSchoolName.trim(),
      maxSeats: newSchoolSeats || 50,
      contactEmail: newSchoolEmail || undefined,
    });

    setSchoolCreatedMsg(
      isHi
        ? `बधाई! "${created.schoolName}" का स्कूल कोड बनाया गया: ${created.key} (${created.maxSeats} सीटें)।`
        : `Created new school license: "${created.schoolName}" -> Code: ${created.key} (${created.maxSeats} seats).`
    );
    setSchoolKey(created.key);
    setTimeout(() => {
      setActiveTab('new_student');
      setSchoolCreatedMsg(null);
    }, 2500);
  };

  const selectedLic = schoolLicenses.find((l) => l.key === schoolKey) || schoolLicenses[0];
  const seatsRemaining = selectedLic ? Math.max(0, selectedLic.maxSeats - selectedLic.usedSeats) : 0;

  return (
    <div className="min-h-screen bg-[#F5F5EE] flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#2D6A4F] selection:text-white">
      {/* Top Utility Header: Language Switcher & Share */}
      <div className="max-w-xl mx-auto w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-[#D5D5CB] shadow-2xs">
          <Languages className="w-3.5 h-3.5 text-[#2D6A4F] ml-1 mr-0.5" />
          <button
            onClick={() => setAppLanguage('en')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              !isHi
                ? 'bg-[#2D6A4F] text-white shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setAppLanguage('hi')}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              isHi
                ? 'bg-[#2D6A4F] text-white shadow-2xs font-bold'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            हिन्दी (Hindi)
          </button>
        </div>

        <button
          onClick={() => setShareModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2D6A4F] bg-white border border-[#D5D5CB] rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{isHi ? 'स्कूल से शेयर करें' : 'Share School'}</span>
        </button>
      </div>

      {/* Brand Heading */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-1.5 mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#2D6A4F] text-xs font-semibold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-4 h-4" />
          <span>{isHi ? 'प्राइवेट एवं सुरक्षित पोर्टल' : 'Verified Institutional Access'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#192A24] tracking-tight">
          AAVYA
        </h1>
        <p className="text-xs text-[#52665C] max-w-sm mx-auto leading-relaxed">
          {isHi
            ? 'विद्यालयों एवं महाविद्यालयों के लिए निजी मानसिक स्वास्थ्य एवं व्यक्तिगत विकास मंच'
            : 'Private Digital Mental Wellbeing & Personal Growth Ecosystem for Schools, Colleges & Workplaces.'}
        </p>
      </div>

      {/* Main Container Card */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-6 px-4 sm:px-8 rounded-3xl shadow-xl border border-[#E2E2DA] space-y-5">
          {/* Main 5 Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 p-1 bg-[#EDEDE6] rounded-2xl text-[11px] font-semibold text-center">
            <button
              onClick={() => setActiveTab('student_login')}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer truncate ${
                activeTab === 'student_login'
                  ? 'bg-white text-[#192A24] shadow-xs font-bold'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              {isHi ? 'छात्र लॉगिन' : 'Student Login'}
            </button>
            <button
              onClick={() => setActiveTab('new_student')}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer truncate ${
                activeTab === 'new_student'
                  ? 'bg-white text-[#192A24] shadow-xs font-bold'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              {isHi ? 'नया छात्र' : 'Register Student'}
            </button>
            <button
              onClick={() => setActiveTab('id_manager')}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer truncate ${
                activeTab === 'id_manager'
                  ? 'bg-white text-[#2D6A4F] shadow-xs font-bold'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
              title={isHi ? 'आईडी व पासवर्ड जोड़ें / हटाएं' : 'Add / Remove Student IDs'}
            >
              {isHi ? 'आईडी प्रबंधन' : 'Manage IDs'}
            </button>
            <button
              onClick={() => setActiveTab('staff_login')}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer truncate ${
                activeTab === 'staff_login'
                  ? 'bg-white text-[#192A24] shadow-xs font-bold'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              {isHi ? 'स्टाफ/काउंसलर' : 'Staff / Admin'}
            </button>
            <button
              onClick={() => setActiveTab('new_school')}
              className={`py-2 px-1 rounded-xl transition-all cursor-pointer truncate ${
                activeTab === 'new_school'
                  ? 'bg-white text-emerald-800 shadow-xs font-bold'
                  : 'text-[#5C6E66] hover:text-[#192A24]'
              }`}
            >
              {isHi ? '+ नया स्कूल' : '+ New School'}
            </button>
          </div>

          {/* TAB 1: Student Login */}
          {activeTab === 'student_login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'स्टूडेंट आईडी / पासकोड (Student ID or Passcode)' : 'Student Passcode / Login ID / Roll No'}
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="Enter your private ID"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] uppercase tracking-wider"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'पासवर्ड / एक्सेस पिन (वैकल्पिक / Optional PIN)' : 'Password / Access PIN (Optional)'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[11px] text-neutral-500 hover:text-neutral-800 flex items-center gap-1 cursor-pointer"
                  >
                    {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPin ? (isHi ? 'छुपाएं' : 'Hide') : (isHi ? 'दिखाएं' : 'Show')}</span>
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={studentPin}
                    onChange={(e) => setStudentPin(e.target.value)}
                    placeholder={isHi ? 'पिन (डिफ़ॉल्ट 1234)' : 'PIN (Default: 1234)'}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isHi ? 'पोर्टल में प्रवेश करें' : 'Sign In to Student Sanctuary'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-neutral-100">
                <p className="text-[11px] text-neutral-500 text-center">
                  {isHi ? 'आपकी ID और password सुरक्षित server पर सत्यापित होते हैं।' : 'Your ID and password are verified securely on the server.'}
                </p>
              </div>
            </form>
          )}

          {/* TAB 2: Register New Student */}
          {activeTab === 'new_student' && (
            <form onSubmit={handleStudentRegister} className="space-y-3.5">
              <div className="p-3 bg-[#F0F7F3] border border-[#C7E4D2] rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#192A24]">
                  <span>{selectedLic?.schoolName || 'School License'}</span>
                  <span className="font-mono text-[#2D6A4F]">
                    {selectedLic ? `${selectedLic.usedSeats} / ${selectedLic.maxSeats} ${isHi ? 'सीटें' : 'Seats'}` : ''}
                  </span>
                </div>
                <div className="text-[11px] text-[#426150]">
                  {seatsRemaining > 0 ? (
                    <span>
                      🟢 <strong>{seatsRemaining} {isHi ? 'सीटें उपलब्ध हैं' : 'seats remaining'}</strong>
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold">
                      🔴 {isHi ? 'स्कूल लाइसेंस फुल है!' : 'License limit reached!'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'स्कूल लाइसेंस कोड (School Key)' : 'School License Key'}
                </label>
                <input
                  type="text"
                  value={schoolKey}
                  onChange={(e) => setSchoolKey(e.target.value)}
                  placeholder="HERITAGE-PILOT-50"
                  className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] uppercase"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'विद्यार्थी का नाम (Student Full Name)' : 'Student Full Name'}
                </label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="E.g., Aarav Sharma"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'मनपसंद आईडी (Custom ID)' : 'Choose Login ID'}
                  </label>
                  <input
                    type="text"
                    value={customLoginId}
                    onChange={(e) => setCustomLoginId(e.target.value)}
                    placeholder="E.g., AARAV-10"
                    className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'पासवर्ड / पिन (Password/PIN)' : 'Choose Password / PIN'}
                  </label>
                  <input
                    type="text"
                    value={customPassword}
                    onChange={(e) => setCustomPassword(e.target.value)}
                    placeholder="E.g., 1234 or Pass@1"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'आयु वर्ग (Cohort)' : 'Age Cohort'}
                  </label>
                  <select
                    value={studentStage}
                    onChange={(e) => setStudentStage(e.target.value as AgeStage)}
                    className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white"
                  >
                    <option value="classes_1_5">Classes 1–5</option>
                    <option value="classes_6_8">Classes 6–8</option>
                    <option value="classes_9_12">Classes 9–12</option>
                    <option value="college">College / University</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'सेक्शन (Section)' : 'Class / Section'}
                  </label>
                  <input
                    type="text"
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    placeholder="11-Sci"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                    required
                  />
                </div>
              </div>

              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={seatsRemaining === 0}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isHi ? 'सीट सुरक्षित करें और लॉगिन करें' : 'Claim Seat & Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: ID Manager (Add & Remove IDs and Passwords) */}
          {activeTab === 'id_manager' && (
            <div className="space-y-5">
              {/* How it works guidance */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <FileKey className="w-4 h-4 text-emerald-700" />
                  <span>
                    {isHi ? 'आईडी व पासवर्ड प्रबंधन (Add & Remove IDs)' : 'User ID & Password Management'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-normal">
                  {isHi
                    ? 'यहाँ से आप नए विद्यार्थी के लिए मनपसंद आईडी व पासवर्ड जोड़ सकते हैं, और किसी भी छात्र की आईडी को 1-क्लिक में हटा (Remove) सकते हैं जिससे सीट तुरंत खाली हो जाती है।'
                    : 'Add custom student login credentials with custom password/PIN, or remove any student ID to immediately free up their school seat.'}
                </p>
              </div>

              {/* Add New ID Form */}
              <form onSubmit={handleIdManagerAdd} className="p-4 bg-[#FAFAF8] rounded-2xl border border-[#E0E0D6] space-y-3">
                <span className="text-xs font-bold text-[#192A24] block">
                  {isHi ? '➕ नया आईडी व पासवर्ड जोड़ें (Add New ID & Password)' : '➕ Add New User ID & Password'}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                      {isHi ? 'विद्यार्थी का नाम' : 'Student Name'}
                    </label>
                    <input
                      type="text"
                      value={mgrName}
                      onChange={(e) => setMgrName(e.target.value)}
                      placeholder="E.g., Priya Sharma"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                      {isHi ? 'कक्षा / वर्ग (Cohort)' : 'Stage'}
                    </label>
                    <select
                      value={mgrStage}
                      onChange={(e) => setMgrStage(e.target.value as AgeStage)}
                      className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white"
                    >
                      <option value="classes_1_5">Classes 1–5</option>
                      <option value="classes_6_8">Classes 6–8</option>
                      <option value="classes_9_12">Classes 9–12</option>
                      <option value="college">College</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                      {isHi ? 'आईडी / पासकोड' : 'Custom ID / Code'}
                    </label>
                    <input
                      type="text"
                      value={mgrId}
                      onChange={(e) => setMgrId(e.target.value)}
                      placeholder="PRIYA-10A"
                      className="w-full px-3 py-2 text-xs font-mono uppercase rounded-xl border border-[#D5D5CB] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                      {isHi ? 'पासवर्ड / पिन' : 'Password / PIN'}
                    </label>
                    <input
                      type="text"
                      value={mgrPin}
                      onChange={(e) => setMgrPin(e.target.value)}
                      placeholder="1234"
                      className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#D5D5CB] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-600 block mb-0.5">
                      {isHi ? 'सेक्शन' : 'Section'}
                    </label>
                    <input
                      type="text"
                      value={mgrSection}
                      onChange={(e) => setMgrSection(e.target.value)}
                      placeholder="10-A"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isHi ? 'आईडी जोड़ें (Save New ID & PIN)' : 'Save New ID & PIN'}</span>
                </button>
              </form>

              {mgrMsg && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-start gap-2 ${
                    mgrMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{mgrMsg.text}</span>
                </div>
              )}

              {/* List of Registered Accounts with Remove Button */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#192A24]">
                    {isHi ? 'मौजूदा सक्रिय छात्र आईडी सूची' : 'Registered Student Accounts'} ({allStudents.length})
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {isHi ? 'हटाने के लिए ट्रैश आइकन दबाएं' : 'Click trash to remove'}
                  </span>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {allStudents.map((stu) => (
                    <div
                      key={stu.id}
                      className="p-2.5 bg-white border border-[#E5E5DC] rounded-xl flex items-center justify-between gap-3 text-xs hover:border-[#CAD7CF] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[#192A24] truncate flex items-center gap-1.5">
                          <span>{stu.name}</span>
                          <span className="text-[10px] font-normal px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                            {stu.classSection}
                          </span>
                        </div>
                        <div className="font-mono text-[10px] text-[#2D6A4F] flex items-center gap-2 mt-0.5">
                          <span>ID: {stu.studentPasscode || stu.anonymousId}</span>
                          <span>·</span>
                          <span>PIN: {stu.passwordPin || '1234'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setStudentCode(stu.studentPasscode || stu.anonymousId);
                            setStudentPin(stu.passwordPin || '1234');
                            setActiveTab('student_login');
                          }}
                          className="px-2 py-1 text-[10px] font-semibold text-[#2D6A4F] bg-[#E8F4EC] hover:bg-[#D5EAD9] rounded-lg cursor-pointer"
                        >
                          {isHi ? 'लॉगिन करें' : 'Login'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteId(stu.id, stu.name)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title={isHi ? 'इस आईडी को हटाएं (Delete ID)' : 'Delete this Student ID'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Staff & Faculty Login */}
          {activeTab === 'staff_login' && (
            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'स्टाफ पद (Role)' : 'Staff Role & Persona'}
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => {
                    const r = e.target.value as UserRole;
                    setStaffRole(r);
                    if (r === 'counsellor') setStaffEmail('priya.nair@heritage.edu.in');
                    else if (r === 'teacher') setStaffEmail('rajesh.sharma@heritage.edu.in');
                    else if (r === 'institution_admin') setStaffEmail('principal@heritage.edu.in');
                    else if (r === 'parent') setStaffEmail('anita.sen@yahoo.com');
                    else if (r === 'platform_admin') setStaffEmail('admin@aavya.health');
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white text-[#192A24]"
                >
                  <option value="counsellor">Dr. Priya Nair (Lead Clinical Counsellor)</option>
                  <option value="teacher">Mr. Rajesh Sharma (Faculty & Class Advisor)</option>
                  <option value="institution_admin">Dr. Sunita Kulkarni (Principal / School Admin)</option>
                  <option value="parent">Anita Sen (Parent Portal)</option>
                  <option value="platform_admin">Platform Super Admin</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'संस्थान ईमेल (Email)' : 'Institutional Email'}
                </label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'पासवर्ड / एक्सेस पिन' : 'Password / PIN'}
                </label>
                <input
                  type="password"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isHi ? 'स्टाफ वर्कस्पेस में प्रवेश करें' : 'Sign In to Staff Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 5: Register New School */}
          {activeTab === 'new_school' && (
            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <School className="w-4 h-4 text-emerald-700" />
                  <span>{isHi ? 'नया स्कूल / कॉलेज लाइसेंस बनाएं' : 'Provision New School License'}</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-normal">
                  {isHi
                    ? 'यहाँ से आप अपने स्कूल के नाम से नया लाइसेंस और छात्र सीट कोटा बना सकते हैं, जिसे आप सीधे छात्रों से साझा कर सकते हैं।'
                    : 'Generate a dedicated school license key and student capacity for any new educational institution.'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#192A24]">
                  {isHi ? 'स्कूल या कॉलेज का नाम' : 'School / College Name'}
                </label>
                <input
                  type="text"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  placeholder="E.g., Delhi Public School / St. Xavier's High School"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8] focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'छात्र क्षमता (Seat Quota)' : 'Student Capacity'}
                  </label>
                  <select
                    value={newSchoolSeats}
                    onChange={(e) => setNewSchoolSeats(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-xl border border-[#D5D5CB] bg-white"
                  >
                    <option value={30}>30 {isHi ? 'विद्यार्थी (Trial)' : 'Students (Trial)'}</option>
                    <option value={50}>50 {isHi ? 'विद्यार्थी (Pilot)' : 'Students (Pilot)'}</option>
                    <option value={100}>100 {isHi ? 'विद्यार्थी (Multi-Class)' : 'Students (Multi-Class)'}</option>
                    <option value={250}>250 {isHi ? 'विद्यार्थी (Cohort)' : 'Students (Cohort)'}</option>
                    <option value={500}>500 {isHi ? 'विद्यार्थी (Full Campus)' : 'Students (Full Campus)'}</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#192A24]">
                    {isHi ? 'कोऑर्डिनेटर ईमेल' : 'Coordinator Email'}
                  </label>
                  <input
                    type="email"
                    value={newSchoolEmail}
                    onChange={(e) => setNewSchoolEmail(e.target.value)}
                    placeholder="principal@school.edu"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5D5CB] bg-[#FAFAF8]"
                  />
                </div>
              </div>

              {schoolCreatedMsg && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-medium">
                  {schoolCreatedMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#23533E] rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isHi ? 'नया स्कूल कोड जारी करें' : 'Generate School License'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-between text-xs text-[#52665C] px-2">
          <span>{isHi ? 'DPDP एवं FERPA गोपनीयता मानकों के अनुरूप' : 'DPDP Act & FERPA Safeguarding Compliant'}</span>
          <span className="font-mono text-[10px]">v2.4 Active</span>
        </div>
      </div>
    </div>
  );
};
