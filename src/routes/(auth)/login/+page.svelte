
<main class="bg-cover bg-[url('$lib/imgs/room.jpg')]">
	<main class="wrapper">
		<form action="?/login" method="POST" class="login-form">
			<div class="flex flex-col space-y-5">
				<input name="email" type="email" placeholder="Email" class="login-input" required />
				<input name="password" type="password" placeholder="Password" class="login-input" />
			</div>
			<button class="login-form-btn" type="submit">Login</button>
		</form>
	</main>
</main>

<style>
	.wrapper {
		@apply h-screen rounded-2xl shadow-2xl mx-20 md:mx-40 lg:mx-64 py-20
	}
	.login-form {
		@apply card-body backdrop-blur-sm py-20 px-10 space-y-10
	}

	.login-input {
		@apply text-left input input-ghost w-full self-center focus:bg-opacity-50;
	}

	.login-form-btn {
		@apply btn btn-sm sm:btn-sm md:btn-md lg:btn-lg border-transparent hover:border-transparent bg-[#877d70] rounded-xl text-[#14212f] hover:bg-[#bbad9b] hover:text-[#34567b] font-semibold tracking-wide font-serif shadow-lg;
	}
</style>
