export async function fetchUserSettingsBySlug(slug: string) {
    try {
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!API_URL)
            throw new Error('NEXT_PUBLIC_API_BASE_URL is not defined');

        const res = await fetch(`${API_URL}/settings/user/${slug}`, {
            cache: 'no-store', // Ensure fresh data
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return null;
    }
}
