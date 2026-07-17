// =====================================================
// CBSE Examination Configuration
// Official CBSE grading, subjects, and marksheet format
// =====================================================

// CBSE 9-Point Grading Scale
export const CBSE_GRADES = [
  { grade: 'A1', minMarks: 91, maxMarks: 100, gradePoint: 10, remarks: 'Outstanding' },
  { grade: 'A2', minMarks: 81, maxMarks: 90, gradePoint: 9, remarks: 'Excellent' },
  { grade: 'B1', minMarks: 71, maxMarks: 80, gradePoint: 8, remarks: 'Very Good' },
  { grade: 'B2', minMarks: 61, maxMarks: 70, gradePoint: 7, remarks: 'Good' },
  { grade: 'C1', minMarks: 51, maxMarks: 60, gradePoint: 6, remarks: 'Above Average' },
  { grade: 'C2', minMarks: 41, maxMarks: 50, gradePoint: 5, remarks: 'Average' },
  { grade: 'D', minMarks: 33, maxMarks: 40, gradePoint: 4, remarks: 'Below Average' },
  { grade: 'E', minMarks: 0, maxMarks: 32, gradePoint: 0, remarks: 'Needs Improvement' },
];

// CBSE Exam Terms
export const CBSE_TERMS = [
  { id: 'PERIODIC_TEST_1', name: 'Periodic Test 1', weightage: 5 },
  { id: 'PERIODIC_TEST_2', name: 'Periodic Test 2', weightage: 5 },
  { id: 'HALF_YEARLY', name: 'Half Yearly Examination', weightage: 40 },
  { id: 'PERIODIC_TEST_3', name: 'Periodic Test 3', weightage: 5 },
  { id: 'PERIODIC_TEST_4', name: 'Periodic Test 4', weightage: 5 },
  { id: 'ANNUAL', name: 'Annual Examination', weightage: 40 },
];

// CBSE Subjects by Class (Class 9-10)
export const CBSE_SUBJECTS_SECONDARY = [
  { code: '184', name: 'English Language & Literature', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '085', name: 'Hindi Course-A', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '041', name: 'Mathematics', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '086', name: 'Science', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '087', name: 'Social Science', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '402', name: 'Information Technology', maxTheory: 50, maxInternal: 50, hasInternal: true },
];

// CBSE Subjects (Class 11-12 Science)
export const CBSE_SUBJECTS_SENIOR_SCIENCE = [
  { code: '301', name: 'English Core', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '042', name: 'Physics', maxTheory: 70, maxPractical: 30, hasPractical: true },
  { code: '043', name: 'Chemistry', maxTheory: 70, maxPractical: 30, hasPractical: true },
  { code: '041', name: 'Mathematics', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '083', name: 'Computer Science', maxTheory: 70, maxPractical: 30, hasPractical: true },
];

// CBSE Subjects (Class 11-12 Commerce)
export const CBSE_SUBJECTS_SENIOR_COMMERCE = [
  { code: '301', name: 'English Core', maxTheory: 80, maxInternal: 20, hasInternal: true },
  { code: '055', name: 'Accountancy', maxTheory: 80, maxProject: 20, hasProject: true },
  { code: '054', name: 'Business Studies', maxTheory: 80, maxProject: 20, hasProject: true },
  { code: '030', name: 'Economics', maxTheory: 80, maxProject: 20, hasProject: true },
  { code: '041', name: 'Mathematics', maxTheory: 80, maxInternal: 20, hasInternal: true },
];

// Co-Scholastic Areas (CBSE mandatory)
export const CO_SCHOLASTIC = [
  { name: 'Work Education', grades: ['A', 'B', 'C', 'D', 'E'] },
  { name: 'Art Education', grades: ['A', 'B', 'C', 'D', 'E'] },
  { name: 'Health & Physical Education', grades: ['A', 'B', 'C', 'D', 'E'] },
];

// Discipline Grades
export const DISCIPLINE_GRADES = ['A', 'B', 'C', 'D', 'E'];

// Helper: Get grade from marks
export function getGradeFromMarks(marks) {
  if (marks === null || marks === undefined || marks === '') return { grade: '-', gradePoint: 0, remarks: '' };
  const m = Number(marks);
  for (const g of CBSE_GRADES) {
    if (m >= g.minMarks && m <= g.maxMarks) return g;
  }
  return CBSE_GRADES[CBSE_GRADES.length - 1];
}

// Helper: Calculate CGPA
export function calculateCGPA(gradePoints) {
  const valid = gradePoints.filter(gp => gp > 0);
  if (valid.length === 0) return 0;
  return (valid.reduce((sum, gp) => sum + gp, 0) / valid.length).toFixed(1);
}

// Helper: CGPA to Percentage (CBSE formula)
export function cgpaToPercentage(cgpa) {
  return (cgpa * 9.5).toFixed(1);
}

// Get subjects by class level
export function getSubjectsByClass(classNumeric) {
  if (classNumeric >= 11) return CBSE_SUBJECTS_SENIOR_SCIENCE;
  return CBSE_SUBJECTS_SECONDARY;
}
