export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  website?: string;
}

export interface JobExperience {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
}

export interface EducationItem {
  school: string;
  degree: string;
  field?: string;
  period: string;
  location?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year?: string;
  period?: string;
  location?: string;
}

export interface CoverLetterData {
  recipient: string;
  company: string;
  date: string;
  body: string;
}

export type ResumeFontFamily =
  // Standard Core PDF Fonts (3)
  | 'Helvetica'
  | 'Times-Roman'
  | 'Courier'
  // Modern Sans-Serif (14)
  | 'Roboto'
  | 'Inter'
  | 'Open Sans'
  | 'Lato'
  | 'Montserrat'
  | 'Poppins'
  | 'Raleway'
  | 'Nunito'
  | 'Work Sans'
  | 'DM Sans'
  | 'Rubik'
  | 'Cabin'
  | 'Oxygen'
  | 'Plus Jakarta Sans'
  // Executive & Editorial Serif (9)
  | 'Merriweather'
  | 'Lora'
  | 'Playfair Display'
  | 'PT Serif'
  | 'Source Serif Pro'
  | 'Cinzel'
  | 'EB Garamond'
  | 'Cormorant Garamond'
  | 'Baskervville'
  // Engineering Monospace (4)
  | 'JetBrains Mono'
  | 'Fira Code'
  | 'Source Code Pro'
  | 'Inconsolata';

export interface ResumeStyleConfig {
  themeId: string;
  themeName: string;
  bannerBg: string;
  accentColor: string;
  nameColor: string;
  fontFamily: ResumeFontFamily;
  fontSize: 'compact' | 'standard' | 'spacious';
  spacing: 'compact' | 'standard' | 'relaxed';
  headerLayout: 'full-banner' | 'clean-minimal';
}

export const RESUME_THEME_PRESETS: ResumeStyleConfig[] = [
  {
    themeId: 'signature-gold',
    themeName: 'Cody Signature Gold',
    bannerBg: '#2f2f33',
    accentColor: '#E0A521',
    nameColor: '#F2C230',
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  },
  {
    themeId: 'executive-navy',
    themeName: 'Executive Navy & Bronze',
    bannerBg: '#0f172a',
    accentColor: '#d97706',
    nameColor: '#f8fafc',
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  },
  {
    themeId: 'modern-emerald',
    themeName: 'Tech Emerald & Pine',
    bannerBg: '#064e3b',
    accentColor: '#10b981',
    nameColor: '#6ee7b7',
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  },
  {
    themeId: 'monochrome-obsidian',
    themeName: 'Monochrome Obsidian',
    bannerBg: '#18181b',
    accentColor: '#71717a',
    nameColor: '#ffffff',
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  },
  {
    themeId: 'royal-cobalt',
    themeName: 'Royal Cobalt Blue',
    bannerBg: '#1e3a8a',
    accentColor: '#38bdf8',
    nameColor: '#e0f2fe',
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  },
  {
    themeId: 'bordeaux-rose',
    themeName: 'Burgundy & Rose Gold',
    bannerBg: '#4c0519',
    accentColor: '#f43f5e',
    nameColor: '#ffe4e6',
    fontFamily: 'Helvetica',
    fontSize: 'standard',
    spacing: 'standard',
    headerLayout: 'full-banner',
  },
];

export const DEFAULT_RESUME_STYLE: ResumeStyleConfig = RESUME_THEME_PRESETS[0];

export interface ResumeData {
  name: string;
  title: string;
  contact: ContactInfo;
  summary: string;
  experience: JobExperience[];
  education: EducationItem[];
  skills: string[];
  certifications?: CertificationItem[];
  languages?: Array<{ name: string; level?: string } | string>;
  coverLetter?: CoverLetterData;
  atsPlainText?: string;
  styleConfig?: ResumeStyleConfig;
}

export interface JDStackAnalysis {
  roleTitle?: string;
  companyName?: string;
  workModel?: string;
  experienceLevel?: string;
  summaryAssessment?: string;
  mustHaveSkills: string[];
  niceToHaveSkills?: string[];
  stackAnalysis: {
    backend?: string[];
    frontend?: string[];
    database?: string[];
    cloud?: string[];
    devopsCiCd?: string[];
    containersInfra?: string[];
    testing?: string[];
    messagingEvents?: string[];
    architecture?: string[];
    observability?: string[];
    security?: string[];
    aiAutomation?: string[];
  };
  recommendedSkills: string[];
  keyEngineeringThemes?: string[];
}

export interface BatchItem {
  id: string;
  title: string;
  company?: string;
  url?: string;
  text: string;
  status: 'idle' | 'analyzing' | 'generating' | 'completed' | 'error';
  errorMessage?: string;
  analysis?: JDStackAnalysis;
  resumeData?: ResumeData;
}
