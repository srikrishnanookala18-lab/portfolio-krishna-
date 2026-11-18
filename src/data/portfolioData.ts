export interface SkillRef {
  label: string;
  target?: string;
  proj?: 'jiosense' | 'jainsmart';
  external?: string;
}

export interface SkillItem {
  name: string;
  level: string;
  cat:
    | 'Programming Languages'
    | 'Python / AI-ML Libraries'
    | 'Web & Database'
    | 'Core Concepts'
    | 'Development Tools';
  desc: string;
  refs: SkillRef[];
}

export interface SemesterGpa {
  label: string;
  gpa: number | null;
  note: string;
}

export interface CityWeather {
  temp: string;
  humidity: string;
  wind: string;
  pressure: string;
  uv: string;
  comfort: string;
  alert: {
    level: 'Advisory' | 'Clear' | 'Heat Alert';
    text: string;
  };
  hourly: { t: string; v: number }[];
  daily: { t: string; v: number }[];
}

export interface CampusRoom {
  id: string;
  name: string;
  floor: 1 | 2 | 3;
  type: 'Facility' | 'Laboratory' | 'Classroom';
  status: 'Open' | 'Occupied' | 'Available';
  x: number;
  y: number;
  w: number;
  h: number;
}

export const PROFILE = {
  name: 'Nookala Sri Krishna',
  role: 'Second-Year B.Tech CSE (AI & ML) · Python Developer & AI/ML Engineer Aspirant',
  location: 'Hyderabad, Telangana',
  university: 'Jain University, Bengaluru',
  degree: 'B.Tech, Computer Science & Engineering (AI & ML)',
  batch: '2025 – 2029',
  summary:
    'Second-year B.Tech Computer Science and Engineering (AI & ML) student at Jain University, aspiring to work as a Python Developer or AI/ML Engineer. Brings intermediate Python and Java skills, team project experience, and exposure to data and machine-learning libraries, API integration, and backend development.',
  email: 'srikrishnanookala18@gmail.com',
  githubUrl: 'https://github.com/srikrishnanookala18-lab',
  githubHandle: 'srikrishnanookala18-lab',
  linkedinUrl: 'https://www.linkedin.com/in/sri-krishna-nookala-19758a44b',
  linkedinHandle: 'sri-krishna-nookala',
  heroImage: '/src/assets/images/hero_workspace_still_life_1795023668427.jpg',
};

export const KPI_METRICS = [
  { label: 'Semester 1 GPA', value: '9.02', sub: 'Jain University' },
  { label: 'Semester 2 GPA', value: '8.86', sub: '2025 – 2029 Batch' },
  { label: 'Mean GPA (S1–S2)', value: '8.94', sub: 'Cumulative standing' },
  { label: 'Team Projects', value: '02', sub: 'APIs, Backend & AI' },
];

export const SEMESTERS: SemesterGpa[] = [
  { label: 'Sem 1', gpa: 9.02, note: 'Completed' },
  { label: 'Sem 2', gpa: 8.86, note: 'Completed' },
  { label: 'Sem 3', gpa: null, note: 'Upcoming' },
  { label: 'Sem 4', gpa: null, note: 'Upcoming' },
  { label: 'Sem 5', gpa: null, note: 'Upcoming' },
  { label: 'Sem 6', gpa: null, note: 'Upcoming' },
  { label: 'Sem 7', gpa: null, note: 'Upcoming' },
  { label: 'Sem 8', gpa: null, note: 'Upcoming' },
];

export const SKILL_CATEGORIES = [
  'All',
  'Programming Languages',
  'Python / AI-ML Libraries',
  'Web & Database',
  'Core Concepts',
  'Development Tools',
] as const;

