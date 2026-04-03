import { describe, it, expect } from 'vitest';
import { initializeCard, gradeCard, AppGrade, isCardDue } from './scheduler';

describe('Spaced Repetition Engine (FSRS Integration)', () => {
    it('creates an initialized, brand new flashcard metric', () => {
        const card = initializeCard();
        expect(card.reps).toBe(0);
        expect(card.stability).toBe(0);
        expect(card.difficulty).toBe(0);
    });

    it('grades a correct answer by effectively increasing the stability score', () => {
        const blank = initializeCard();
        const learned = gradeCard(blank, AppGrade.Correct);

        // Natively, correct answers must construct high stability representations
        expect(learned.stability).toBeGreaterThan(blank.stability);
        expect(learned.reps).toBe(1);
    });

    it('penalizes stability and pushes difficulty if a user gets a strike', () => {
        const blank = initializeCard();
        const learned = gradeCard(blank, AppGrade.Correct);
        // Suppose days pass... the user encounters it and strikes:
        const failed = gradeCard(learned, AppGrade.Strike);

        expect(failed.stability).toBeLessThan(learned.stability);
        expect(failed.difficulty).toBeGreaterThan(learned.difficulty);
    });

    it('determines card state reliably by evaluating against due timestamps (decay)', () => {
        const card = initializeCard();
        // A brand new card natively should decay immediately requiring interaction
        expect(isCardDue(card)).toBe(true);
    });
});
