<script lang="ts">
	import type { PageData } from './$types'
	import logo from '$lib/imgs/js.svg';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';

	export let data: PageData;

	// Progressive enhancement this function will run if JS is disabled on the client
	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>

<div class="flex justify-center text-center py-10">
	<img src={logo} class="w-40" alt="JamSpot logo" />
	<p class="tracking-wide text-6xl text-center text-[#14212f]">JamSpot</p>
</div>
<main class="wrapper">
	{#if data.session}
		<p>Welcome, {data.session.user.email}</p>
		<form action="/logout" method="POST" use:enhance={submitLogout}>
			<button class="login-form-btn">Logout</button>
		</form>
	{:else}
		<div class="flex flex-col w-full md:flex-row">
			<div class="or-card">
				<a class="login-form-btn" href="/login">Login</a>
			</div>
			<div class="divider lg:divider-horizontal font-semibold text-black tracking-widest">OR</div>
			<div class="or-card">
				<a class="login-form-btn" href="/register">Register</a>
			</div>
		</div>
	{/if}
</main>

<style>
	.wrapper {
		@apply backdrop-blur-sm rounded-2xl shadow-2xl mx-20 md:mx-40 lg:mx-64 py-20
	}
	.or-card {
		@apply grid flex-grow card place-items-center
	}

	.homepage-title {
		@apply flex justify-center text-6xl text-center text-green-600 pt-5 pb-20 font-semibold tracking-wide font-serif;
	}

	.login-form-btn {
		@apply btn btn-sm sm:btn-sm md:btn-md lg:btn-lg border-transparent hover:border-transparent bg-[#877d70] rounded-xl text-[#14212f] hover:bg-[#bbad9b] hover:text-[#34567b] font-semibold tracking-wide font-serif shadow-lg;
	}
</style>