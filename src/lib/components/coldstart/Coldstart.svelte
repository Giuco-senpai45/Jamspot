<script lang="ts">
	import Loading from "./Loading.svelte";

	interface Song {
		artist: string,
		title: string
	}

	let search = ''
	let tracks: Song[] = []
	let timeout: NodeJS.Timeout
	let searching = false

	function handle_search() {
		searching = true
		if (timeout) clearTimeout(timeout)
		timeout = setTimeout(get_tracks, 750)
	}

	async function get_tracks() {
		if (!search) {
			reset()
			return
		}

		const bodyJson = JSON.stringify({name: search})
		console.log(bodyJson);
		

		const data = await fetch(
			'http://127.0.0.1:8000/tracks',
			{
				// mode: 'no-cors',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "POST",
				body: bodyJson
			}
		)
			.then((res) => {
				if (!res.ok) {
					console.log("NU E OK RES")
					alert('Something went wrong')
					return
				}
				return res.json()
			})
			.catch((e) => {
				alert(`Something went wrong ${e}`)
			}
			)
		tracks = data?.tracks || []
		console.log(tracks);
		searching = false
	}

	function reset() {
		tracks = []
		searching = false
	}
</script>

<main class="h-screen new-user-menu">
	<div class="new-user-question">
		<div class="self-center">
			<div class="input-group">
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
					<Loading />
				{/if}
			</div>
			<ul class="h-36 mt-5 overflow-scroll">
				{#each tracks as track}
					<li class="li-song">
						{track.artist} : {track.title}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</main>

<style>
	.new-user-menu {
		@apply grid grid-rows-2 py-16;
	}

	.new-user-question {
		@apply card-body backdrop-blur-sm mx-36;
	}
	
	.li-song {
		@apply bg-black opacity-80 p-2 hover:bg-gray-800 hover:cursor-pointer text-center text-lg
	}
</style>
