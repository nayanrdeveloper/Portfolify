// src/redux/education/educationTypes.ts

/**
 * Based on your Go model:
 * type Education struct {
 *   common.BaseModel // includes id, created_at, updated_at
 *   UserID           primitive.ObjectID `bson:"user_id" json:"user_id"`
 *   Institution      string             `bson:"institution" json:"institution"`
 *   Degree           string             `bson:"degree" json:"degree"`
 *   FieldOfStudy     string             `bson:"field_of_study" json:"field_of_study"`
 *   StartDate        time.Time          `bson:"start_date" json:"start_date"`
 *   EndDate          *time.Time         `bson:"end_date,omitempty" json:"end_date,omitempty"`
 *   IsCurrent        bool               `bson:"is_current" json:"is_current"`
 *   Description      string             `bson:"description" json:"description"`
 * }
 *
 * For the frontend, ObjectIDs and time.Time are represented as strings.
 */

export interface Education {
    id?: string;
    user_id?: string;
    institution: string;
    degree?: string;
    field_of_study?: string;
    start_date: string; // ISO string format
    end_date?: string; // ISO string or empty if not provided
    is_current: boolean;
    description?: string;
}

/**
 * Standard API response type.
 */
export interface IEducationResponse {
    status: string; // "success" or "error"
    message: string;
    data: Education | Education[];
}

/**
 * Payload for creating a new education record.
 */
export interface CreateEducationPayload {
    institution: string;
    degree?: string;
    field_of_study?: string;
    start_date: string;
    end_date?: string;
    is_current?: boolean;
    description?: string;
}

/**
 * Payload for updating an education record.
 */
export interface UpdateEducationPayload
    extends Partial<CreateEducationPayload> {
    id: string;
}
