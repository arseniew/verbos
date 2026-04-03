export function splitSentence(contextSentence: string): string[] {
    // Splits by one or more consecutive underscores securely mapping LLM variables
    return contextSentence.split(/_+/);
}
