<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200"
>
	<ThemeToggle />
	{@render children()}
</div>
