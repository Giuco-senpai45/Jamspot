<script lang="ts">
	import { PUBLIC_API_BASE } from '$env/static/public';
	import Loading from '$lib/components/coldstart/Loading.svelte';
	import Radio from '$lib/components/coldstart/Radio.svelte';
	import type { Song } from '$lib/types';
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';

	export let data: PageData;

	let mood = data.preferences?.mood || 1;
	let speed = data.preferences?.speed || 1;
	let emotion = data.preferences?.emotion || 1;
	let tracks: Song[] = data.likedSongs;
	let searchedTracks: Song[] = [];
	let newLikedSongsHidden: Song[] = [];

	let search = '';
	let timeout: NodeJS.Timeout;
	let searching = false;

	const HEADERS_JSON = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'Access-Control-Allow-Headers': '*'
	};

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

	function handle_search() {
		searching = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(get_tracks, 750);
	}

	function reset() {
		searchedTracks = [];
		searching = false;
	}

	async function get_tracks() {
		if (!search) {
			reset();
			return;
		}

		const bodyJson = JSON.stringify({ name: search });

		const response_data = await fetch(`${PUBLIC_API_BASE}/tracks`, {
			headers: HEADERS_JSON,
			method: 'POST',
			body: bodyJson
		})
			.then((res) => {
				if (!res.ok) {
					alert('Something went wrong');
					return;
				}
				return res.json();
			})
			.catch((e) => {
				console.log(e);

				alert(`Something went wrong ${e}`);
			});
		searchedTracks = response_data?.tracks || [];
		searching = false;
	}

	function addLikedSong(track: Song) {
		tracks = [...tracks, track];
		newLikedSongsHidden = [...newLikedSongsHidden, track];
		search = '';
		searching = false;
		searchedTracks = [];
	}

	async function updatePreferences() {
		const bodyJson = JSON.stringify({
			user_id: data.session?.user.id,
			newLikedTracks: newLikedSongsHidden,
			speed,
			mood,
			emotion
		});
        console.log(bodyJson);
        

		const response_data = await fetch(`${PUBLIC_API_BASE}/preferences`, {
			headers: HEADERS_JSON,
			method: 'POST',
			body: bodyJson
		})
			.then((res) => {
				if (!res.ok) {
					alert('Something went wrong');
					return;
				}
                
                return res.json();
			})
			.catch((e) => {
				console.log(e);

				alert(`Something went wrong ${e}`);
			});

        console.log(response_data);

        window.location.href = "/";
	}
</script>

<main class="h-full bg-[url('$lib/imgs/vinyls.jpg')] bg-cover">
	<div class="p-10 grid grid-cols-2 gap-x-5 h-full overflow-clip">
		<div class="bg-black bg-opacity-80 justify-center p-5 col-span-1 h-auto">
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

		<div class="grid grid-cols-1">
			<div>
				<p class="text-2xl text-[#ccb18f] font-extrabold text-left justify-start">
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
			</div>

			<ul class="h-36 overflow-auto scrollbar">
				{#each searchedTracks as newLikedTrack}
					<li
						class="li-song"
						on:click={() => addLikedSong(newLikedTrack)}
						on:keyup={() => addLikedSong(newLikedTrack)}
					>
						{newLikedTrack.artist} : {newLikedTrack.title}
					</li>
				{/each}
			</ul>
		</div>

		<div class="flex col-span-2 overflow-auto">
			{#if data.likedSongs.length > 0}
				<ul class="ul-recommended-playlist w-full flex scrollbar-recommended-songs">
					{#each tracks as song}
						<li class="flex justify-center">
							<div class="li-song col-span-2 self-center grid grid-cols-2 sm:w-44 md:w-52 lg:w-96">
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
						</li>
					{/each}
				</ul>
			{:else}
				<Loading width="2em" height="2em" />
			{/if}
		</div>

		<div class="w-full col-span-2 mt-5">
			<button class="btn w-full self-center text-xl" on:click={updatePreferences}
				>Confirm changes</button
			>
		</div>
	</div>
</main>

<style>
	.ul-recommended-playlist {
		@apply h-auto col-span-1 grid grid-cols-1 overflow-auto space-y-5 py-10;
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
