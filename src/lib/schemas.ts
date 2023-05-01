import { z } from "zod";
import { zfd } from 'zod-form-data'

export const updateProfileSchema = zfd.formData({
	username: z
        .string()
		.max(30, { message: 'Username must be less than 30 characters' })
		.optional(),
	avatarUrl: z.string().optional(),//zfd.file().optional(),
})
