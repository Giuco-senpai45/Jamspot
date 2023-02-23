<main >
	<form action="?/login" method="POST" class="login-form">
		<div class="flex flex-col space-y-5">
			<input name="email" type="email" placeholder="Email" class="login-input" required />
			<input name="password" type="password" placeholder="Password" class="login-input" />
		</div>
		<button class="login-form-btn" type="submit">Login</button>
	</form>
</main>

<style>
	.login-form {
		@apply card-body p-20 space-y-10
	}

	.login-input {
		@apply text-left input input-ghost w-full self-center focus:bg-slate-800;
	}

	.login-form-btn {
		@apply btn btn-xs sm:btn-sm md:btn-md lg:btn-lg bg-green-700 rounded-xl text-zinc-300 hover:bg-green-600 hover:text-zinc-200 font-semibold tracking-wide font-serif;
	}
</style>
