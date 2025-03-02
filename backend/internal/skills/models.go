// internal/skills/model.go
package skills

import (
	"portfolify/pkg/common"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Skill struct {
	common.BaseModel `bson:",inline"`
	UserID           primitive.ObjectID `bson:"user_id" json:"user_id"`                             // The owner user
	Name             string             `bson:"name" json:"name"`                                   // e.g. "Golang"
	Proficiency      string             `bson:"proficiency,omitempty" json:"proficiency,omitempty"` // e.g. "Beginner", "Intermediate", "Expert"
	Years            float64            `bson:"years,omitempty" json:"years,omitempty"`             // e.g. 3.5
	// For icons:
	IconName    string               `bson:"icon_name,omitempty" json:"icon_name,omitempty"`       // e.g. "fa-brands fa-golang"
	IconURL     string               `bson:"icon_url,omitempty"  json:"icon_url,omitempty"`        // e.g. "https://cloudinary.com/..."
	CategoryIDs []primitive.ObjectID `bson:"category_ids,omitempty" json:"category_ids,omitempty"` // e.g. "Programming", "Database", "Communication"
	Progress    int                  `bson:"progress" json:"progress"`                             // e.g. 0..100
}

// SkillInput is for create/update requests
type SkillInput struct {
	Name        string  `json:"name" binding:"required"`
	Proficiency string  `json:"proficiency,omitempty"` // e.g. "Expert"
	Years       float64 `json:"years,omitempty"`

	// Either store an icon name for your frontend library or an image URL for a custom icon
	IconName    string   `json:"icon_name,omitempty"`
	IconURL     string   `json:"icon_url,omitempty"`
	CategoryIDs []string `json:"category_ids,omitempty"` // we'll receive them as hex string
	Progress    int      `json:"progress"`               // 0..100
}
