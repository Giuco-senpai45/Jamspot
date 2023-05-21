import { error, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateFormData } from '$lib/utils';
import { finishedProfileSchema } from '$lib/schemas';


export const load: PageServerLoad = async ({ locals }) => {
	const getUserProfile = async (userId: string) => {
		try {
			const profile = await prisma.profiles.findUnique({
				where: {
					id: userId,
				},
			})
            
			return profile
		} catch (err) {
			console.log('Error: ', err)
			throw error(500, 'An unexpected error occured, please try again later.')
		}
	}

	if (!locals.session?.user.id) {
		return;
		throw error(500, 'Something went wrong.')
	}

	return {
		profile: await getUserProfile(locals.session.user.id),
	}
};

export const actions: Actions = {
	finishedColdStart: async ({request, locals }) => {
		const { formData, errors } = await validateFormData(
            await request.formData(),
			finishedProfileSchema,
            true
            )

        if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			})
		}

		try {
			const noLongerNewUser = formData.finishedPreferences ? false : true;
            const updatedProfile = await prisma.profiles.update({
                where: {
                    id: locals.session?.user.id,
				},
				data: {
                    isNew: noLongerNewUser,
                },
			})
		} catch (err) {
			throw error(500, 'Something went wrong on our end.')
		}
	}
};