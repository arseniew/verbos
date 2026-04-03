import { z } from 'zod';

export const exerciseSchema = z.object({
    exercises: z.array(
        z.object({
            tense: z.string(),
            person: z.string(),
            sentence: z.string(),
            answer: z.string(),
            translation: z.string()
        })
    )
});
