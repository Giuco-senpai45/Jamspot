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
	<title>JamSpot</title>
</svelte:head>

<main class="w-screen h-screen bg-[url('$lib/imgs/room.jpg')] bg-cover">
	<Navbar />

	<slot />
</main>
