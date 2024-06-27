export type TUserPreferences = {
    locale: string;
    theme: string;
    notifications?: {
        comments: boolean;
        likes: boolean;
        follows: boolean;
    };
    privacy?: {
        publicProfile: boolean;
        showEmail: boolean;
        showPhone: boolean;
    };
}

export type TUserPreferencesSnapshot = {
    id: string;
    data: TUserPreferences;
}