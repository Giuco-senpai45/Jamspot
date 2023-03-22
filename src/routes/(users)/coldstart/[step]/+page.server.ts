import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';

export const load = ({ locals, params }) => {

    const getUserProfile = async (userId: string) => {
        try {
            const profile = await prisma.profiles.findUnique({
                where: {
                    id: userId,
                }
            })
            
            return profile;
        } catch (err) {
            console.log(err);
            
            throw error(500, 'An unexpected error occured, please try again later.')
        }
    }
   
    if(locals.session?.user.id) {
        return {
            profile: getUserProfile(locals.session.user.id),
            step: params.step
        }
    }
}