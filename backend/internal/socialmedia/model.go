// internal/socialmedia/model.go

package socialmedia

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
	"portfolify/pkg/common"
)

type SocialMedia struct {
	common.BaseModel `bson:",inline"`
	UserID           primitive.ObjectID `bson:"user_id" json:"user_id"`

	LinkedIn  string `bson:"linkedin,omitempty" json:"linkedin,omitempty"`
	Twitter   string `bson:"twitter,omitempty" json:"twitter,omitempty"`
	Facebook  string `bson:"facebook,omitempty" json:"facebook,omitempty"`
	Instagram string `bson:"instagram,omitempty" json:"instagram,omitempty"`
	GitHub    string `bson:"github,omitempty" json:"github,omitempty"`
	YouTube   string `bson:"youtube,omitempty" json:"youtube,omitempty"`
}

// For creation or update requests
type SocialMediaInput struct {
	LinkedIn  string `json:"linkedin,omitempty"`
	Twitter   string `json:"twitter,omitempty"`
	Facebook  string `json:"facebook,omitempty"`
	Instagram string `json:"instagram,omitempty"`
	GitHub    string `json:"github,omitempty"`
	YouTube   string `json:"youtube,omitempty"`
}
