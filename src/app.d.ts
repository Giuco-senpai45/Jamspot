// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { PrismaClient } from '@prisma/client';
import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			sb: TypedSupabaseClient;
			session: Session | null;
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
		}
		// interface Platform {}
	}
	declare namespace NodeJS {
		interface Global {
			spotConfig: any;
		}
	}
}

export {};
