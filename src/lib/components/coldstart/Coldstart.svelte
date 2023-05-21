<script lang="ts">
	import type { Song } from '$lib/types';
	import LikedSongs from './LikedSongs.svelte';
	import Radio from './Radio.svelte';

	export let userId: string;
	let userLikedSongs: Song[] = [];
	let currStep = 1;

	let mood = 1;
	let speed = 1;
	let emotion = 1;

	const optionsLightness = [
		{
			value: 1,
			label: 'light'
		},
		{
			value: 2,
			label: 'dark'
		}
	];

	const optionsSpeed = [
		{
			value: 1,
			label: 'fast'
		},
		{
			value: 2,
			label: 'slow'
		}
	];

	const optionsEmotion = [
		{
			value: 1,
			label: 'happy'
		},
		{
			value: 2,
			label: 'meh'
		},
		{
			value: 3,
			label: 'sad'
		}
	];

	function nextStep() {
		currStep += 1;
	}

	function prevStep() {
		currStep -= 1;
	}

	export let recommendedSongs: Song[] = [];
	export let finished: boolean = false;

	async function finishProfile() {
		// let trackTitles : string[] = []
		// userLikedSongs.forEach(song => {
		// 	trackTitles.push(song.title)
		// })
		const bodyJson = JSON.stringify({
			user_id: userId,
			music: userLikedSongs,
			speed,
			mood,
			emotion
		});
		console.log(bodyJson);

		const data = await fetch('http://127.0.0.1:8000/recommend', {
			method: "post",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: bodyJson
		})
			.then((res) => {
					if (!res.ok) {
					console.log('NU E OK RES');
					alert('Something went wrong');
					return;
				}
				return res.json();
			})
			.catch((e) => {
				console.log(`INTRU ACI ${e}`);
				
				alert(`Something went wrong ${e}`);
			});
		recommendedSongs = data?.tracks || [];
		finished = true;
	}
</script>

<main class="h-screen new-user-menu">
	<div class="new-user-question">
		<ul class="steps">
			{#if currStep === 1}
				<li class="coldstart-step step step-warning">Choose favorite songs</li>
				<li class="coldstart-step step">Choose song types</li>
			{:else}
				<li class="coldstart-step step step-warning">Choose favorite songs</li>
				<li class="coldstart-step step step-warning">Choose song types</li>
			{/if}
		</ul>
		<div class="self-center grid grid-cols-1">
			{#if currStep === 1}
				<LikedSongs bind:likedSongs={userLikedSongs} />
			{:else}
				<div class="bg-black bg-opacity-80 justify-center p-5">
					<Radio
						options={optionsLightness}
						fontSize={16}
						legend="Select the desired lightness of the songs"
						bind:userSelected={mood}
					/>
					<Radio
						options={optionsSpeed}
						fontSize={16}
						legend="Choose the speed of the songs"
						bind:userSelected={speed}
					/>
					<Radio
						options={optionsEmotion}
						fontSize={16}
						legend="Choose the desired emotion of the songs"
						bind:userSelected={emotion}
					/>
				</div>
			{/if}

			<div class="flex justify-center space-x-5 mt-10">
				{#if currStep === 1}
					<button class="btn btn-wide" on:click={nextStep}>Next step</button>
				{:else}
					<button class="btn btn-wide" on:click={prevStep}>Prev step</button>					
					<button type="submit" class="btn btn-wide" on:click={finishProfile}>Finish profile</button>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.new-user-menu {
		@apply grid py-5;
	}

	.new-user-question {
		@apply card-body mx-36;
	}

	.coldstart-step {
		@apply text-slate-400 text-xl font-bold;
	}
</style>
