package achievements

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Achievement struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID         primitive.ObjectID `bson:"user_id" json:"user_id"` // Reference to the user
	Name           string             `bson:"name" json:"name"`       // e.g. "AWS Certified Solutions Architect"
	Issuer         string             `bson:"issuer" json:"issuer"`   // e.g. "Amazon Web Services"
	IssueDate      time.Time          `bson:"issue_date" json:"issue_date"`
	ExpirationDate *time.Time         `bson:"expiration_date,omitempty" json:"expiration_date,omitempty"`
	CredentialID   string             `bson:"credential_id,omitempty" json:"credential_id,omitempty"`
	CredentialURL  string             `bson:"credential_url,omitempty" json:"credential_url,omitempty"`
	Description    string             `bson:"description,omitempty" json:"description,omitempty"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt      time.Time          `bson:"updated_at" json:"updated_at"`
}

// AchievementInput is used to bind request data for create/update
type AchievementInput struct {
	Name           string     `json:"name" binding:"required"`   // e.g. "AWS Certified Solutions Architect"
	Issuer         string     `json:"issuer" binding:"required"` // e.g. "Amazon Web Services"
	IssueDate      time.Time  `json:"issue_date" binding:"required"`
	ExpirationDate *time.Time `json:"expiration_date,omitempty"`
	CredentialID   string     `json:"credential_id,omitempty"`
	CredentialURL  string     `json:"credential_url,omitempty"`
	Description    string     `json:"description,omitempty"`
}
