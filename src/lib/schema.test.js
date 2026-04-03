import { describe, it, expect } from 'vitest';
import { exerciseSchema } from './schema.js';

describe('exerciseSchema', () => {
    it('validates a correctly structured JSON payload conformant to LLM output', () => {
        const payload = {
            exercises: [
                { tense: 'Present', person: 'yo', sentence: '___ (comer)', answer: 'como', translation: 'I eat' }
            ]
        };
        const result = exerciseSchema.safeParse(payload);
        expect(result.success).toBe(true);
    });

    it('rejects a malformed payload missing the strictly required answer field', () => {
        const payload = {
            exercises: [
                { tense: 'Present', person: 'yo', sentence: '___ (comer)', translation: 'I eat' } // Validation should fail here
            ]
        };
        const result = exerciseSchema.safeParse(payload);
        expect(result.success).toBe(false);
    });
});
