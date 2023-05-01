<script lang="ts">
	interface Option {
		value: number;
		label: string;
	}

	export let options: Option[];
	export let legend: string;
	export let userSelected = options[0].value;
	export let fontSize = 16;
	export let flexDirection = 'column';

	const uniqueID = Math.floor(Math.random() * 100);

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
</script>

<div
	role="radiogroup"
	class="group-container"
	aria-labelledby={`label-${uniqueID}`}
	style="font-size:{fontSize}px; flex-direction:{flexDirection}"
	id={`group-${uniqueID}`}
>
	<div class="text-xl text-[#877d70] font-bold text-center" id={`label-${uniqueID}`}>{legend}</div>
	{#each options as { value, label }}
        <div class="flex space-x-2 justify-center">
            <input class="radio radio-warning" type="radio" id={slugify(label)} bind:group={userSelected} {value} />
            <label class="text-lg text-[#877d70] font-semibold" for={slugify(label)}> {label} </label>
        </div>
	{/each}
</div>

<style>
    .group-container {
        @apply flex justify-center space-y-2
    }
</style>
