export interface Achievement {
    _id?: string;
    user_id?: string;
    name: string;
    issuer: string;
    issueDate: string; // ISO date string, e.g., "2025-03-15T00:00:00.000Z"
    expirationDate?: string; // ISO date string or empty if not provided
    credentialID?: string;
    credentialURL?: string;
    description?: string;
}

/**
 * Standard API response type.
 */
export interface IAchievementResponse {
    status: string;
    message: string;
    data: Achievement | Achievement[];
}

/**
 * Payload for creating a new achievement.
 */
export interface CreateAchievementPayload {
    name: string;
    issuer: string;
    issueDate: string;
    expirationDate?: string;
    credentialID?: string;
    credentialURL?: string;
    description?: string;
}

/**
 * Payload for updating an achievement.
 */
export interface UpdateAchievementPayload
    extends Partial<CreateAchievementPayload> {
    id: string;
}
