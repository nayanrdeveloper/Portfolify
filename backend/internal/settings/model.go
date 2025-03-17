package settings

import (
	"portfolify/pkg/common"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserSettings struct {
	common.BaseModel `bson:",inline"`
	UserID           primitive.ObjectID `bson:"user_id" json:"user_id"`
	Template         string             `bson:"template" json:"template"` // e.g., "theme1", "theme2"
}

type UserSettingsInput struct {
	Template string `json:"template" binding:"required"`
}
