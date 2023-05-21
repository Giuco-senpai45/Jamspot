<script lang="ts">
	import logo from '$lib/imgs/js.svg';
	import { page } from '$app/stores';
	import { enhance, type SubmitFunction } from '$app/forms';
	import { supabaseClient } from '$lib/supabase';
	import type { Session } from '@supabase/supabase-js';

	export let session: Session | null;

	const CDN_URL = "https://vocnbaffhtwjwconvhzm.supabase.co/storage/v1/object/public/profiles/"
	let oldProfilePic = getOldProfilePic();
	let profilePicName: string;
	async function getOldProfilePic() {
		if(session) {
			const { data: userPictures , error: err } =  await supabaseClient.storage
			.from('profiles')
			.list(session.user?.id + "/"  , {
				limit: 10,
				offset: 0,
				sortBy: { column: "name", order: "desc"}
			})
			
			if(userPictures != null) {
				profilePicName = userPictures[0].name;
				return  userPictures[0];
			}
		}
		return null;
	}

	const submitLogout: SubmitFunction = async ({ cancel }) => {
		const { error } = await supabaseClient.auth.signOut();

		if (error) {
			console.log(error);
		}
		cancel();
	};
</script>

<div class="navbar sticky z-50 top-0 shadow-lg h-20 bg-black bg-opacity-50">
	<div class="flex-1">
		<a
			class="btn h-14 btn-ghost normal-case text-2xl text-center text-[#fe6865] tracking-wide font-serif"
			href="/"
		>
				<span>	
				<img src={logo} class="w-14 mr-3" alt="JamSpot logo" />
				</span>
			JamSpot
		</a>
	</div>
	<div class="flex-none gap-2">
		<div class="dropdown dropdown-end">
			{#if $page.data.session}
				<div tabIndex={0} class="btn btn-ghost btn-circle avatar w-16 h-16">
					<div class="w-16 rounded-full">
						{#if session}
							{#await oldProfilePic then picture}
								{#if picture}
									<img src={CDN_URL + session.user?.id + "/" + profilePicName} alt="JamSpot logo" />
								{:else}
									<img src={logo} alt="JamSpot logo" />
								{/if}

							{/await}
						{/if}
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
