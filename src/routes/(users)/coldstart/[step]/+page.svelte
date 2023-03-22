<script lang="ts">
	import { goto } from '$app/navigation';
	import { listen } from 'svelte/internal';
	import { number } from 'zod';
	import type { PageData } from './$types';

	export let data: PageData;

	const steps = [1, 2, 3, 4];
    const userSteps = ["Choose 5 favorite songs","Choose lightness","Choose mood"]

    let currLinkStep :number = +data.step!;

	$: if (!data.profile?.isNew) {
		goto('/');
	}
</script>

<main class="h-screen new-user-menu">
    <div class="new-user-question">
        
    </div>
    <ul class="steps steps-horizontal self-end">
        {#each steps as step}
            {#if step <= currLinkStep}
                <li class="step step-error" value={step}></li>
            {:else}
                <li class="step"></li>
            {/if}
        {/each}
    </ul>
</main>

<style>
    .new-user-menu {
        @apply grid grid-rows-2 py-16
    }

    .new-user-question {
        @apply card-body backdrop-blur-sm bg-black bg-opacity-40 mt-20 mx-36
    }
</style>