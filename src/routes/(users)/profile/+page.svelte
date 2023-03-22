<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import logo from '$lib/imgs/js.svg';
	import { supabaseClient } from '$lib/supabase';
	import { v4 as uuidv4 } from 'uuid';
	import { fade } from 'svelte/transition'


	export let data: PageData;
	const CDN_URL = "https://vocnbaffhtwjwconvhzm.supabase.co/storage/v1/object/public/profiles/"
	let userId = data.profile!.id;
	let inputProfilePic: HTMLInputElement;
	let profilePic: HTMLImageElement;
	let showNoImage = data.profile!.avatarUrl != '' ? false : true;

	async function getOldProfilePic() {
		
		const { data: userPictures , error: err } =  await supabaseClient.storage
		.from('profiles')
		.list(data.profile!.id + "/", {
			limit: 100,
			offset: 0,
			sortBy: { column: "name", order: "asc"}
		})

		if(userPictures != null) {
			// console.log(userPictures);
			// console.log(CDN_URL + data.profile?.id + "/" + userPictures[0]?.name);
			return  userPictures[0];
		}
	}

	let oldProfilePic = getOldProfilePic();
	let currImg: File;

	const changeProfilePic = () => {
		inputProfilePic.click();
	};

	const pictureChanged = async () => {
		const file = inputProfilePic.files![0];		

		if (file) {
			const reader = new FileReader();
			reader.addEventListener('load', function () {
                const filePath = reader.result! as string;
				profilePic.setAttribute('src', filePath);
			});
			reader.readAsDataURL(file);

            showNoImage = false;
			currImg = file;
		}
	};

	function setFile(input: HTMLInputElement) {
		if(currImg) {
			const data = new DataTransfer();
			data.items.add(currImg); // Assuming that `accepted` is a File instance
			input.files = data.files;
		}
	}

</script>


<main in:fade="{{duration: 1200}}">
	<h1 class="profile-text">Your current profile</h1>
	<form action="?/updateProfile" method="POST" class="profile-form">
		<div class="avatar flex flex-col justify-center space-y-5">
			<div class="w-28 lg:w-36 rounded-full self-center ring ring-[#14212f] ring-opacity-30">
				{#if showNoImage}
					<!-- {#await oldProfilePic then picture} -->
						{#if data.profile?.avatarUrl}
							 <img src={CDN_URL + data.profile?.id + "/" + data.profile?.avatarUrl} alt="Profile picture" />
						{:else}
							<img src={logo} alt="No picture" />
						{/if}
					<!-- {/await} -->
				{:else}
					<img src={logo} alt="Profile picture" bind:this={profilePic} />
				{/if}
			</div>
			<label
				class="btn rounded-full w-max self-center"
				on:click={changeProfilePic}>Change profile picture</label
			>
			<input
				name="avatarUrl"
				type="file"
				accept="image/png, image/jpeg"
				on:change={pictureChanged}
				use:setFile
				class="hidden"
				bind:this={inputProfilePic}
			/>
		</div> 
		<div>
			<label for="username" class="profile-label">Username</label>
			<input name="username" type="text" placeholder={data.profile?.username} class="profile-input" />
		</div> 

		<button type="submit" class="btn rounded-full w-max self-center">Update profile</button>
	</form> 
</main>


<style>
	.profile-text {
		@apply flex justify-center text-4xl lg:text-6xl mt-10 text-[#14212f] font-serif tracking-tight;
	}
	.profile-form {
		@apply card-body backdrop-blur-sm mx-20 lg:my-10 lg:mx-40 lg:px-20 lg:py-12 lg:space-y-12;
	}

	.profile-input {
		@apply text-left input w-full self-center;
	}

	.profile-label {
		@apply text-lg text-[#e1d0ba] font-semibold tracking-wide
	}
</style>
