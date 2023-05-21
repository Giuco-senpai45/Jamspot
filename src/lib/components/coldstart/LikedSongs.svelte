<script lang="ts">
	import type { Song } from '$lib/types';
	import Loading from './Loading.svelte';

	let search = '';
	let tracks: Song[] = [];
	let timeout: NodeJS.Timeout;
	let searching = false;
	export let likedSongs: Song[] = [];

	function handle_search() {
		searching = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(get_tracks, 750);
	}

	async function get_tracks() {
		if (!search) {
			reset();
			return;
		}

		const bodyJson = JSON.stringify({ name: search });

		const data = await fetch('http://127.0.0.1:8000/tracks', {
			// mode: 'no-cors',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
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
				console.log(e);
				
				alert(`Something went wrong ${e}`);
			});
		tracks = data?.tracks || [];
		searching = false;
	}

	function reset() {
		tracks = [];
		searching = false;
	}

	function addLikedSong(track: Song) {
		likedSongs = [...likedSongs, track];
		search = ''
		searching = false
		tracks = []
	}
</script>

<p class="text-2xl text-slate-400 font-extrabold text-left justify-start">
	Choose your favorite songs:
</p>
<div class="input-group justify-center">
	<input
		bind:value={search}
		on:input={handle_search}
		type="text"
		id="search"
		placeholder="Search favorite songs"
		class="input input-bordered opacity-80"
	/>
	<button class="btn btn-square opacity-80">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-6 w-6"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			><path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/></svg
		>
	</button>

	{#if searching}
		<Loading width="2em" height="2em" />
	{/if}
</div>
<ul class="h-36 mt-5 overflow-auto scrollbar">
	{#each tracks as track}
		<li class="li-song" on:click={() => addLikedSong(track)} on:keyup={() => addLikedSong(track)}>
			{track.artist} : {track.title}
		</li>
	{/each}
</ul>
<div class="flex-col justify-center">
	<p class="text-3xl font-extrabold text-slate-400 text-center self-center">Liked songs:</p>
	<ul class="justify-center space-x-2 mt-5 flex overflow-auto">
		{#each likedSongs as likedTrack}
			<li class="li-song">
				{likedTrack.title}
				<br/>
				{likedTrack.artist}
			</li>
		{/each}
	</ul>
</div>

<style>
	.li-song {
		@apply bg-black opacity-80 p-2 hover:bg-gray-800 hover:cursor-pointer text-center text-lg font-semibold;
	}
</style>
