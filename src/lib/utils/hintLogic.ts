/**
 * Resolves a requested hint by identifying the matching correct prefix, truncating errors, and appending the next letter.
 * @param currentInput The string currently evaluated inside the text field
 * @param targetVerb The correct algorithmic answer expected by the system
 * @returns The new securely generated string to inject directly into the text field
 */
export function generateHint(currentInput: string, targetVerb: string): string {
    if (!currentInput) {
        return targetVerb.charAt(0);
    }

    // Calculate the length of the perfectly matching string prefix
    let matchLength = 0;
    for (let i = 0; i < currentInput.length; i++) {
        if (i < targetVerb.length && currentInput[i].toLowerCase() === targetVerb[i].toLowerCase()) {
            matchLength++;
        } else {
            break;
        }
    }

    // Safely fallback if exact bounds met
    if (matchLength >= targetVerb.length) {
        return targetVerb;
    }

    // Drop incorrect sequence branches unconditionally and explicitly inject the first missing token
    return targetVerb.substring(0, matchLength + 1);
}
