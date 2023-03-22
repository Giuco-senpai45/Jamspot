<script lang="ts">
	import logo from '$lib/imgs/js.svg';
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>

<div class="navbar sticky top-0 shadow-lg h-20 bg-black bg-opacity-40">
	<div class="flex-1">
		<a
			class="btn h-14 btn-ghost normal-case text-2xl text-center text-[#877d70] tracking-wide font-serif"
			href="/"
		>
			<span><img src={logo} class="w-14 mr-3" alt="JamSpot logo" /></span>
			JamSpot
		</a>
	</div>
	<div class="flex-none gap-2">
		<div class="dropdown dropdown-end">
			{#if $page.data.session}
				<div tabIndex={0} class="btn btn-ghost btn-circle avatar w-16 h-16">
					<div class="w-16 rounded-full">
						<img src={logo} alt="User profile pic" />
						<ul tabIndex={0} class="dropdown-menu">
							<li>
								<a class="justify-between" href="/profile"> Profile </a>
							</li>
							<li><a href="/settings">Settings</a></li>
							<li class="">
								<form action="/logout" method="POST" use:enhance={submitLogout}>
									<button class="uppercase" type="submit">Logout</button>
								</form>
							</li>
						</ul>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.dropdown-menu {
		@apply mt-3 p-2 shadow menu menu-compact lg:menu-normal dropdown-content bg-black bg-opacity-60 rounded-box w-52;
	}
</style>
