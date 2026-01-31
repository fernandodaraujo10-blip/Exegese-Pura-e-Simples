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
        set({ isLoading: true });
        try {
            // 1. Load Admin Config
            const fbConfig = await getAdminConfig();
            set({ config: fbConfig });

            // 2. Local fallback if needed
            if (!fbConfig) {
                set({ config: CoreStorage.loadConfig() });
            }

            // 3. Theme
            set({ theme: CoreStorage.loadTheme() });

        } catch (error) {
            console.error("Hydration Error:", error);
        } finally {
            set({ isLoading: false });
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
