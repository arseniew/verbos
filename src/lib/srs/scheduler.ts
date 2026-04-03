import { fsrs, createEmptyCard, Rating, type Card } from 'ts-fsrs';

// Initialize core FSRS logic mathematically
export const f = fsrs({});

export enum AppGrade {
    Strike = 1,     // Completely missed the conjugation
    Hint = 2,       // User relied on the hint mechanic to answer
    Correct = 3     // Got the conjugation fully correct natively
}

/**
 * Initializes a new blank memory card profile
 * @returns An empty FSRS card ready for interval scheduling
 */
export function initializeCard(): Card {
    return createEmptyCard();
}

/**
 * Validates performance against FSRS engine and returns the mutated card parameters
 * @param card The existing FSRS card to be graded
 * @param grade The UI interaction state (Strike, Hint, or Correct)
 * @returns Mutated card containing updated cognitive parameters
 */
export function gradeCard(card: Card, grade: AppGrade): Card {
    // Map application metrics to FSRS rating system
    const fsrsRatings: Record<AppGrade, Extract<Rating, Rating.Again | Rating.Hard | Rating.Good | Rating.Easy>> = {
        [AppGrade.Strike]: Rating.Again,
        [AppGrade.Hint]: Rating.Hard,
        [AppGrade.Correct]: Rating.Good,
    };

    const targetRating = fsrsRatings[grade];
    const schedulingCards = f.repeat(card, new Date());

    // Evaluate the predictions for the specific rating and return the updated card payload
    return schedulingCards[targetRating as Extract<Rating, Rating.Again | Rating.Hard | Rating.Good | Rating.Easy>].card;
}

/**
 * Confirms if a card's retrieval probability has decayed enough to justify asking
 */
export function isCardDue(card: Card): boolean {
    return new Date() >= card.due;
}
