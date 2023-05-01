import { error, type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { validateFormData } from '$lib/utils';
import { updateProfileSchema } from '$lib/schemas';
import { supabaseClient } from '$lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { formData } from 'zod-form-data';

export const load: PageServerLoad = ({ locals }) => {

    const getUserProfile = async (userId: string) => {
        console.log(`USER ID PROFIL ${userId}`);
        
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
            profile: getUserProfile(locals.session.user.id)
        }
    }
    
}

export const actions: Actions = {
    updateProfile: async ({request, locals }) => {
        const { formData, errors } = await validateFormData(
            await request.formData(),
			updateProfileSchema,
            true
            )

        if (errors) {
			return fail(400, {
				data: formData,
				errors: errors.fieldErrors,
			})
		}

		try {
            const updatedProfile = await prisma.profiles.update({
                where: {
                    id: locals.session?.user.id,
				},
				data: {
                    username: formData.username,
                    avatarUrl: formData.avatarUrl,
                },
			})
    

            console.log(updatedProfile);
		} catch (err) {
			throw error(500, 'Something went wrong on our end.')
		}
    }
};