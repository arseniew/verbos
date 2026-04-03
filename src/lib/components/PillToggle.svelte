<script lang="ts">
    let {
        label,
        selected = $bindable(false),
        onchange,
    }: {
        label: string;
        selected: boolean;
        onchange?: (nowSelected: boolean) => void;
    } = $props();

    function handleClick() {
        selected = !selected;
        if (onchange) onchange(selected);
    }
</script>

<button
    type="button"
    aria-pressed={selected}
    onclick={handleClick}
    class="px-4 py-2 rounded-full text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 border whitespace-nowrap {selected
        ? 'bg-blue-600 text-white border-blue-600 shadow'
        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm'}"
>
    {label}
</button>
