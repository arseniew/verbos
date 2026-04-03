import { describe, it, expect } from 'vitest';
import { splitSentence } from './stringUtils';

describe('String Utils', () => {
    it('splits sequentially with exactly three standard underscores', () => {
        expect(splitSentence('Nosotros ___ pan')).toEqual(['Nosotros ', ' pan']);
    });

    it('safely truncates massive unpredictable LLM generation sequences like seven underscores', () => {
        expect(splitSentence('Hoy yo _______ mucha hambre')).toEqual(['Hoy yo ', ' mucha hambre']);
    });

    it('handles sentences strictly missing underscores silently returning the core array', () => {
        expect(splitSentence('Yo tengo hambre')).toEqual(['Yo tengo hambre']);
    });
});
