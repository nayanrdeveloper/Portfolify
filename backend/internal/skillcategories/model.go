package categories

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Category is global to the system, no user ownership
type Category struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	Name      string             `bson:"name" json:"name"` // e.g. "Programming", "Database", "Communication"
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`
}

// CategoryInput is used for creating/updating categories
type CategoryInput struct {
	Name string `json:"name" binding:"required"`
}
