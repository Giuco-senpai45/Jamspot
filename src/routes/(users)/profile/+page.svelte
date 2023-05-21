<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import type { PageData } from './$types';
	import logo from '$lib/imgs/js.svg';
	import toucans from '$lib/imgs/toucans.gif';
	import { supabaseClient } from '$lib/supabase';
	import { v4 as uuidv4 } from 'uuid';
	import { fade } from 'svelte/transition'

	export let data: PageData;
	const CDN_URL = "https://vocnbaffhtwjwconvhzm.supabase.co/storage/v1/object/public/profiles/"
	let userId = data.profile!.id;
	let inputProfilePic: HTMLInputElement;
	let avatarUrl: HTMLInputElement;
	let profilePic: HTMLImageElement;
	let confirmedPictureChanged: HTMLInputElement;
	// let showNoImage = data.profile!.avatarUrl != '' ? false : true;

	async function getOldProfilePic() {
		const { data: userPictures , error: err } =  await supabaseClient.storage
		.from('profiles')
		.list(userId + "/"  , {
			limit: 10,
			offset: 0,
			sortBy: { column: "name", order: "desc"}
		})
		
		if(userPictures != null) {
			return  userPictures[0];
		}
		return null;
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

            // showNoImage = false;
			currImg = file;
			confirmedPictureChanged.checked = false;
		}
	};

	function setFile(input: HTMLInputElement) {
		if(currImg) {
			const data = new DataTransfer();
			data.items.add(currImg); // Assuming that `accepted` is a File instance
			input.files = data.files;
		}
	}

	const confirmPicChange = async () => {
		const pictureId = `${Date.now()}`;//uuidv4();
		const newPicLink : string = userId + "/" + pictureId;
		console.log(`POZA NOUA ${newPicLink}`);
		

		const { data, error } = await supabaseClient.storage
		.from('profiles')
		.upload(newPicLink, currImg)

		avatarUrl.value = pictureId;
		confirmedPictureChanged.checked = true;	
	}

</script>


<main in:fade="{{duration: 1200}}" class="h-screen flex flex-col justify-center bg-gradient-to-l from-sky-500">
	<h1 class="profile-text">Your current profile</h1>
	<div class="grid sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
		<form action="?/updateProfile" method="POST" class="profile-form xl:col-span-2">
			<div class="avatar flex flex-col justify-center space-y-5">
				<div class="w-28 lg:w-36 rounded-full self-center ring ring-[#14212f] ring-opacity-30">
					{#await oldProfilePic then picture}
						{#if picture}
							<img src={CDN_URL + data.profile?.id + "/" + data.profile?.avatarUrl} alt="Profile picture" bind:this={profilePic} />
						{:else}
							<img src={logo} alt="No picture" bind:this={profilePic} />
						{/if}
					{/await}
				</div>
					<span class="flex self-center space-x-10">
						<label class="btn rounded-full w-max self-center " on:click={changeProfilePic}>Change profile picture</label>
						<label class="btn rounded-full w-max self-center " on:click={confirmPicChange}>Confirm new pic</label>				
					</span>
					<input
						name="profilePicture"
						type="file"
						accept="image/png, image/jpeg"
						on:change={pictureChanged}
						use:setFile
						class="hidden"
						bind:this={inputProfilePic}
					/>
					<input name="avatarUrl" type="text" class="hidden" bind:this={avatarUrl}>
			</div> 
			<div>
				<label for="username" class="profile-label">Username</label>
				<input name="username" type="text" placeholder={data.profile?.username} value={data.profile?.username} class="profile-input" />
			</div> 
			<input type="checkbox" checked={true} bind:this={confirmedPictureChanged} required> 
			<button type="submit" class="btn rounded-full w-max self-center">Update profile</button>
		</form>
		<div class="hidden md:flex justify-start">
			<img src={toucans} alt="Toucans">
		</div>
	</div>
</main>


<style>
	.profile-text {
		@apply flex justify-center text-4xl lg:text-6xl text-[#14212f] font-serif tracking-tight;
	}
	.profile-form {
		@apply card-body xl:px-40 space-y-12;
	}

	.profile-input {
		@apply text-left input w-full self-center;
	}

	.profile-label {
		@apply text-lg text-[#e1d0ba] font-semibold tracking-wide
	}
</style>
