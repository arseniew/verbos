import fs from 'fs/promises';
import path from 'path';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    try {
        const registryPath = path.resolve('data/registry.json');
        const rawRegistry = await fs.readFile(registryPath, 'utf8');
        const registry = JSON.parse(rawRegistry);

        return { verbs: registry.verbs };
    } catch (e) {
        console.error('Core file ingestion crashed', e);
        return { verbs: [] };
    }
}
