<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { appState } from "$lib/stores/gameState.svelte";
  import Button from "$lib/components/Button.svelte";

  // Check if there's any active FSRS parameters saved in browser to render the quick-resume shortcut safely without SSR errors
  let hasActiveSession = $derived(Object.keys(appState.srsDatabase).length > 0);

  function startNew() {
    goto(`${base}/create`);
  }

  function resume() {
    goto(`${base}/learn`);
  }
</script>

<div
  class="flex flex-col items-center justify-center min-h-[75vh] px-6 space-y-12 max-w-3xl mx-auto"
>
  <!-- Hero Block -->
  <div class="text-center space-y-5">
    <h1
      class="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tighter leading-tight drop-shadow-sm"
    >
      Fluency<span class="text-blue-600">Sync</span>
    </h1>
    <p
      class="text-xl sm:text-2xl text-gray-500 dark:text-gray-400 max-w-lg mx-auto font-medium leading-relaxed"
    >
      Master rapid Spanish verb conjugations through intelligent spaced
      repetition mapping.
    </p>
  </div>

  <!-- Call to action block -->
  <div class="flex flex-col sm:flex-row gap-5 w-full sm:w-auto mt-4 px-4">
    <div class="flex-1 w-full sm:w-48 text-center">
      <Button variant="primary" onclick={startNew}>Configure Session</Button>
    </div>

    {#if hasActiveSession}
      <div class="flex-1 w-full sm:w-48 text-center">
        <Button variant="secondary" onclick={resume}>Resume Session</Button>
      </div>
    {/if}
  </div>

  <!-- Simple global gamification tracker -->
  <div
    class="mt-16 text-center bg-white dark:bg-gray-800 px-10 py-5 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 lg:w-full lg:max-w-md"
  >
    <p
      class="text-gray-500 dark:text-gray-400 text-sm font-semibold tracking-wide uppercase"
    >
      All-Time Longest Streak
    </p>
    <p class="text-3xl font-black text-gray-800 dark:text-gray-100 mt-1">
      {appState.longestStreak}
      <span
        class="text-xl text-gray-400 dark:text-gray-500 font-semibold tracking-normal lowercase"
        >days</span
      >
    </p>
  </div>
</div>
