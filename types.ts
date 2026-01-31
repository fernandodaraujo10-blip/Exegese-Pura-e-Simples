export enum AppView {
  WELCOME = 'WELCOME',
  HOME = 'HOME',
  BIBLE = 'BIBLE',
  EXEGESIS = 'EXEGESIS',
  NOTES = 'NOTES',
  COMMUNITY = 'COMMUNITY',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
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
  DICTIONARY = 'Dicionários & Palavras-chave',
  SYNTAX = 'Estrutura Sintática',
}

export interface UserProfile {
  name: string;
  church: string;
  avatarUrl: string;
}

export interface StudyResult {
  id: string;
  reference: string;
  theology: TheologyLine;
  module: ExegesisModule;
  content: string;
  date: Date;
}

export interface AdminConfig {
  coverImageUrl: string;
  coverTitle: string;
  maintenanceMode: boolean;
  activeModules: ExegesisModule[];
}

export const INITIAL_ADMIN_CONFIG: AdminConfig = {
  coverImageUrl: 'https://picsum.photos/800/600',
  coverTitle: 'Estude as Escrituras Profundamente',
  maintenanceMode: false,
  activeModules: Object.values(ExegesisModule),
};

export const INITIAL_USER: UserProfile = {
  name: 'Visitante',
  church: 'Sem denominação definida',
  avatarUrl: 'https://picsum.photos/200',
};