<script lang="ts">
    import VirtualKeyboard from "./VirtualKeyboard.svelte";
    import { generateHint } from "../utils/hintLogic";
    import { splitSentence } from "../utils/stringUtils";

    let {
        targetVerb,
        contextSentence,
        translation,
        showEnglishTranslation,
        showBaseVerb,
        baseVerb,
        onSubmit,
        onHintUsed,
        onStrike,
        onNext,
    }: {
        targetVerb: string;
        contextSentence: string;
        translation: string;
        showEnglishTranslation: boolean;
        showBaseVerb: boolean;
        baseVerb: string;
        onSubmit: (input: string) => void;
        onHintUsed: () => void;
        onStrike?: () => void;
        onNext?: () => void;
    } = $props();

    let currentInput = $state("");
    let wrongAnswer = $state("");
    let status = $state<"idle" | "error" | "failed">("idle");
    let inputRef: HTMLInputElement | undefined = $state();

    $effect(() => {
        if (targetVerb) {
            status = "idle";
            currentInput = "";
            wrongAnswer = "";
            setTimeout(() => inputRef?.focus(), 10);
        }
    });

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (status === "failed") {
                handleNext();
            } else {
                submit();
            }
        }
    }

    function submit() {
        if (!currentInput.trim()) return;

        if (currentInput.trim().toLowerCase() === targetVerb.toLowerCase()) {
            status = "idle";
            onSubmit(currentInput.trim());
        } else {
            status = "failed";
            wrongAnswer = currentInput.trim();
            if (onStrike) onStrike();
        }
    }

    function useHint() {
        if (status === "failed") return;
        currentInput = generateHint(currentInput, targetVerb);
        onHintUsed();
        inputRef?.focus();
    }

    function handleVirtualKey(char: string) {
        if (status === "failed") return;
        currentInput += char;
        inputRef?.focus();
    }

    function handleNext() {
        status = "idle";
        currentInput = "";
        wrongAnswer = "";
        if (onNext) onNext();
    }

    function handleWindowKeydown(e: KeyboardEvent) {
        if (status === "failed" && e.key === "Enter") {
            e.preventDefault();
            handleNext();
        }
    }

    let sentenceParts = $derived(splitSentence(contextSentence));
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<div
    class="flex flex-col items-center w-full max-w-2xl mx-auto space-y-6 animate-fade-in mt-4"
>
    <div
        class="text-xl sm:text-2xl text-center text-gray-800 dark:text-gray-100 leading-normal font-medium tracking-wide"
    >
        {#if sentenceParts.length >= 2}
            <span class="mr-2">{sentenceParts[0]}</span>

            {#if status === "failed"}
                <div
                    class="inline-flex flex-col items-center justify-center align-middle mx-1 text-2xl font-bold bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded px-4 py-1 shadow-inner"
                >
                    <span class="text-green-600 leading-none pb-1"
                        >{targetVerb}</span
                    >
                    <span
                        class="text-red-400 decoration-2 line-through text-lg opacity-80 leading-none pt-1"
                        >{wrongAnswer}</span
                    >
                </div>
            {:else}
                <input
                    bind:this={inputRef}
                    type="text"
                    bind:value={currentInput}
                    onkeydown={handleKeydown}
                    aria-label="Conjugate the missing verb"
                    class="inline-block w-36 sm:w-44 text-center border-b-2 border-dashed bg-transparent focus:outline-none transition-colors border-blue-400 text-blue-700 hover:border-blue-500 focus:border-blue-600 dark:text-blue-400 dark:border-blue-500"
                    autofocus
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                />
            {/if}

            <span class="ml-2">{sentenceParts[1]}</span>
        {:else}
            <!-- Fallback if grammar rules omit missing ___ block -->
            <span class="block mb-4">{contextSentence}</span>

            {#if status === "failed"}
                <div
                    class="flex flex-col items-center justify-center mx-auto text-2xl font-bold my-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded px-6 py-2 shadow-inner"
                >
                    <span class="text-green-600 leading-none pb-1"
                        >{targetVerb}</span
                    >
                    <span
                        class="text-red-400 decoration-2 line-through text-xl opacity-80 leading-none pt-1"
                        >{wrongAnswer}</span
                    >
                </div>
            {:else}
                <input
                    bind:this={inputRef}
                    type="text"
                    bind:value={currentInput}
                    onkeydown={handleKeydown}
                    class="block w-full max-w-md mx-auto text-center border-b-2 text-2xl bg-transparent focus:outline-none border-blue-400 text-blue-700 dark:text-blue-400 dark:border-blue-500"
                    autofocus
                />
            {/if}
        {/if}

        {#if showBaseVerb && baseVerb}
            <span class="text-gray-400 text-lg font-normal italic ml-3"
                >({baseVerb})</span
            >
        {/if}
    </div>

    {#if showEnglishTranslation && translation}
        <p
            class="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium italic text-center mt-2 px-4 shadow-sm py-1 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded"
        >
            {translation}
        </p>
    {/if}

    {#if status !== "failed"}
        <div class="w-full flex justify-center mt-8">
            <VirtualKeyboard isVisible={true} onKeypress={handleVirtualKey} />
        </div>
    {/if}

    <div class="flex gap-4 mt-12 w-full justify-center">
        {#if status === "failed"}
            <button
                type="button"
                onclick={handleNext}
                aria-label="Next Question"
                class="w-full max-w-xs py-4 text-lg bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30 border border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest font-extrabold transition-all active:scale-95"
            >
                Next
            </button>
        {:else}
            <button
                type="button"
                onclick={useHint}
                aria-label="Request Hint"
                class="px-6 py-3 bg-transparent text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-gray-400 font-bold tracking-wide transition-all active:scale-95"
            >
                Give Hint
            </button>
            <button
                type="button"
                onclick={submit}
                aria-label="Submit Answer"
                class="w-full max-w-xs py-4 text-lg bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/30 border border-blue-700 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase tracking-widest font-extrabold transition-all active:scale-95"
            >
                Check Answer
            </button>
        {/if}
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
