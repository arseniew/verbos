<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        variant = "primary",
        type = "button",
        disabled = false,
        onclick,
        children,
    }: {
        variant?: "primary" | "secondary" | "danger" | "ghost";
        type?: "button" | "submit" | "reset";
        disabled?: boolean;
        onclick?: (e: MouseEvent) => void;
        children?: Snippet;
    } = $props();

    const baseClasses =
        "px-4 py-2 rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary:
            "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
        danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "bg-transparent text-blue-600 hover:bg-blue-50 shadow-none focus:ring-blue-400",
    };
</script>

<button {type} {disabled} {onclick} class="{baseClasses} {variants[variant]}">
    {@render children?.()}
</button>
