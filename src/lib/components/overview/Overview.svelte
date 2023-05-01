<script lang="ts">
	import type { Song } from "$lib/types";

    export let recommendedSongsList: Song[] = []
</script>

<div class="h-full overflow-clip mx-20">
    <p class="recommended-playlist-text">Recommended songs</p>
    <div class="h-full grid grid-cols-2">
        <ul class="ul-recommended-playlist scrollbar-recommended-songs">
            {#each recommendedSongsList as song}
                <li class="li-song self-center">
                    {song.artist} : {song.title}
                </li>
            {/each}
        </ul>
    </div>
</div>


<style>
    .recommended-playlist-text {
        @apply py-5 text-3xl text-[#cfb288] font-bold text-left justify-start drop-shadow-xl
    }

    .ul-recommended-playlist {
        @apply h-full col-span-1 justify-center flex flex-col overflow-auto space-y-5 m-5 p-5
    }

    .li-song {
		@apply bg-black opacity-80 p-5 hover:bg-gray-800 hover:cursor-pointer text-center text-lg font-semibold;
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