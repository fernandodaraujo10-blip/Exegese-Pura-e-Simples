export enum AppView {
  // USER VIEWS
  WELCOME = 'WELCOME',
  REGISTER = 'REGISTER',
  HOME = 'HOME',
  BIBLE = 'BIBLE',
  EXEGESIS = 'EXEGESIS',
  TOOLS = 'TOOLS',
  COMMUNITY = 'COMMUNITY',
  MORE = 'MORE',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',

  // ADMIN VIEWS
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_HOME = 'ADMIN_HOME',
  ADMIN_USERS = 'ADMIN_USERS',
  ADMIN_CONTENT = 'ADMIN_CONTENT',
  ADMIN_ANALYTICS = 'ADMIN_ANALYTICS',
  ADMIN_SUPPORT = 'ADMIN_SUPPORT',
}

export enum TheologyLine {
  CALVINIST = 'Calvinista',
  ARMINIAN = 'Arminiana',
  PENTECOSTAL = 'Pentecostal',
}

export enum ExegesisModule {
  ORIGINALS = 'Originais (Hebraico/Grego)',
  FULL_EXEGESIS = 'Exegese Completa',
  HOMILETIC = 'Esboço Homilético',
  TEACHER = 'Professor de EBD',
  DICTIONARY = 'Dicionários & Chaves',
  SYNTAX = 'Estrutura Sintática',
}

export interface UserProfile {
  id: string;
  name: string;
  age: string;
  church: string;
  role: string;
  whatsapp: string;
  isRegistered: boolean;
  avatarUrl: string;
  registrationDate: string;
}

export interface StudyResult {
  id: string;
  reference: string;
  theology: TheologyLine;
  module: ExegesisModule;
  content: string;
  date: string;
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  message: string;
  date: string;
}

export interface Devotional {
  id: string;
  title: string;
  verse: string;
  content: string;
  date: string;
}

export interface AdminConfig {
  coverImageUrl: string;
  coverTitle: string;
  libraryDriveUrl: string; // Novo campo para Biblioteca
  announcement: string; // Mural de Avisos
  maintenanceMode: boolean;
  activeModules: ExegesisModule[];
}

export const INITIAL_ADMIN_CONFIG: AdminConfig = {
  coverImageUrl: '/cover.png',
  coverTitle: 'Estude as Escrituras Profundamente',
  libraryDriveUrl: '',
  announcement: 'Dica do dia: Use a ferramenta de Exegese para analisar o texto original em grego e hebraico.',
  maintenanceMode: false,
  activeModules: Object.values(ExegesisModule),
};

export interface ReadingSettings {
  fontSize: number;
  lineHeight: number;
  fontFamily: 'serif' | 'sans';
}

export const INITIAL_READING_SETTINGS: ReadingSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  fontFamily: 'serif',
};

export const INITIAL_USER: UserProfile = {
  id: 'guest',
  name: '',
  age: '',
  church: '',
  role: '',
  whatsapp: '',
  isRegistered: false,
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  registrationDate: '',
};