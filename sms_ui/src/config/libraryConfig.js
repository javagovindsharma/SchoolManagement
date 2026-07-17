// =====================================================
// Library Management Configuration
// Standard School Library Rules & Processes
// =====================================================

const libraryConfig = {
  // ===== LIBRARY RULES =====
  rules: {
    maxBooksPerStudent: 3,
    maxBooksPerTeacher: 5,
    issuePeriodStudentDays: 14,
    issuePeriodTeacherDays: 30,
    renewalAllowed: true,
    maxRenewals: 2,
    renewalPeriodDays: 7,
    reservationAllowed: true,
    reservationHoldDays: 3,
  },

  // ===== FINE STRUCTURE =====
  fines: {
    lateReturnPerDay: 2,        // ₹2 per day
    maxFinePerBook: 100,        // Max ₹100 fine per book
    lostBookFine: 'double',     // Double the book price
    damagedBookFine: 'half',    // Half the book price
    tornPageFine: 50,           // ₹50 per torn page
    lostCardFine: 50,           // ₹50 for lost library card
  },

  // ===== BOOK CATEGORIES (DDC - Dewey Decimal Classification) =====
  categories: [
    { code: '000', name: 'General Knowledge & Computer Science' },
    { code: '100', name: 'Philosophy & Psychology' },
    { code: '200', name: 'Religion & Mythology' },
    { code: '300', name: 'Social Sciences' },
    { code: '400', name: 'Languages & Linguistics' },
    { code: '500', name: 'Science & Mathematics' },
    { code: '600', name: 'Technology & Applied Science' },
    { code: '700', name: 'Arts & Recreation' },
    { code: '800', name: 'Literature' },
    { code: '900', name: 'History & Geography' },
    // School-specific categories
    { code: 'TXT', name: 'Text Books (NCERT/CBSE)' },
    { code: 'REF', name: 'Reference Books' },
    { code: 'ENC', name: 'Encyclopedia' },
    { code: 'FIC', name: 'Fiction & Stories' },
    { code: 'BIO', name: 'Biography & Autobiography' },
    { code: 'MAG', name: 'Magazines & Periodicals' },
    { code: 'JRN', name: 'Journals & Research Papers' },
    { code: 'COM', name: 'Competitive Exam Books' },
    { code: 'DIG', name: 'Digital / E-Books' },
  ],

  // ===== BOOK CONDITIONS =====
  conditions: [
    { value: 'NEW', label: 'New', color: '#16a34a' },
    { value: 'GOOD', label: 'Good', color: '#2563eb' },
    { value: 'FAIR', label: 'Fair', color: '#d97706' },
    { value: 'POOR', label: 'Poor', color: '#dc2626' },
    { value: 'DAMAGED', label: 'Damaged', color: '#dc2626' },
    { value: 'LOST', label: 'Lost', color: '#000000' },
  ],

  // ===== ISSUE STATUS =====
  issueStatuses: [
    { value: 'ISSUED', label: 'Issued', color: '#d97706' },
    { value: 'RETURNED', label: 'Returned', color: '#16a34a' },
    { value: 'OVERDUE', label: 'Overdue', color: '#dc2626' },
    { value: 'LOST', label: 'Lost', color: '#000000' },
    { value: 'RENEWED', label: 'Renewed', color: '#2563eb' },
    { value: 'RESERVED', label: 'Reserved', color: '#7c3aed' },
  ],

  // ===== LIBRARY PROCESSES =====
  processes: {
    // 1. Book Acquisition Process
    acquisition: [
      'Identify need / Teacher recommendation',
      'Check budget availability',
      'Search vendor catalogs',
      'Create purchase order',
      'Receive books & verify',
      'Stamp & label books',
      'Catalog in system (DDC classification)',
      'Place on shelf',
    ],

    // 2. Book Issue Process
    issue: [
      'Student/Staff presents library card',
      'Verify membership & check limits',
      'Check for outstanding fines',
      'Scan/enter book barcode/accession no',
      'System checks availability',
      'Set due date (14 days student / 30 days staff)',
      'Update book status to ISSUED',
      'Generate issue slip',
      'Hand over book',
    ],

    // 3. Book Return Process
    returnProcess: [
      'Student/Staff presents book',
      'Scan/enter book barcode',
      'System calculates due date vs return date',
      'If overdue: calculate fine (₹2/day)',
      'Inspect book condition',
      'If damaged: assess damage fine',
      'Collect fine (if any)',
      'Generate fine receipt',
      'Update book status to AVAILABLE',
      'Place book back on shelf',
    ],

    // 4. Book Renewal Process
    renewal: [
      'Student requests renewal (online/in-person)',
      'Check if renewal limit reached (max 2)',
      'Check if book has reservation',
      'If no reservation: extend due date by 7 days',
      'Update issue record',
      'Notify student of new due date',
    ],

    // 5. Book Reservation Process
    reservation: [
      'Student requests reservation for unavailable book',
      'System adds to reservation queue',
      'When book is returned: notify first in queue',
      'Student has 3 days to collect',
      'If not collected: move to next in queue',
    ],

    // 6. Fine Collection Process
    fineCollection: [
      'System auto-calculates fine on overdue return',
      'Fine = Days overdue × ₹2/day (max ₹100)',
      'Lost book: Double the book price',
      'Damaged book: Half the book price',
      'Generate fine receipt',
      'Record payment in system',
      'Clear student fine record',
    ],

    // 7. Stock Verification Process (Annual)
    stockVerification: [
      'Plan stock verification date (usually summer vacation)',
      'Print shelf list from system',
      'Physically verify each book on shelf',
      'Mark books as verified/missing/damaged',
      'Generate discrepancy report',
      'Write off lost/damaged books (with approval)',
      'Update inventory in system',
      'Submit report to principal',
    ],

    // 8. Weeding/Disposal Process
    weeding: [
      'Identify old/outdated/damaged books',
      'Check last issue date (not issued in 5+ years)',
      'Create disposal list',
      'Get principal approval',
      'Remove from catalog',
      'Dispose/donate/recycle',
      'Update records',
    ],
  },

  // ===== LIBRARY TIMINGS =====
  timings: {
    openTime: '08:00',
    closeTime: '16:00',
    lunchBreak: { start: '12:30', end: '13:00' },
    issueHours: { start: '08:30', end: '15:30' },
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    closedOn: ['Sunday', 'Public Holidays'],
  },

  // ===== ACCESSION NUMBER FORMAT =====
  // Format: YEAR/CATEGORY/SERIAL
  // Example: 2025/SCI/00145
  accessionFormat: '{YEAR}/{CATEGORY}/{SERIAL:5}',

  // ===== REPORTS =====
  reports: [
    'Daily Issue/Return Report',
    'Monthly Circulation Report',
    'Fine Collection Report',
    'Overdue Books Report',
    'Most Issued Books Report',
    'Category-wise Book Count',
    'Student-wise Issue History',
    'Stock Verification Report',
    'New Additions Report',
    'Budget Utilization Report',
  ],
};

export default libraryConfig;
