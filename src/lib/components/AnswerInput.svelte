<script lang="ts">
    import VirtualKeyboard from "./VirtualKeyboard.svelte";
    import { generateHint } from "../utils/hintLogic";

    let {
        targetVerb,
        contextSentence, // e.g., "Mañana, nosotros ___ a la playa"
        translation,
        showEnglishTranslation,
        showBaseVerb,
        baseVerb,
        onSubmit,
        onHintUsed,
    }: {
        targetVerb: string;
        contextSentence: string;
        translation: string;
        showEnglishTranslation: boolean;
        showBaseVerb: boolean;
        baseVerb: string;
        onSubmit: (input: string) => void;
        onHintUsed: () => void;
    } = $props();

    let currentInput = $state("");
    let status = $state<"idle" | "error">("idle");
    let inputRef: HTMLInputElement | undefined = $state();

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            submit();
        }
    }

    function submit() {
        if (!currentInput.trim()) return;

        if (currentInput.trim().toLowerCase() === targetVerb.toLowerCase()) {
            status = "idle";
            onSubmit(currentInput.trim());
            currentInput = ""; // Clear for next instance automatically
        } else {
            status = "error";
            // Temporary error state for css flashing
            setTimeout(() => {
                if (status === "error") status = "idle";
            }, 1000);
        }
        inputRef?.focus();
    }

    function useHint() {
        currentInput = generateHint(currentInput, targetVerb);
        onHintUsed();
        inputRef?.focus();
    }

    function handleVirtualKey(char: string) {
        currentInput += char;
        inputRef?.focus();
    }

    // Reactively extract prefixes and suffixes identifying the `___` replacement zone
    let sentenceParts = $derived(contextSentence.split("___"));
</script>

<div
    class="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6 animate-fade-in mt-4"
>
    <!-- Question Context Block -->
    <div
        class="text-xl sm:text-2xl text-center text-gray-800 leading-normal font-medium tracking-wide"
    >
        {#if sentenceParts.length >= 2}
            <span class="mr-2">{sentenceParts[0]}</span>
            <input
                bind:this={inputRef}
                type="text"
                bind:value={currentInput}
                onkeydown={handleKeydown}
                aria-label="Conjugate the missing verb"
                class="inline-block w-36 sm:w-44 text-center border-b-2 border-dashed bg-transparent focus:outline-none transition-colors {status ===
                'error'
                    ? 'border-red-500 text-red-600 bg-red-50 focus:border-red-600 focus:bg-red-100'
                    : 'border-blue-400 text-blue-700 hover:border-blue-500 focus:border-blue-600 focus:bg-blue-50'}"
                autofocus
                autocomplete="off"
                autocorrect="off"
                spellcheck="false"
            />
            <span class="ml-2">{sentenceParts[1]}</span>
        {:else}
            <!-- Fallback if grammar rules omit missing ___ block -->
            <span class="block mb-4">{contextSentence}</span>
            <input
                bind:this={inputRef}
                type="text"
                bind:value={currentInput}
                onkeydown={handleKeydown}
                class="block w-full max-w-md mx-auto text-center border-b-2 text-2xl bg-transparent focus:outline-none {status ===
                'error'
                    ? 'border-red-500 text-red-600'
                    : 'border-blue-400 text-blue-700'}"
                autofocus
            />
        {/if}

        {#if showBaseVerb && baseVerb}
            <span class="text-gray-400 text-lg font-normal italic ml-3"
                >({baseVerb})</span
            >
        {/if}
    </div>

    <!-- Supplementary Context -->
    {#if showEnglishTranslation && translation}
        <p
            class="text-sm sm:text-base text-gray-500 font-medium italic text-center mt-2 px-4 shadow-sm py-1 bg-white border rounded"
        >
            {translation}
        </p>
    {/if}

    <!-- Virtual Keyboard integration (passes char dispatch directly avoiding focus-loss!) -->
    <div class="w-full flex justify-center mt-8">
        <VirtualKeyboard isVisible={true} onKeypress={handleVirtualKey} />
    </div>

    <!-- Gamification Context Actions -->
    <div class="flex gap-4 mt-12 w-full justify-center">
        <button
            type="button"
            onclick={useHint}
            aria-label="Request Hint"
            class="px-6 py-3 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold tracking-wide transition-all active:scale-95"
        >
            Give Hint
        </button>
        <button
            type="button"
            onclick={submit}
            aria-label="Submit Answer"
            class="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-md border border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold tracking-wide transition-all active:scale-95"
        >
            Check Answer
        </button>
    </div>
</div>

<style>
    .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
