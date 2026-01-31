import { create } from 'zustand';
import {
    UserProfile,
    AdminConfig,
    INITIAL_USER,
    INITIAL_ADMIN_CONFIG,
    INITIAL_READING_SETTINGS,
    AppView,
    ReadingSettings
} from './types';
import {
    getAdminConfig,
    getUserProfile,
    saveUserProfile,
    saveAdminConfig
} from '../services/firebase';
import { CoreStorage } from './storage';

interface AppState {
    view: AppView;
    viewParams: any;
    user: UserProfile;
    config: AdminConfig;
    theme: 'light' | 'dark';
    readingSettings: ReadingSettings;
    isLoading: boolean;

    // Actions
    setView: (view: AppView, params?: any) => void;
    setUser: (user: UserProfile) => void;
    setConfig: (config: AdminConfig) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setReadingSettings: (settings: Partial<ReadingSettings>) => void;
    setLoading: (loading: boolean) => void;

    // Async Hydration
    init: () => Promise<void>;
    updateUser: (data: Partial<UserProfile>) => Promise<void>;
    updateConfig: (data: Partial<AdminConfig>) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
    view: AppView.WELCOME,
    viewParams: null,
    user: INITIAL_USER,
    config: INITIAL_ADMIN_CONFIG,
    theme: CoreStorage.loadTheme(),
    readingSettings: INITIAL_READING_SETTINGS, // To be improved with local storage
    isLoading: true,

    setView: (view, params = null) => set({ view, viewParams: params }),

    setUser: (user) => {
        set({ user });
        CoreStorage.saveUser(user);
    },

    setConfig: (config) => {
        set({ config });
        CoreStorage.saveConfig(config);
    },

    setTheme: (theme) => {
        set({ theme });
        CoreStorage.saveTheme(theme);
    },

    setReadingSettings: (settings) => set((state) => ({
        readingSettings: { ...state.readingSettings, ...settings }
    })),

    setLoading: (loading) => set({ isLoading: loading }),

    init: async () => {
        // 1. Carregar instantaneamente do LocalStorage para evitar tela de loading
        const cachedConfig = CoreStorage.loadConfig();
        const cachedTheme = CoreStorage.loadTheme();

        set({
            config: cachedConfig,
            theme: cachedTheme,
            isLoading: false // Já libera a tela para o usuário
        });

        // 2. Atualizar em segundo plano (background) sem travar o app
        try {
            const fbConfig = await getAdminConfig();
            if (fbConfig) {
                set({ config: fbConfig });
                CoreStorage.saveConfig(fbConfig);
            }
        } catch (error) {
            console.error("Erro ao atualizar config em background:", error);
        }
    },

    updateUser: async (data) => {
        const currentUser = get().user;
        const updatedUser = { ...currentUser, ...data };
        set({ user: updatedUser });
        if (updatedUser.id !== 'guest') {
            await saveUserProfile(updatedUser.id, updatedUser);
        }
        CoreStorage.saveUser(updatedUser);
    },

    updateConfig: async (data) => {
        const currentConfig = get().config;
        const updatedConfig = { ...currentConfig, ...data };
        set({ config: updatedConfig });
        await saveAdminConfig(updatedConfig);
        CoreStorage.saveConfig(updatedConfig);
    }
}));
