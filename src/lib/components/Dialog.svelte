<script>
	export let dialog;
</script>

<dialog bind:this={dialog} on:close class="rounded-lg">
    <slot/>
</dialog>
