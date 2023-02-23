<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import '../app.css';
	import { supabaseClient } from '$lib/supabase';
	import Navbar from '$lib/components/Navbar.svelte';

	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll();
		});

		return () => {
			subscription.unsubscribe();
		};
	});

</script>

<svelte:head>
	<title>CineTune</title>
</svelte:head>

<main class="w-screen h-screen bg-[url('$lib/imgs/room.jpg')] bg-cover">
	<Navbar />

	<!-- Main wrapper for the inside of the website -->
	<main class="sm:px-20 md:px-72 px-96 xl:mx-40 py-20">
		<slot  />
	</main>
</main>
