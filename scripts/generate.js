import fs from 'fs/promises';
import path from 'path';
import 'dotenv/config';
import minimist from 'minimist';
import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { exerciseSchema } from '../src/lib/schema.js';

// The AI SDK allows you to easily swap providers (Anthropic, Google, Mistral, Local, etc.)
// Provide your API key securely from the .env file
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Configure the model choice
const model = openai('gpt-4o-mini');

async function main() {
    const args = minimist(process.argv.slice(2));
    const verb = args.verb;
    const tenses = args.tenses;

    if (!verb || !tenses) {
        console.error('Usage: npm run generate:verb -- --verb="tener" --tenses="Present,Preterite,Imperfect"');
        process.exit(1);
    }

    const systemPrompt = `You are an expert computational linguist and Spanish language educator. Your objective is to generate practice sentences for a digital learning application.
For the target verb provided, generate exactly 3 distinct, contextual examples for every combination of TENSE and PERSON requested.
Each sentence must clearly indicate its form and make the context of the missing verb obvious. Use everyday vocabulary appropriate for language learners.`;

    console.log(`Generating exercises for ${verb} using Vercel AI SDK...`);

    try {
        // generateObject handles the system prompting, strict JSON responses via Zod, and parsing automatically!
        const { object: validData } = await generateObject({
            model: model,
            schema: exerciseSchema,
            system: systemPrompt,
            prompt: `Target Verb: ${verb}\nTenses Requested: ${tenses}\nGenerate 3 examples for each person per tense.`
        });

        const verbDir = path.join(process.cwd(), 'data', 'verbs');
        await fs.mkdir(verbDir, { recursive: true });

        await fs.writeFile(path.join(verbDir, `${verb}.json`), JSON.stringify(validData, null, 2));

        // Update registry safely
        const registryPath = path.join(process.cwd(), 'data', 'registry.json');
        let registry = { verbs: [] };
        try {
            const regData = await fs.readFile(registryPath, 'utf8');
            registry = JSON.parse(regData);
        } catch (e) { }

        if (!registry.verbs.includes(verb)) {
            registry.verbs.push(verb);
            await fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
        }

        console.log(`Successfully generated and saved data for ${verb}.`);

    } catch (error) {
        console.error('Error generating verb data:', error.message);
        process.exit(1);
    }
}

main();
