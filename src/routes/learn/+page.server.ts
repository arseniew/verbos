import fs from 'fs/promises';
import path from 'path';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        const registryPath = path.resolve('data/registry.json');
        const rawRegistry = await fs.readFile(registryPath, 'utf8');
        const registry = JSON.parse(rawRegistry);

        const verbsData: any[] = [];
        for (const verb of registry.verbs) {
            const verbPath = path.resolve(`data/verbs/${verb}.json`);
            try {
                const rawVerb = await fs.readFile(verbPath, 'utf8');
                const parsed = JSON.parse(rawVerb);
                parsed.exercises = parsed.exercises.map((ex: any) => ({ ...ex, verb }));
                verbsData.push(parsed);
            } catch (e) {
                console.error(`Failed to selectively load verb payload: ${verb}`, e);
            }
        }
        return { registry, verbsData };
    } catch (e) {
        console.error('Core file ingestion crashed', e);
        return { registry: { verbs: [], total_exercises: 0 }, verbsData: [] };
    }
}
