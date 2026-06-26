import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navigation
    dashboard:     'Dashboard',
    students:      'Students',
    teachers:      'Teachers',
    classes:       'Classes',
    subjects:      'Subjects',
    announcements: 'Announcements',
    reports:       'Reports',
    logout:        'Logout',

    // Dashboard
    totalStudents: 'Total Students',
    totalTeachers: 'Total Teachers',
    totalClasses:  'Total Classes',
    totalSubjects: 'Total Subjects',
    recentStudents:'Recent Students',
    quickActions:  'Quick Actions',
    addStudent:    'Add New Student',
    addTeacher:    'Add New Teacher',
    postAnnouncement: 'Post Announcement',
    viewReports:   'View Reports',

    // Students
    studentList:   'Students',
    addNewStudent: 'Add Student',
    searchStudents:'Search students...',
    admNo:         'Adm No',
    name:          'Name',
    email:         'Email',
    phone:         'Phone',
    className:     'Class',
    status:        'Status',
    actions:       'Actions',
    active:        'Active',
    inactive:      'Inactive',
    edit:          'Edit',
    delete:        'Delete',
    noStudents:    'No students found.',

    // Add Student
    addStudentTitle:  'Add New Student',
    personalInfo:     'Personal Information',
    academicInfo:     'Academic Information',
    fullName:         'Full Name',
    gender:           'Gender',
    dateOfBirth:      'Date of Birth',
    address:          'Address',
    parentName:       'Parent Name',
    parentContact:    'Parent Contact',
    selectClass:      'Select Class',
    selectGender:     'Select Gender',
    saveStudent:      'Save Student',
    cancel:           'Cancel',
    back:             'Back',

    // Login
    signIn:           'Sign In',
    signingIn:        'Signing in...',
    emailAddress:     'Email Address',
    password:         'Password',
    enterEmail:       'Enter your email',
    enterPassword:    'Enter your password',
    demoCredentials:  'DEMO CREDENTIALS',
    invalidLogin:     'Invalid email or password.',
    systemTitle:      'School Management',
    systemSubtitle:   'Cloud-Based Academic System',

    // Teacher
    myClasses:        'My Classes',
    markAttendance:   'Mark Attendance',
    enterMarks:       'Enter Marks',
    viewRequests:     'View Requests',
    mySchedule:       'My Schedule',
    pendingRequests:  'Pending Requests',

    // Student
    viewAttendance:   'View Attendance',
    viewMyMarks:      'View My Marks',
    classSchedule:    'Class Schedule',
    submitRequest:    'Submit Request',
    recentMarks:      'Recent Marks',
    overallGrade:     'Overall Grade',

    // Attendance
    present:  'Present',
    absent:   'Absent',
    late:     'Late',
    saveAttendance: 'Save Attendance',
    allPresent: 'All Present',
    allAbsent:  'All Absent',

    // Common
    save:     'Save',
    update:   'Update',
    close:    'Close',
    search:   'Search',
    filter:   'Filter',
    all:      'All',
    yes:      'Yes',
    no:       'No',
    loading:  'Loading...',
    success:  'Success',
    error:    'Error',
    date:     'Date',
    subject:  'Subject',
    score:    'Score',
    grade:    'Grade',
    welcome:  'Welcome',
  },

  si: {
    // Navigation
    dashboard:     'උපකරණ පුවරුව',
    students:      'සිසුන්',
    teachers:      'ගුරුවරුන්',
    classes:       'පන්ති',
    subjects:      'විෂයයන්',
    announcements: 'නිවේදන',
    reports:       'වාර්තා',
    logout:        'පිටවීම',

    // Dashboard
    totalStudents: 'සිසුන් සංඛ්‍යාව',
    totalTeachers: 'ගුරුවරුන් සංඛ්‍යාව',
    totalClasses:  'පන්ති සංඛ්‍යාව',
    totalSubjects: 'විෂය සංඛ්‍යාව',
    recentStudents:'මෑත සිසුන්',
    quickActions:  'ඉක්මන් ක්‍රියා',
    addStudent:    'සිසුවෙකු එකතු කරන්න',
    addTeacher:    'ගුරුවරයෙකු එකතු කරන්න',
    postAnnouncement: 'නිවේදනයක් පළ කරන්න',
    viewReports:   'වාර්තා බලන්න',

    // Students
    studentList:   'සිසුන්',
    addNewStudent: 'සිසුවෙකු එකතු කරන්න',
    searchStudents:'සිසුන් සොයන්න...',
    admNo:         'ඇතුළත් අංකය',
    name:          'නම',
    email:         'විද්‍යුත් තැපෑල',
    phone:         'දුරකථනය',
    className:     'පන්තිය',
    status:        'තත්ත්වය',
    actions:       'ක්‍රියා',
    active:        'සක්‍රිය',
    inactive:      'අක්‍රිය',
    edit:          'සංස්කරණය',
    delete:        'මකන්න',
    noStudents:    'සිසුන් හමු නොවීය.',

    // Add Student
    addStudentTitle:  'නව සිසුවෙකු එකතු කරන්න',
    personalInfo:     'පෞද්ගලික තොරතුරු',
    academicInfo:     'අධ්‍යාපනික තොරතුරු',
    fullName:         'සම්පූර්ණ නම',
    gender:           'ස්ත්‍රී පුරුෂ භාවය',
    dateOfBirth:      'උපන් දිනය',
    address:          'ලිපිනය',
    parentName:       'දෙමාපිය නම',
    parentContact:    'දෙමාපිය දුරකථනය',
    selectClass:      'පන්තිය තෝරන්න',
    selectGender:     'ස්ත්‍රී පුරුෂ භාවය තෝරන්න',
    saveStudent:      'සිසුවා සුරකින්න',
    cancel:           'අවලංගු කරන්න',
    back:             'ආපසු',

    // Login
    signIn:           'පිවිසෙන්න',
    signingIn:        'පිවිසෙමින්...',
    emailAddress:     'විද්‍යුත් තැපෑල',
    password:         'මුරපදය',
    enterEmail:       'විද්‍යුත් තැපෑල ඇතුළත් කරන්න',
    enterPassword:    'මුරපදය ඇතුළත් කරන්න',
    demoCredentials:  'නිරූපණ අක්තපත්‍ර',
    invalidLogin:     'වලංගු නොවන විද්‍යුත් තැපෑල හෝ මුරපදය.',
    systemTitle:      'පාසල් කළමනාකරණ පද්ධතිය',
    systemSubtitle:   'වලාකුළු පාදක අධ්‍යාපනික පද්ධතිය',

    // Teacher
    myClasses:        'මගේ පන්ති',
    markAttendance:   'පැමිණීම සටහන් කරන්න',
    enterMarks:       'ලකුණු ඇතුළත් කරන්න',
    viewRequests:     'ඉල්ලීම් බලන්න',
    mySchedule:       'මගේ කාලසටහන',
    pendingRequests:  'අපේක්ෂිත ඉල්ලීම්',

    // Student
    viewAttendance:   'පැමිණීම බලන්න',
    viewMyMarks:      'මගේ ලකුණු බලන්න',
    classSchedule:    'පන්ති කාලසටහන',
    submitRequest:    'ඉල්ලීමක් ඉදිරිපත් කරන්න',
    recentMarks:      'මෑත ලකුණු',
    overallGrade:     'සමස්ත ශ්‍රේණිය',

    // Attendance
    present:  'පැමිණ ඇත',
    absent:   'නොපැමිණ',
    late:     'ප්‍රමාද',
    saveAttendance: 'පැමිණීම සුරකින්න',
    allPresent: 'සියල්ලෝ පැමිණ ඇත',
    allAbsent:  'සියල්ලෝ නොපැමිණ',

    // Common
    save:     'සුරකින්න',
    update:   'යාවත්කාලීන කරන්න',
    close:    'වසන්න',
    search:   'සොයන්න',
    filter:   'පෙරහන',
    all:      'සියල්ල',
    yes:      'ඔව්',
    no:       'නැත',
    loading:  'පූරණය වෙමින්...',
    success:  'සාර්ථකයි',
    error:    'දෝෂයකි',
    date:     'දිනය',
    subject:  'විෂය',
    score:    'ලකුණු',
    grade:    'ශ්‍රේණිය',
    welcome:  'සාදරයෙන් පිළිගනිමු',
  },
  hi: {
    // Navigation
    dashboard:     'डैशबोर्ड',
    students:      'छात्र',
    teachers:      'शिक्षक',
    classes:       'कक्षाएँ',
    subjects:      'विषय',
    announcements: 'घोषणाएँ',
    reports:       'रिपोर्ट्स',
    logout:        'लॉग आउट',

    // Dashboard
    totalStudents: 'कुल छात्र',
    totalTeachers: 'कुल शिक्षक',
    totalClasses:  'कुल कक्षाएँ',
    totalSubjects: 'कुल विषय',
    recentStudents:'हाल के छात्र',
    quickActions:  'त्वरित कार्य',
    addStudent:    'छात्र जोड़ें',
    addTeacher:    'शिक्षक जोड़ें',
    postAnnouncement: 'घोषणा प्रकाशित करें',
    viewReports:   'रिपोर्ट्स देखें',

    // Students
    studentList:   'छात्र सूची',
    addNewStudent: 'नया छात्र जोड़ें',
    searchStudents:'छात्र खोजें...',
    admNo:         'प्रवेश संख्या',
    name:          'नाम',
    email:         'ईमेल',
    phone:         'फोन',
    className:     'कक्षा',
    status:        'स्थिति',
    actions:       'कार्य',
    active:        'सक्रिय',
    inactive:      'निष्क्रिय',
    edit:          'संपादित करें',
    delete:        'हटाएँ',
    noStudents:    'कोई छात्र नहीं मिला।',

    // Add Student
    addStudentTitle:  'नया छात्र जोड़ें',
    personalInfo:     'व्यक्तिगत जानकारी',
    academicInfo:     'शैक्षणिक जानकारी',
    fullName:         'पूरा नाम',
    gender:           'लिंग',
    dateOfBirth:      'जन्म तिथि',
    address:          'पता',
    parentName:       'अभिभावक का नाम',
    parentContact:    'अभिभावक संपर्क',
    selectClass:      'कक्षा चुनें',
    selectGender:     'लिंग चुनें',
    saveStudent:      'छात्र सहेजें',
    cancel:           'रद्द करें',
    back:             'वापस',

    // Login
    signIn:           'साइन इन करें',
    signingIn:        'साइन इन हो रहा है...',
    emailAddress:     'ईमेल पता',
    password:         'पासवर्ड',
    enterEmail:       'ईमेल दर्ज करें',
    enterPassword:    'पासवर्ड दर्ज करें',
    demoCredentials:  'डेमो क्रेडेंशियल्स',
    invalidLogin:     'अमान्य ईमेल या पासवर्ड।',
    systemTitle:      'स्कूल प्रबंधन प्रणाली',
    systemSubtitle:   'क्लाउड आधारित शिक्षा प्रबंधन प्रणाली',

    // Teacher
    myClasses:        'मेरी कक्षाएँ',
    markAttendance:   'उपस्थिति दर्ज करें',
    enterMarks:       'अंक दर्ज करें',
    viewRequests:     'अनुरोध देखें',
    mySchedule:       'मेरा समय-सारिणी',
    pendingRequests:  'लंबित अनुरोध',

    // Student
    viewAttendance:   'उपस्थिति देखें',
    viewMyMarks:      'मेरे अंक देखें',
    classSchedule:    'कक्षा समय-सारिणी',
    submitRequest:    'अनुरोध जमा करें',
    recentMarks:      'हाल के अंक',
    overallGrade:     'समग्र ग्रेड',

    // Attendance
    present:  'उपस्थित',
    absent:   'अनुपस्थित',
    late:     'देर से',
    saveAttendance: 'उपस्थिति सहेजें',
    allPresent: 'सभी उपस्थित',
    allAbsent:  'सभी अनुपस्थित',

    // Common
    save:     'सहेजें',
    update:   'अपडेट करें',
    close:    'बंद करें',
    search:   'खोजें',
    filter:   'फ़िल्टर',
    all:      'सभी',
    yes:      'हाँ',
    no:       'नहीं',
    loading:  'लोड हो रहा है...',
    success:  'सफल',
    error:    'त्रुटि',
    date:     'तिथि',
    subject:  'विषय',
    score:    'अंक',
    grade:    'ग्रेड',
    welcome:  'स्वागत है',
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}