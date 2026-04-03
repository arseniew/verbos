<script lang="ts">
    let {
        isVisible = false,
        onKeypress,
    }: {
        isVisible?: boolean;
        onKeypress?: (char: string) => void;
    } = $props();

    // Natively requested configuration characters
    const keys = ["á", "é", "í", "ó", "ú", "ñ", "ü"];

    function handleMousedown(event: MouseEvent) {
        // Critical requirement natively intercepting click momentum to absolutely forbid the primary input from firing blur/selection-loss
        event.preventDefault();
    }

    function dispatchKey(char: string) {
        if (onKeypress) {
            onKeypress(char);
        }
    }
</script>

{#if isVisible}
    <!-- Accessible UI region distributing virtual controls accurately -->
    <div
        class="flex flex-wrap gap-2 mt-4 p-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner justify-center"
        role="group"
        aria-label="Virtual Character Keyboard"
    >
        {#each keys as key}
            <button
                type="button"
                aria-label={`Insert specialized context character ${key}`}
                class="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-sm text-lg font-semibold dark:text-gray-100 hover:bg-blue-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 active:bg-blue-100 transition-colors"
                onmousedown={handleMousedown}
                onclick={() => dispatchKey(key)}
            >
                {key}
            </button>
        {/each}
    </div>
{/if}
