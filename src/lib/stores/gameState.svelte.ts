import type { Card } from 'ts-fsrs';

export interface UserConfig {
    selectedVerbs: string[];
    selectedTenses: string[];
    selectedPersons: string[];
    marginOfError: number;
    stressFreeMode: boolean;
    showEnglishTranslation: boolean;
    showBaseVerb: boolean;
}

export interface FSRSDatabase {
    [key: string]: Card; // Key format: "verb:tense:person"
}

export class AppState {
    // Top level Svelte 5 Reactivity System Runes
    userConfig = $state<UserConfig>({
        selectedVerbs: ['ser', 'estar', 'tener'],
        selectedTenses: ['Present'],
        selectedPersons: ['yo', 'tú', 'él'],
        marginOfError: 3,
        stressFreeMode: false,
        showEnglishTranslation: true,
        showBaseVerb: true
    });

    longestStreak = $state(0);
    recentSessions = $state<UserConfig[]>([]);

    srsDatabase = $state<FSRSDatabase>({});

    constructor() {
        if (typeof window !== 'undefined') {
            this.loadFromStorage();
        }
    }

    /**
     * Loads the JSON blobs from window.localStorage and properly deserializes Date parameters for ts-fsrs.
     */
    loadFromStorage() {
        try {
            const storedConfig = localStorage.getItem('sv_config');
            if (storedConfig) {
                const parsed = JSON.parse(storedConfig);
                this.userConfig = { ...this.userConfig, ...parsed };
                // Ensure migration path for existing active sessions lacking verb configs natively
                if (!this.userConfig.selectedVerbs) {
                    this.userConfig.selectedVerbs = ['ser', 'estar', 'tener'];
                }
            }

            const storedStreak = localStorage.getItem('sv_longestStreak');
            if (storedStreak) this.longestStreak = parseInt(storedStreak);

            const storedSessions = localStorage.getItem('sv_recentSessions');
            if (storedSessions) this.recentSessions = JSON.parse(storedSessions);

            const storedSRS = localStorage.getItem('sv_srsDatabase');
            if (storedSRS) {
                const parsed = JSON.parse(storedSRS);
                // ts-fsrs specifically requires card.due and card.last_review to be strictly JS Date objects.
                // JSON.parse converts dates to generic ISO strings. They must be intercepted and cast:
                for (const key in parsed) {
                    if (parsed[key].due) parsed[key].due = new Date(parsed[key].due);
                    if (parsed[key].last_review) parsed[key].last_review = new Date(parsed[key].last_review);
                }
                this.srsDatabase = parsed;
            }
        } catch (error) {
            console.error('Non-blocking State Load Error:', error);
        }
    }

    /**
     * Snapshots the reactive runes securely back into localStorage JSON.
     */
    saveToStorage() {
        if (typeof window === 'undefined') return;
        localStorage.setItem('sv_config', JSON.stringify(this.userConfig));
        localStorage.setItem('sv_longestStreak', this.longestStreak.toString());
        localStorage.setItem('sv_recentSessions', JSON.stringify(this.recentSessions));
        localStorage.setItem('sv_srsDatabase', JSON.stringify(this.srsDatabase));
    }
}

// Maintain a rigid global instance 
export const appState = new AppState();
