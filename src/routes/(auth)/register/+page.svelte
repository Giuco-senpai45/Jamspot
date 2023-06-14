<script lang="ts">
	import Dialog from "$lib/components/Dialog.svelte";
	import { redirect } from "@sveltejs/kit";

	let dialog: HTMLDialogElement;

	function finishedRegister() {
		console.log("Finished register");
		
		redirect(303, '/');
	}
</script>

<main class="bg-cover bg-[url('$lib/imgs/room.jpg')]">
	<main class="wrapper">
		<h1 class="register-page-title">Register</h1>
		<form action="?/register" method="POST" class="card-body">
			<input name="email" type="email" placeholder="Email" class="register-input" required />
			<input name="password" type="password" placeholder="Password" class="register-input" />
			<button class="register-form-btn" on:submit={()=>dialog.showModal()}>Register</button>
		</form>
		<Dialog bind:dialog on:close={finishedRegister}>
			<form method="dialog">
				<p class="text-xl">We've sent you a confirmation email.</p>
				<br/>
				<p class="text-xl">Please confirm your identity in order to authenticate.</p>
				<div class="modal-action">
					<button class="btn">Close</button>
				</div>
			</form>
		</Dialog>
	</main>
</main>

<style>
	.wrapper {
		@apply h-screen backdrop-blur-sm rounded-2xl shadow-2xl mx-20 md:mx-40 lg:mx-64 py-16
	}
	.register-wrapper {
		@apply sm:px-20 md:px-72 px-96 xl:mx-40 py-20;
	}

	.register-input {
		@apply text-left input input-ghost w-full self-center;
	}

	.register-page-title {
		@apply flex justify-center text-6xl text-center text-[#14212f] pb-10 font-semibold tracking-wide font-serif;
	}

	.register-form-btn {
		@apply btn btn-sm sm:btn-sm md:btn-md lg:btn-lg border-transparent hover:border-transparent bg-[#877d70] rounded-xl text-[#14212f] hover:bg-[#bbad9b] hover:text-[#34567b] font-semibold tracking-wide font-serif shadow-lg;
	}
</style>
