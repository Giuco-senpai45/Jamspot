import { z } from "zod";
import { zfd } from 'zod-form-data'

export const SongSchema = z.object({
	artist: z.string(),
	title: z.string(),
	albumUrl: z.string(),
  });

export const updateProfileSchema = zfd.formData({
	username: z
        .string()
		.max(30, { message: 'Username must be less than 30 characters' })
		.optional(),
	avatarUrl: z.string().optional(),//zfd.file().optional(),
})

export const finishedProfileSchema = zfd.formData({
	finishedPreferences: z.any(),
	// likedSongs: z.array(SongSchema)
})
