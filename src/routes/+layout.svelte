<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen flex flex-col">
	<ThemeToggle />
	{@render children()}
</div>