export const SKILLS_DATA: SkillItem[] = [
  {
    name: 'Python',
    level: 'Intermediate',
    cat: 'Programming Languages',
    desc: "Primary language for problem solving, data handling, and AI/ML exploration, reinforced by completing '100 Days of Code: The Complete Python Pro Bootcamp' on Udemy.",
    refs: [
      { label: 'Udemy: 100 Days of Code Python Bootcamp', target: '#education' },
      { label: 'Libraries: NumPy, Pandas, PyTorch', target: '#skills' },
    ],
  },
  {
    name: 'Java',
    level: 'Intermediate',
    cat: 'Programming Languages',
    desc: 'Used alongside Data Structures & Algorithms and Object-Oriented Programming coursework in B.Tech CSE (AI & ML).',
    refs: [
      { label: 'Core CS: DSA & OOP', target: '#skills' },
      { label: 'IDE: IntelliJ IDEA', target: '#skills' },
    ],
  },
  {
    name: 'HTML',
    level: 'Beginner',
    cat: 'Web & Database',
    desc: 'Semantic markup used in collaborative web dashboard development.',
    refs: [{ label: 'Project: Jio Sense Weather Dashboard', target: '#projects', proj: 'jiosense' }],
  },
  {
    name: 'CSS',
    level: 'Beginner',
    cat: 'Web & Database',
    desc: 'Responsive layout and styling for web dashboard interfaces.',
    refs: [{ label: 'Project: Jio Sense Weather Dashboard', target: '#projects', proj: 'jiosense' }],
  },
  {
    name: 'MySQL',
    level: 'Database',
    cat: 'Web & Database',
    desc: 'Relational database management and structured querying.',
    refs: [{ label: 'Project: JAIN Smart Navigation (DB Management)', target: '#projects', proj: 'jainsmart' }],
  },
  {
    name: 'NumPy',
    level: 'Python / AI-ML Library',
    cat: 'Python / AI-ML Libraries',
    desc: 'Numerical array computing foundation for Python data and machine-learning workflows.',
    refs: [{ label: 'Degree: B.Tech CSE (AI & ML)', target: '#education' }],
  },
  {
    name: 'Pandas',
    level: 'Python / AI-ML Library',
    cat: 'Python / AI-ML Libraries',
    desc: 'Tabular data analysis, cleaning, and manipulation in Python.',
    refs: [{ label: 'Degree: B.Tech CSE (AI & ML)', target: '#education' }],
  },
  {
    name: 'PyTorch',
    level: 'Python / AI-ML Library',
    cat: 'Python / AI-ML Libraries',
    desc: 'Exposure to tensor operations and machine-learning / deep-learning experimentation.',
    refs: [{ label: 'Focus: Aspiring AI/ML Engineer', target: '#top' }],
  },
  {
    name: 'Data Structures & Algorithms (DSA)',
    level: 'Core Concept',
    cat: 'Core Concepts',
    desc: 'Algorithmic problem solving, efficiency reasoning, and foundational data structures.',
    refs: [{ label: 'Languages: Python & Java', target: '#skills' }],
  },
  {
    name: 'Object-Oriented Programming (OOP)',
    level: 'Core Concept',
    cat: 'Core Concepts',
    desc: 'Modular software architecture via encapsulation, inheritance, and polymorphism.',
    refs: [{ label: 'Languages: Java & Python', target: '#skills' }],
  },
  {
    name: 'VS Code',
    level: 'Development Tool',
    cat: 'Development Tools',
    desc: 'Code editor used for web projects, API integration, and frontend/backend collaboration.',
    refs: [{ label: 'Projects: Jio Sense & JAIN Smart Navigation', target: '#projects' }],
  },
  {
    name: 'IntelliJ IDEA',
    level: 'Development Tool',
    cat: 'Development Tools',
    desc: 'Java IDE used for OOP and algorithmic development.',
    refs: [{ label: 'Language: Java (Intermediate)', target: '#skills' }],
  },
  {
    name: 'PyCharm',
    level: 'Development Tool',
    cat: 'Development Tools',
    desc: 'Python IDE used for scripting, library workflows, and debugging.',
    refs: [{ label: 'Language: Python (Intermediate)', target: '#skills' }],
  },
  {
    name: 'GitHub',
    level: 'Development Tool',
    cat: 'Development Tools',
    desc: 'Source control and team collaboration across software projects.',
    refs: [{ label: 'Open GitHub Profile', external: 'https://github.com/srikrishnanookala18-lab' }],
  },
];

