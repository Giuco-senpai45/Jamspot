import type { PageServerLoad } from './$types';
import { prisma } from '$lib/server/prisma';
import { error } from '@sveltejs/kit';
import type { Song } from '$lib/types';
import { PUBLIC_API_BASE } from '$env/static/public';


export const load = (async ({ locals }) => {
	const getUserPreferences = async (userId: string) => {
		try {
			const user_prefs = prisma.user_preferences.findUnique({
				where: {
					id: userId
				}
			});
            

            return user_prefs;
		} catch (err) {
			console.log('Error: ', err);
			throw error(500, 'An unexpected error occured, please try again later.');
		}
	};

	const getUserLikedSongs = async (userId: string) => {
		
		const data = await fetch(`${PUBLIC_API_BASE}/liked_tracks?user_id=${userId}`, {
			method: "get",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Headers': '*'
			},
		})
			.then((res) => {
					if (!res.ok) {
					alert('Something went wrong fetching current liked songs');
					return;
				}
				return res.json();
			})
			.catch((e) => {
				alert(`Something went wrong in the request ${e}`);
			});

			const likedSongs: Song[] = data?.tracks || [];

			return likedSongs;
	}
    
	return {
		preferences: await getUserPreferences(locals.session.user.id),
		likedSongs: await getUserLikedSongs(locals.session.user.id)
	};
}) satisfies PageServerLoad;
