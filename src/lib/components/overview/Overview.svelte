<script lang="ts">
	import type { Song } from '$lib/types';
	import { onMount } from 'svelte';
	import Loading from '../coldstart/Loading.svelte';
	import { PUBLIC_API_BASE } from '$env/static/public';
	import liked_logo from '$lib/imgs/toucan_heart.svg';
	import not_liked_logo from '$lib/imgs/toucan_question.svg';

	export let username: string = "";
	export let recommendedSongsList: Song[] = [];
	export let userId: string;

	let likedSongsList: Song[] = [];
	let searching: boolean = true;
	let searching_liked: boolean = true;
	let simpleFilteringActive: boolean = true;

	const HEADERS_JSON = {
		'Accept': 'application/json',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Headers': '*'
	}

	async function fetch_accurate_recommendations() {
		const data = await fetch(`${PUBLIC_API_BASE}/recommend?user_id=${userId}`, {
			method: "get",
			headers: HEADERS_JSON,
		})
			.then((res) => {
					if (!res.ok) {
					alert('Something went wrong accurate recommendations');
					return;
				}
				return res.json();
			})
			.catch((e) => {
				alert(`Something went wrong in the request ${e}`);
			});
		recommendedSongsList = data?.tracks || [];
		searching = false;
	}

	async function fetch_current_likes() {
		const data = await fetch(`${PUBLIC_API_BASE}/liked_tracks?user_id=${userId}`, {
			method: "get",
			headers: HEADERS_JSON,
		})
			.then((res) => {
					if (!res.ok) {
					alert('Something went wrong fetching current liked songs');
					return;
				}
				return res.json();
			})
			.catch((e) => {
				alert(`Something went wrong in the request ${e}`);
			});

		likedSongsList = data?.tracks || [];
		searching_liked = false;
	}

	async function fetch_exploring_recommendations() {
		const data = await fetch(`${PUBLIC_API_BASE}/recommend-explore?user_id=${userId}`, {
			method: "get",
			headers: HEADERS_JSON,
		})
			.then((res) => {
					if (!res.ok) {
					alert('Something went wrong exploring recommendations');
					return;
				}
				return res.json();
			})
			.catch((e) => {
				alert(`Something went wrong in the request ${e}`);
			});
		recommendedSongsList = data?.tracks || [];
		searching = false;
	}

	function check_if_song_is_liked(song: Song) {
		if (likedSongsList.filter(tr => (tr.title === song.title && tr.artist === song.artist)).length > 0)
			return true;
		return false;
	}

	function switch_recommendations() {
		simpleFilteringActive = !simpleFilteringActive
		searching = true
		if(simpleFilteringActive) {
			fetch_accurate_recommendations()
		}
		else{ 
			fetch_exploring_recommendations()
		}
	}

	async function like_song(song: Song) {
		const bodyJson = JSON.stringify({
			user_id: userId,
			song
		});
		
		const data = await fetch(`${PUBLIC_API_BASE}/songs`, {
			method: "post",
			headers: HEADERS_JSON,
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

			searching = true
			searching_liked = true
			fetch_current_likes()

			if(simpleFilteringActive) {
				fetch_accurate_recommendations()
			}
			else{ 
				fetch_exploring_recommendations()
			}
	}

	onMount(() => {
		if(recommendedSongsList.length == 0) {
			fetch_accurate_recommendations()
		}

		if(likedSongsList.length == 0) {
			fetch_current_likes()
		}
	});
</script>

<div class="h-full overflow-clip mx-10 sm:mx-20">
	<p class="text-3xl flex justify-center p-5 text-[#cfb288] font-bold">Welcome {username}</p>
	<!-- Choose recommendation algorithm -->
	<div class="grid grid-cols-2">
		<div class="flex flex-col">
			<p class="recommended-playlist-text">Recommended songs</p>
			<div class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-5 justify-center ">
				{#if simpleFilteringActive}
					<button class="btn btn-warning">Accurate recommendations</button>
					<button class="btn" on:click={switch_recommendations}>Explore recommendations</button>
				{:else}
					<button class="btn" on:click={switch_recommendations}>Accurate recommendations</button>
					<button class="btn btn-warning">Explore recommendations</button>
				{/if}
			</div>
		</div>
		<div class="flex flex-col">
			<p class="recommended-playlist-text">Liked songs</p>
			<p class="text-lg lg:text-2xl text-[#907c5f] font-bold text-center justify-start drop-shadow-xl">Double click a song to like or unlike it</p>
		</div>
	</div>
	<!-- Recommended songs -->
	<div class="h-full pb-10 sm:grid sm:grid-cols-2">
		{#if searching}
			<div class="flex justify-center">
				<Loading width="5em" height="5em" />
			</div>
		{:else}
			<ul class="ul-recommended-playlist scrollbar-recommended-songs">
				{#each recommendedSongsList as song}
					<li on:dblclick={() => like_song(song)} id={song.id} class="grid grid-cols-3 justify-center">
						<div  class="li-song col-span-2 self-center grid grid-cols-2 sm:w-44 md:w-52 lg:w-96">
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
						</div>
						<div class="flex justify-center self-center">
							<span class="w-12 sm:w-12 md:w-16 lg:w-20 rounded-full hover:bg-amber-600 hover:bg-opacity-25">
								{#if check_if_song_is_liked(song)}
									<img src={liked_logo} alt="Liked song" />
								{:else}
									<img src={not_liked_logo} alt="Not liked song" />
								{/if}
							</span>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
		{#if searching_liked}
			<div class="flex justify-center">
				<Loading width="5em" height="5em" />
			</div>
		{:else}
			<ul class="ul-recommended-playlist md:ml-5 scrollbar-recommended-songs">
				{#each likedSongsList as song}
				<li on:dblclick={() => like_song(song)} id={song.id} class="grid grid-cols-3 justify-center">
					<div  class="li-song col-span-2 self-center grid grid-cols-2 sm:w-44 md:w-52 lg:w-96">
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
					</div>
					<div class="flex justify-center self-center">
						<span class="w-12 sm:w-12 md:w-16 lg:w-20 rounded-full hover:bg-amber-600 hover:bg-opacity-25 hidden sm:hidden lg:block">
							<img src={liked_logo} alt="Liked song" />
						</span>
					</div>
				</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	.recommended-playlist-text {
		@apply py-5 text-3xl text-[#cfb288] font-bold text-center justify-start drop-shadow-xl;
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
