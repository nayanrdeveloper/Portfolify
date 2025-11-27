export interface User {
    _id: string;
    fullName: string;
    email: string;
    slug: string;
    avatarUrl?: string;
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginResponse {
    message: string;
    data: {
        token: string;
    };
}

export interface RegisterResponse {
    message: string;
    data: {
        user: User;
        token: string;
    };
}
