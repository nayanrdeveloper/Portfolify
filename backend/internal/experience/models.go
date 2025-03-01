package experience

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Experience struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"user_id" json:"user_id"` // Link to the user
	Title       string             `bson:"title" json:"title"`     // e.g. 'Senior Developer'
	Company     string             `bson:"company" json:"company"` // e.g. 'Google'
	Location    string             `bson:"location" json:"location"`
	StartDate   time.Time          `bson:"start_date" json:"start_date"`
	EndDate     *time.Time         `bson:"end_date,omitempty" json:"end_date,omitempty"`
	IsCurrent   bool               `bson:"is_current" json:"is_current"`
	Description string             `bson:"description" json:"description"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

// For creating/updating an experience
type ExperienceInput struct {
	Title       string     `json:"title" binding:"required"`
	Company     string     `json:"company" binding:"required"`
	Location    string     `json:"location,omitempty"`
	StartDate   time.Time  `json:"start_date" binding:"required"`
	EndDate     *time.Time `json:"end_date,omitempty"`
	IsCurrent   bool       `json:"is_current,omitempty"`
	Description string     `json:"description,omitempty"`
}