export const WEATHER_SAMPLE: Record<'Hyderabad' | 'Bengaluru' | 'Delhi', CityWeather> = {
  Hyderabad: {
    temp: '31°C',
    humidity: '44%',
    wind: '14 km/h',
    pressure: '1011 hPa',
    uv: '7 (High)',
    comfort: 'Warm / Dry',
    alert: { level: 'Advisory', text: 'Peak UV window 11:30–15:00 IST. Hydrate regularly.' },
    hourly: [
      { t: '09h', v: 26 },
      { t: '12h', v: 31 },
      { t: '15h', v: 33 },
      { t: '18h', v: 29 },
      { t: '21h', v: 25 },
      { t: '00h', v: 23 },
    ],
    daily: [
      { t: 'Mon', v: 32 },
      { t: 'Tue', v: 33 },
      { t: 'Wed', v: 31 },
      { t: 'Thu', v: 30 },
      { t: 'Fri', v: 32 },
      { t: 'Sat', v: 34 },
      { t: 'Sun', v: 33 },
    ],
  },
  Bengaluru: {
    temp: '25°C',
    humidity: '61%',
    wind: '18 km/h',
    pressure: '1015 hPa',
    uv: '5 (Mod)',
    comfort: 'Pleasant',
    alert: { level: 'Clear', text: 'Mild evening breeze expected; comfortable outdoor index.' },
    hourly: [
      { t: '09h', v: 21 },
      { t: '12h', v: 25 },
      { t: '15h', v: 27 },
      { t: '18h', v: 23 },
      { t: '21h', v: 20 },
      { t: '00h', v: 19 },
    ],
    daily: [
      { t: 'Mon', v: 26 },
      { t: 'Tue', v: 27 },
      { t: 'Wed', v: 25 },
      { t: 'Thu', v: 24 },
      { t: 'Fri', v: 26 },
      { t: 'Sat', v: 27 },
      { t: 'Sun', v: 26 },
    ],
  },
  Delhi: {
    temp: '36°C',
    humidity: '29%',
    wind: '11 km/h',
    pressure: '1008 hPa',
    uv: '8 (Very High)',
    comfort: 'Hot / Arid',
    alert: { level: 'Heat Alert', text: 'High daytime temperature & UV index; limit direct afternoon sun.' },
    hourly: [
      { t: '09h', v: 29 },
      { t: '12h', v: 36 },
      { t: '15h', v: 38 },
      { t: '18h', v: 34 },
      { t: '21h', v: 29 },
      { t: '00h', v: 26 },
    ],
    daily: [
      { t: 'Mon', v: 37 },
      { t: 'Tue', v: 38 },
      { t: 'Wed', v: 36 },
      { t: 'Thu', v: 35 },
      { t: 'Fri', v: 37 },
      { t: 'Sat', v: 39 },
      { t: 'Sun', v: 38 },
    ],
  },
};

export const CAMPUS_ROOMS: CampusRoom[] = [
  { id: 'R101', name: 'Central Lobby & Helpdesk', floor: 1, type: 'Facility', status: 'Open', x: 18, y: 18, w: 120, h: 62 },
  { id: 'R102', name: 'Data & DB Lab 102', floor: 1, type: 'Laboratory', status: 'Occupied', x: 152, y: 18, w: 120, h: 62 },
  { id: 'R103', name: 'Seminar Hall 103', floor: 1, type: 'Facility', status: 'Available', x: 286, y: 18, w: 116, h: 62 },
  { id: 'R201', name: 'AI & ML Lab 201', floor: 2, type: 'Laboratory', status: 'Available', x: 18, y: 18, w: 120, h: 62 },
  { id: 'R202', name: 'Robotics Lab 202', floor: 2, type: 'Laboratory', status: 'Occupied', x: 152, y: 18, w: 120, h: 62 },
  { id: 'R203', name: 'Student Commons 203', floor: 2, type: 'Facility', status: 'Open', x: 286, y: 18, w: 116, h: 62 },
  { id: 'R301', name: 'Classroom 301', floor: 3, type: 'Classroom', status: 'Occupied', x: 18, y: 18, w: 120, h: 62 },
  { id: 'R304', name: 'Classroom 304', floor: 3, type: 'Classroom', status: 'Available', x: 152, y: 18, w: 120, h: 62 },
  { id: 'R305', name: 'Faculty Wing 305', floor: 3, type: 'Facility', status: 'Open', x: 286, y: 18, w: 116, h: 62 },
];
