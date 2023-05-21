<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import type { LayoutData } from './$types';
	import { onMount } from 'svelte';
	import '../app.css';
	import { supabaseClient } from '$lib/supabase';
	import Navbar from '$lib/components/Navbar.svelte';

	
	export let data: LayoutData;
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

<main class="h-screen">
	<Navbar session={data.session} />

	<slot />
</main>