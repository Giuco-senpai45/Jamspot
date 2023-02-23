<script lang="ts">
	import logo from '$lib/imgs/logo.png';
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

<div class="navbar shadow-lg">
	<div class="flex-1">
		<a class="btn btn-ghost normal-case text-xl text tracking-wide font-serif" href="/">
			<span><img src={logo} class="w-8 mr-3" alt="Cinetune logo" /></span>
			CineTune
		</a>
	</div>
	<div class="flex-none gap-2">
		<div class="dropdown dropdown-end">
			{#if $page.data.session}
				<div tabIndex={0} class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img src={logo} alt="User profile pic" />
						<ul
							tabIndex={0}
							class="dropdown-menu"
						>
							<li>
								<a class="justify-between" href="profile"> Profile </a>
							</li>
							<li><a href="/">Settings</a></li>
							<li>
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
		@apply mt-3 p-2 shadow menu menu-compact lg:menu-normal dropdown-content bg-slate-800 opacity-90 rounded-box w-52
	}
</style>
