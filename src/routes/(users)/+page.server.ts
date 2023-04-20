import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

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