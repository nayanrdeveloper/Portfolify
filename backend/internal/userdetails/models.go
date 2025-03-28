package userdetails

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// UserDetails stores extended info for a user's portfolio/profile
type UserDetails struct {
	ID                primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID            primitive.ObjectID `bson:"user_id" json:"user_id"`
	FullName          string             `bson:"full_name" json:"full_name"`
	Title             string             `bson:"title" json:"title"`
	Bio               string             `bson:"bio" json:"bio"`
	SubTitle          string             `bson:"sub_title" json:"sub_title"`
	About             string             `bson:"about" json:"about"`
	Location          string             `bson:"location" json:"location"`
	ProfilePictureURL string             `bson:"profile_picture_url" json:"profile_picture_url"`

	// Social links or other portfolio fields
	GitHubURL   string `bson:"github_url" json:"github_url"`
	LinkedInURL string `bson:"linkedin_url" json:"linkedin_url"`
	TwitterURL  string `bson:"twitter_url" json:"twitter_url"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

// Input struct for creating/updating user details
type UserDetailsInput struct {
	FullName          *string `json:"full_name,omitempty"`
	SubTitle          *string `json:"sub_title,omitempty"`
	About             *string `json:"about,omitempty"`
	Title             *string `json:"title,omitempty"`
	Bio               *string `json:"bio,omitempty"`
	Location          *string `json:"location,omitempty"`
	ProfilePictureURL *string `json:"profile_picture_url,omitempty"`

	GitHubURL   *string `json:"github_url,omitempty"`
	LinkedInURL *string `json:"linkedin_url,omitempty"`
	TwitterURL  *string `json:"twitter_url,omitempty"`
}
