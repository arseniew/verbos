<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { appState } from "$lib/stores/gameState.svelte";
  import Button from "$lib/components/Button.svelte";

  // Simple Gamification mechanic natively pushing global user state constraints tracking positive outcomes seamlessly
  $effect(() => {
    if (browser) {
      appState.longestStreak++;
      appState.saveToStorage();
    }
  });

  function exit() {
    goto("/");
  }
</script>

<div
  class="flex flex-col items-center justify-center min-h-[75vh] px-4 space-y-8 animate-fade-in text-center max-w-xl mx-auto"
>
  <div
    class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl shadow-sm mb-4"
  >
    ✓
  </div>

  <h1 class="text-5xl font-black text-gray-900 tracking-tight">
    Session Complete!
  </h1>
  <p class="text-xl text-gray-500 font-medium">
    Outstanding focus! You successfully hit the algorithmic bounds configuration
    dynamically.
  </p>

  <div
    class="bg-gray-50 border border-gray-100 rounded-3xl p-10 my-10 shadow-sm w-full relative overflow-hidden"
  >
    <div class="absolute inset-0 bg-blue-500 opacity-[0.03]"></div>
    <h2
      class="text-sm font-bold text-gray-400 uppercase tracking-widest relative z-10"
    >
      Ascending Streak Maintained
    </h2>
    <div
      class="text-7xl font-black text-blue-600 mt-2 tracking-tight relative z-10"
    >
      {appState.longestStreak}
      <span
        class="text-2xl text-blue-400 font-bold tracking-normal lowercase -ml-1"
        >days</span
      >
    </div>
  </div>

  <div class="flex justify-center w-full pt-4">
    <div class="w-full sm:w-64">
      <Button variant="primary" onclick={exit}>Return to Dashboard</Button>
    </div>
  </div>
</div>

<style>
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
