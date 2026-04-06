<script lang="ts">
  import { goto } from "$app/navigation";
  import { base } from "$app/paths";
  import { appState } from "$lib/stores/gameState.svelte";
  import PillToggle from "$lib/components/PillToggle.svelte";
  import ToggleSwitch from "$lib/components/ToggleSwitch.svelte";
  import Button from "$lib/components/Button.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: { verbs: string[] } } = $props();

  // Hardcode baseline arrays available matching our generated dataset parameters
  let validTenses = $state([
    "Present",
    "Preterite",
    "Imperfect",
    "Conditional",
    "Future",
  ]);
  let validPersons = $state(["yo", "tú", "él", "nosotros", "ellos"]);

  // Dynamically toggle elements avoiding reactivity disconnects in nested arrays
  function onToggleTense(tense: string) {
    const index = appState.userConfig.selectedTenses.indexOf(tense);
    if (index > -1) {
      appState.userConfig.selectedTenses.splice(index, 1);
    } else {
      appState.userConfig.selectedTenses.push(tense);
    }
  }

  function onTogglePerson(person: string) {
    const index = appState.userConfig.selectedPersons.indexOf(person);
    if (index > -1) {
      appState.userConfig.selectedPersons.splice(index, 1);
    } else {
      appState.userConfig.selectedPersons.push(person);
    }
  }

  function onToggleVerb(verb: string) {
    const index = appState.userConfig.selectedVerbs.indexOf(verb);
    if (index > -1) {
      appState.userConfig.selectedVerbs.splice(index, 1);
    } else {
      appState.userConfig.selectedVerbs.push(verb);
    }
  }

  function beginSession() {
    if (appState.userConfig.selectedTenses.length === 0) return;
    if (appState.userConfig.selectedPersons.length === 0) return;

    // Push rigid save to local state natively and proceed
    appState.saveToStorage();
    goto(`${base}/learn`);
  }
</script>

<div class="max-w-2xl mx-auto py-12 px-6 space-y-12">
  <div class="text-center space-y-3">
    <h1 class="text-4xl font-bold text-gray-900 tracking-tight">
      Configure Parameter Sweep
    </h1>
    <p class="text-lg text-gray-500 font-medium">
      Define exactly what subsets you want to lock in and learn.
    </p>
  </div>

  <!-- Verb configuration array -->
  <div class="space-y-4 pt-4 border-t border-gray-100">
    <h2 class="text-xl font-bold text-gray-800">Target Verbs</h2>
    <div class="flex flex-wrap gap-2.5">
      {#each data.verbs as verb}
        <PillToggle
          label={verb}
          selected={appState.userConfig.selectedVerbs.includes(verb)}
          onchange={() => onToggleVerb(verb)}
        />
      {/each}
    </div>
  </div>

  <!-- Tense configuration array -->
  <div class="space-y-4 pt-4 border-t border-gray-100">
    <h2 class="text-xl font-bold text-gray-800">Target Tenses</h2>
    <div class="flex flex-wrap gap-2.5">
      {#each validTenses as tense}
        <PillToggle
          label={tense}
          selected={appState.userConfig.selectedTenses.includes(tense)}
          onchange={() => onToggleTense(tense)}
        />
      {/each}
    </div>
  </div>

  <!-- Context configuration array -->
  <div class="space-y-4 pt-4 border-t border-gray-100">
    <h2 class="text-xl font-bold text-gray-800">Target Subjects</h2>
    <div class="flex flex-wrap gap-2.5">
      {#each validPersons as person}
        <PillToggle
          label={person}
          selected={appState.userConfig.selectedPersons.includes(person)}
          onchange={() => onTogglePerson(person)}
        />
      {/each}
    </div>
  </div>

  <!-- Abstract Gamification Constraints -->
  <div class="space-y-4 pt-4 border-t border-gray-100">
    <h2 class="text-xl font-bold text-gray-800">Mechanics and Assists</h2>
    <div class="space-y-3">
      <ToggleSwitch
        label="Show English Translation"
        bind:checked={appState.userConfig.showEnglishTranslation}
      />
      <ToggleSwitch
        label="Show Contextual Base (Infinitive)"
        bind:checked={appState.userConfig.showBaseVerb}
      />
      <ToggleSwitch
        label="Strike-Free Mode (Errors don't decay algorithm)"
        bind:checked={appState.userConfig.stressFreeMode}
      />
    </div>
  </div>

  <div class="pt-10 flex justify-center">
    <div class="w-full max-w-sm text-center px-4">
      <!-- Ensure bounds don't fire without a base load selected -->
      <Button
        variant="primary"
        onclick={beginSession}
        disabled={appState.userConfig.selectedTenses.length === 0 ||
          appState.userConfig.selectedPersons.length === 0 ||
          appState.userConfig.selectedVerbs.length === 0}
      >
        Start Active Session
      </Button>
    </div>
  </div>
</div>
