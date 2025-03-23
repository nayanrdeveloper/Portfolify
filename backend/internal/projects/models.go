package projects

import (
	"portfolify/pkg/common"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Project struct {
	common.BaseModel `bson:",inline"`
	UserID           primitive.ObjectID `bson:"user_id" json:"user_id"`
	Name             string             `bson:"name" json:"name" validate:"required"`
	Description      string             `bson:"description" json:"description"`
	DemoLink         string             `bson:"demo_link" json:"demo_link"`
	GithubLink       string             `bson:"github_link" json:"github_link"`
	MediaURLs        []string           `bson:"media_urls,omitempty" json:"media_urls,omitempty"`
}
