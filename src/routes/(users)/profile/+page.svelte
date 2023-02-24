<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<h1 class="text-6xl text-red-400">
    This is your profile {data.session?.user.email}
</h1>