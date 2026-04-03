import { describe, it, expect } from 'vitest';
import { generateHint } from './hintLogic';

describe('hintLogic cognitive algorithm', () => {
    it('returns the first character natively when the user text field is completely empty', () => {
        expect(generateHint('', 'hicieron')).toBe('h');
    });

    it('strips wildly incorrect sequence branches and appends the single correct valid step safely', () => {
        // Validation: user typed 'hizi'. Prefix boundary parses 'hi'. Truncates 'zi' -> forces append 'c' => 'hic'
        expect(generateHint('hizi', 'hicieron')).toBe('hic');
    });

    it('appends the logical target even when immediate failure evaluates early', () => {
        // Validation: user typed 'hucie'. Prefix match fails immediately on 'u', meaning match length = 1.
        expect(generateHint('hucie', 'hicieron')).toBe('hi');
    });

    it('injects standard sequence step unconditionally when working off a perfectly typed baseline', () => {
        expect(generateHint('hic', 'hicieron')).toBe('hici');
    });

    it('safely handles complete evaluation bounds correctly without overflowing', () => {
        expect(generateHint('hicieron', 'hicieron')).toBe('hicieron');
    });
});
