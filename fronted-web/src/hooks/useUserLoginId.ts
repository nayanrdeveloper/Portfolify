import { useAppSelector } from '@/redux/hooks'; // your typed hooks

export function useUserLoginId(): string | null {
    const userId = useAppSelector(
        (state) => state.auth.userProfile?.userId ?? null,
    );
    return userId;
}
