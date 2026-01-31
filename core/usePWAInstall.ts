import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export const usePWAInstall = () => {
    const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handler = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setInstallPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const triggerInstall = async () => {
        if (!installPrompt) return;

        // Show the prompt
        await installPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstallable(false);
            setInstallPrompt(null);
        }
    };

    return { isInstallable, triggerInstall };
};
