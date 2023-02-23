<script lang="ts">
</script>

<h1 class="register-page-title">Register</h1>
<form action="?/register" method="POST" class="card-body">
	<input name="email" type="email" placeholder="Email" class="register-input" required />
	<input name="password" type="password" placeholder="Password" class="register-input" />
	<button class="register-form-btn">Register</button>
</form>

<style>
	.register-wrapper {
		@apply sm:px-20 md:px-72 px-96 xl:mx-40 py-20;
	}

	.register-input {
		@apply text-left input input-ghost w-full self-center;
	}

	.register-page-title {
		@apply flex justify-center text-6xl text-center text-green-600 pt-5 pb-20 font-semibold tracking-wide font-serif;
	}

	.register-form-btn {
		@apply btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-green-700 rounded-xl text-zinc-300 hover:bg-green-600 hover:text-zinc-200 font-semibold tracking-wide font-serif;
	}
</style>
