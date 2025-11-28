export interface Theme {
    id: string;
    name: string;
    description: string;
    thumbnailUrl: string;
    colors: {
        primary: string;
        secondary: string;
        background: string;
        foreground: string;
    };
    fontFamily: string;
}

export interface ThemeState {
    currentThemeId: string;
    customizations: {
        primaryColor?: string;
        fontFamily?: string;
    };
    availableThemes: Theme[];
    isLoading: boolean;
    error: string | null;
}
