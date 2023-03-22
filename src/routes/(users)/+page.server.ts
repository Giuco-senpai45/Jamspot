import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ locals }) => {
    try {
        if (locals.session?.user.id) {
            const profile = await prisma.profiles.findUnique({
                where: {
                    id: locals.session.user.id,
                },
            });
            return { profile };
        }
    } catch (err) {
        console.log(err);
        throw error(500, 'An unexpected error occurred, please try again later.');
    }
};