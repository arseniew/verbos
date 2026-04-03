<script lang="ts">
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import { appState } from "$lib/stores/gameState.svelte";
  import {
    initializeCard,
    gradeCard,
    isCardDue,
    AppGrade,
  } from "$lib/srs/scheduler";
  import AnswerInput from "$lib/components/AnswerInput.svelte";
  import Button from "$lib/components/Button.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  // Map extracted generic subsets universally across loaded verb targets
  let allExercises = $derived(
    data.verbsData.flatMap((v: any) => v.exercises) || [],
  );

  let activeQueue: any[] = $state([]);
  let currentQuestion: any = $state(null);
  let sessionCount = $state(0);
  // Arbitrary length constraint to trigger Gamification sequence organically
  const SESSION_GOAL = 10;

  // Once browser mounts securely and context executes we build the mathematical FSRS queue predictions
  $effect(() => {
    if (!browser || activeQueue.length > 0) return;

    // Rigid filter eliminating out-of-bounds configurations mapping
    const allowed = allExercises.filter(
      (ex: any) =>
        appState.userConfig.selectedTenses.includes(ex.tense) &&
        appState.userConfig.selectedPersons.includes(ex.person),
    );

    const dueTracker: any[] = [];
    const unlearnedTracker: any[] = [];

    allowed.forEach((ex: any) => {
      const key = `${ex.answer}:${ex.tense}:${ex.person}`;
      const card = appState.srsDatabase[key];
      if (!card) {
        unlearnedTracker.push({ ...ex, key });
      } else if (isCardDue(card)) {
        dueTracker.push({ ...ex, key });
      }
    });

    // Generate synthetic sequence randomizing selection priorities (Due cards first algorithmically, randomly supplemented natively)
    const mixed = [...dueTracker, ...unlearnedTracker].sort(
      () => Math.random() - 0.5,
    );
    activeQueue = mixed;

    if (activeQueue.length > 0) {
      currentQuestion = activeQueue[0];
    }
  });

  // FSRS Native Hook
  function handleSubmission(input: string) {
    if (!currentQuestion) return;
    const key = currentQuestion.key;
    let card = appState.srsDatabase[key] || initializeCard();

    // Correct evaluation increments stability inherently
    appState.srsDatabase[key] = gradeCard(card, AppGrade.Correct);
    finishCycle();
  }

  function handleHint() {
    if (!currentQuestion) return;
    const key = currentQuestion.key;
    let card = appState.srsDatabase[key] || initializeCard();

    appState.srsDatabase[key] = gradeCard(card, AppGrade.Hint);
    appState.saveToStorage();
  }

  function handleStrike() {
    // Evaluate stressFreeMode boundary natively intercepting penalties
    if (!currentQuestion || appState.userConfig.stressFreeMode) return;

    const key = currentQuestion.key;
    let card = appState.srsDatabase[key] || initializeCard();
    appState.srsDatabase[key] = gradeCard(card, AppGrade.Strike);
    appState.saveToStorage();
  }

  function finishCycle() {
    appState.saveToStorage();
    sessionCount++;
    activeQueue.shift();

    if (activeQueue.length > 0 && sessionCount < SESSION_GOAL) {
      currentQuestion = activeQueue[0];
    } else {
      goto("/summary");
    }
  }

  function quitSession() {
    goto("/");
  }
</script>

<div class="max-w-3xl mx-auto px-4 py-8 relative min-h-[70vh]">
  <!-- Visual Progress Representation -->
  <div
    class="absolute top-0 left-0 w-full h-1 bg-gray-100 rounded-full overflow-hidden"
  >
    <div
      class="h-full bg-blue-500 transition-all duration-300"
      style={`width: ${(sessionCount / SESSION_GOAL) * 100}%`}
    ></div>
  </div>

  <div class="flex justify-between items-center mt-6">
    <span class="text-sm font-semibold text-gray-400 uppercase tracking-widest"
      >{sessionCount} / {SESSION_GOAL}</span
    >
    <button
      onclick={quitSession}
      class="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors"
      >Quit</button
    >
  </div>

  {#if currentQuestion}
    <div class="py-16">
      <h2
        class="text-xl sm:text-2xl text-center text-gray-500 font-bold uppercase tracking-wider mb-6 pb-6 border-b border-gray-100 max-w-sm mx-auto"
      >
        {currentQuestion.tense} - {currentQuestion.person}
      </h2>
      <AnswerInput
        targetVerb={currentQuestion.answer}
        contextSentence={currentQuestion.sentence}
        translation={currentQuestion.translation}
        showEnglishTranslation={appState.userConfig.showEnglishTranslation}
        showBaseVerb={appState.userConfig.showBaseVerb}
        baseVerb={currentQuestion.verb}
        onSubmit={handleSubmission}
        onHintUsed={handleHint}
        onStrike={handleStrike}
        onNext={finishCycle}
      />
    </div>
  {:else}
    <div class="text-center py-32 space-y-4">
      <h2 class="text-3xl font-bold text-gray-700">No cards due!</h2>
      <p class="text-lg text-gray-500 font-medium">
        You're entirely caught up against all spacing parameters natively.
      </p>
      <div class="pt-8 flex justify-center">
        <Button variant="primary" onclick={() => goto("/")}>Return Home</Button>
      </div>
    </div>
  {/if}
</div>
