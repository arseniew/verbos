<script lang="ts">
    let {
        checked = $bindable(false),
        label,
        disabled = false,
    }: {
        checked: boolean;
        label: string;
        disabled?: boolean;
    } = $props();

    function toggle() {
        if (!disabled) {
            checked = !checked;
        }
    }
</script>

<button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    {disabled}
    onclick={toggle}
    class="flex items-center py-3 px-4 w-full bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
>
    <span class="text-gray-800 font-medium flex-1 text-left">{label}</span>
    <div
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors {checked
            ? 'bg-blue-600'
            : 'bg-gray-300'}"
    >
        <span
            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow {checked
                ? 'translate-x-6'
                : 'translate-x-1'}"
        ></span>
    </div>
</button>
