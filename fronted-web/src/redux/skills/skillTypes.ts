// src/redux/skills/skillTypes.ts

/**
 * Skill model based on your Go model:
 *
 * type Skill struct {
 *   common.BaseModel // includes id, created_at, updated_at
 *   UserID           primitive.ObjectID `bson:"user_id" json:"user_id"`
 *   Name             string             `bson:"name" json:"name"`
 *   Proficiency      string             `bson:"proficiency,omitempty" json:"proficiency,omitempty"`
 *   Years            float64            `bson:"years,omitempty" json:"years,omitempty"`
 *   IconName         string             `bson:"icon_name,omitempty" json:"icon_name,omitempty"`
 *   IconURL          string             `bson:"icon_url,omitempty" json:"icon_url,omitempty"`
 *   CategoryIDs      []primitive.ObjectID `bson:"category_ids,omitempty" json:"category_ids,omitempty"`
 *   Progress         int                `bson:"progress" json:"progress"`
 * }
 *
 * For frontend purposes, ObjectIDs are strings.
 */

export interface Skill {
    id?: string;
    user_id?: string;
    name: string;
    proficiency?: string;
    years?: number;
    icon_name?: string;
    icon_url?: string;
    category_names?: string[]; // hex string array
    progress: number;
}

export interface ISkillResponse {
    status: string;
    message: string;
    data: Skill | Skill[];
}

export interface CreateSkillPayload {
    name: string;
    proficiency?: string;
    years?: number;
    icon_name?: string;
    icon_url?: string;
    category_names?: string[];
    progress: number;
}

export interface UpdateSkillPayload extends Partial<CreateSkillPayload> {
    id: string;
}
