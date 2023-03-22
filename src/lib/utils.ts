import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { z, ZodError } from 'zod';

export const getFileURL = (path: string): string => {
	return `${PUBLIC_SUPABASE_URL}/storage/v1/object/public/profiles/${path}`;
};

export const validateFormData = async <T extends z.ZodTypeAny>(
	formData: FormData,
	schema: T,
	zfd: boolean,
) : Promise<{
	formData: z.infer<T>,
	errors: z.inferFlattenedErrors<typeof schema> | null
}> => {
	if (zfd) {
		try {
			const data = schema.parse(formData);
			console.log(data);

			return {
				formData: data,
				errors: null
			};
		} catch (err) {
			console.log('Error: ', err);
			const errors = (err as ZodError).flatten();
			return {
				formData,
				errors
			};
		}
	} else {
		const body = Object.fromEntries(formData);

		try {
			const data = schema.parse(body);
			return {
				formData: data,
				errors: null
			};
		} catch (err) {
			console.log('Error: ', err);
			const errors = (err as ZodError).flatten();
			return {
				formData: body,
				errors
			};
		}
	}
};
