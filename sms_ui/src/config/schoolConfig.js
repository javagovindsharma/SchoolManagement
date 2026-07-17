// =====================================================
// School Configuration - Change school details here ONLY
// All pages will automatically use these values
// =====================================================

const schoolConfig = {
  // School Name & Branding
  name: 'DilDarNagar Public School',
  shortName: 'DPS',
  tagline: 'Nurturing Excellence, Building Character, Shaping Future Leaders',
  motto: 'Service Before Self',

  // Affiliation
  board: 'CBSE',
  affiliationNo: '2730001',
  establishedYear: 1949,

  // Contact
  email: 'info@dps.edu.in',
  phone: '+91-11-12345678',
  website: 'www.dps.edu.in',

  // Address (Main Campus)
  address: 'Station Road, DilDar Nagar - 232326',
  city: 'DilDar Nagar',
  state: 'Uttar Pradesh',
  country: 'India',

  // Principal
  principalName: 'Mr. Govind Sharma',
  chairmanName: 'Mr. Pradeep Pal',

  // Social Media
  social: {
    facebook: 'https://facebook.com/dpsschool',
    twitter: 'https://twitter.com/dpsschool',
    instagram: 'https://instagram.com/dpsschool',
    youtube: 'https://youtube.com/dpsschool',
  },

  // Branches
  branches: [
    { name: 'DPS Main Campus', code: 'DPS-MAIN', city: 'New Delhi', phone: '+91-11-11111111', email: 'main@dps.edu.in', address: 'Mathura Road, New Delhi - 110001', principal: 'Dr. Rajesh Kumar', established: 1949 },
    { name: 'DPS East Campus', code: 'DPS-EAST', city: 'New Delhi', phone: '+91-11-22222222', email: 'east@dps.edu.in', address: 'Patparganj, New Delhi - 110092', principal: 'Mrs. Priya Sharma', established: 2005 },
    { name: 'DPS South Campus', code: 'DPS-SOUTH', city: 'New Delhi', phone: '+91-11-33333333', email: 'south@dps.edu.in', address: 'Saket, New Delhi - 110017', principal: 'Mr. Anil Verma', established: 2010 },
  ],

  // Theme Colors (used in hero gradient etc.)
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#1e3a5f',
  },

  // Logo (emoji or image URL)
  logo: '🏫',
  // logoUrl: '/images/school-logo.png',  // Uncomment if using image

  // ERP Branding
  erpName: 'DPS ERP System',
  erpShortName: 'DPS ERP',
};

export default schoolConfig;
