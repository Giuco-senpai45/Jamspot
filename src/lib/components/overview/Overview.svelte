<script lang="ts">
	import type { Song } from '$lib/types';
	import { onMount } from 'svelte';
	import Loading from '../coldstart/Loading.svelte';

	export let recommendedSongsList: Song[] = [];
	export let userId: string;

	let searching: boolean = true;

	async function fetch_current_recommendations() {
		const data = await fetch(`http://127.0.0.1:8000/recommend?user_id=${userId}`, {
			method: "get",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
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
		recommendedSongsList = data?.tracks || [];
		searching = false;
	}

	onMount(() => {
		if(recommendedSongsList.length == 0) {
			fetch_current_recommendations()
		}
	});
</script>

<div class="h-full overflow-clip mx-10 sm:mx-20">
	<p class="recommended-playlist-text">Recommended songs</p>
	<div class="h-full sm:grid sm:grid-cols-2">
		{#if searching}
			<div class="flex justify-center">
				<Loading width="5em" height="5em" />
			</div>
		{:else}
			<ul class="ul-recommended-playlist scrollbar-recommended-songs">
				{#each recommendedSongsList as song}
					<li class="li-song self-center grid grid-cols-2 sm:w-44 md:w-52 lg:w-96">
						<img
							src={song.albumUrl}
							alt={song.title}
							class="sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-40 lg:h-40 self-center"
						/>
						<div class="self-center lg:px-5">
							<span class="text-slate-100 md:text-md">{song.title}</span>
							<br />
							<span class="text-slate-400 md:text-md">{song.artist}</span>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.recommended-playlist-text {
		@apply py-5 text-3xl text-[#cfb288] font-bold text-left justify-start drop-shadow-xl;
	}

	.ul-recommended-playlist {
		@apply h-auto col-span-1 flex flex-col overflow-scroll space-y-5 my-10 py-10;
	}

	.li-song {
		@apply bg-black opacity-80 hover:bg-gray-800 hover:cursor-pointer text-center text-lg font-semibold;
	}

	.scrollbar-recommended-songs::-webkit-scrollbar {
		width: 20px;
		height: 20px;
	}

	.scrollbar-recommended-songs::-webkit-scrollbar-track {
		background: #313d48;
	}

	.scrollbar-recommended-songs::-webkit-scrollbar-thumb {
		background: #cfb288;
		border: 3px solid #4b5d6e;
	}

	.scrollbar-recommended-songs::-webkit-scrollbar-thumb:hover {
		background: #37424c;
	}
</style>
