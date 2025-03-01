// internal/education/model.go
package education

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Education struct {
	ID           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID       primitive.ObjectID `bson:"user_id" json:"user_id"`         // Link to the user
	Institution  string             `bson:"institution" json:"institution"` // e.g. 'Stanford University'
	Degree       string             `bson:"degree" json:"degree"`           // e.g. 'Bachelor of Science'
	FieldOfStudy string             `bson:"field_of_study" json:"field_of_study"`
	StartDate    time.Time          `bson:"start_date" json:"start_date"` // e.g. 2020-09-01
	EndDate      *time.Time         `bson:"end_date,omitempty" json:"end_date,omitempty"`
	IsCurrent    bool               `bson:"is_current" json:"is_current"`
	Description  string             `bson:"description" json:"description"`
	CreatedAt    time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time          `bson:"updated_at" json:"updated_at"`
}

// EducationInput is used to bind request data for create/update
type EducationInput struct {
	Institution  string     `json:"institution" binding:"required"` // required field
	Degree       string     `json:"degree,omitempty"`
	FieldOfStudy string     `json:"field_of_study,omitempty"`
	StartDate    time.Time  `json:"start_date" binding:"required"`
	EndDate      *time.Time `json:"end_date,omitempty"`
	IsCurrent    bool       `json:"is_current,omitempty"`
	Description  string     `json:"description,omitempty"`
}
