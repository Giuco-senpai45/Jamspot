import { AuthApiError } from '@supabase/supabase-js';
import { fail, type Actions, redirect } from '@sveltejs/kit';

export const actions: Actions = {
	register: async ({ request, locals }) => {
		const body = Object.fromEntries(await request.formData());

		const { data, error: err } = await locals.sb.auth.signUp({
			email: body.email as string,
			password: body.password as string
		});
		console.log(data);
		


		if (err) {
			console.log(err);
			
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: 'Invalid email of password'
				});
			}
			return fail(500, {
				error: 'Server errror. Please try again later'
			});
		}

		throw redirect(303, '/');
	}
};
