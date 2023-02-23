<script lang="ts">
    interface $$Props extends Partial<svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['input']>> {
        id: string,
        label: string
    }
    export let id: string
    export let label: string

</script>

<label class="flex-1" for={id}>
    <span>
        {label}
    </span>
    <input name={id} {...$$restProps}>
</label>
