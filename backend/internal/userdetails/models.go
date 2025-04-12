package userdetails

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserDetails struct {
	ID                  primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID              primitive.ObjectID `bson:"user_id" json:"user_id"`
	FullName            string             `bson:"full_name" json:"full_name"`
	Title               string             `bson:"title" json:"title"`
	SubTitle            string             `bson:"sub_title" json:"sub_title"`
	About               string             `bson:"about" json:"about"`
	Location            string             `bson:"location" json:"location"`
	ProfilePictureURL   string             `bson:"profile_picture_url" json:"profile_picture_url"`
	Email               string             `bson:"email" json:"email"`
	CurrentCompany      string             `bson:"current_company" json:"current_company"`
	YearsOfExperience   int                `bson:"years_of_experience" json:"years_of_experience"`
	PhoneNumber         string             `bson:"phone_number" json:"phone_number"`
	ResumeURL           string             `bson:"resume_url" json:"resume_url"`
	DateOfBirth         string             `bson:"date_of_birth" json:"date_of_birth"`
	WebsiteURL          string             `bson:"website_url" json:"website_url"`
	GreetingText        string             `bson:"greeting_text" json:"greeting_text"`
	HeadLine            string             `bson:"head_line" json:"head_line"`
	CallToActionMessage string             `bson:"call_to_action" json:"call_to_action"`
	Quote               string             `bson:"quote" json:"quote"`
	FunFact             string             `bson:"fun_fact" json:"fun_fact"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at"`
}

type UserDetailsInput struct {
	FullName            *string `json:"full_name,omitempty"`
	SubTitle            *string `json:"sub_title,omitempty"`
	About               *string `json:"about,omitempty"`
	Title               *string `json:"title,omitempty"`
	Location            *string `json:"location,omitempty"`
	ProfilePictureURL   *string `json:"profile_picture_url,omitempty"`
	Email               *string `json:"email,omitempty"`
	CurrentCompany      *string `json:"current_company,omitempty"`
	YearsOfExperience   *int    `json:"years_of_experience,omitempty"`
	PhoneNumber         *string `json:"phone_number,omitempty"`
	ResumeURL           *string `json:"resume_url,omitempty"`
	DateOfBirth         *string `json:"date_of_birth,omitempty"`
	WebsiteURL          *string `json:"website_url,omitempty"`
	GreetingText        *string `json:"greeting_text,omitempty"`
	HeadLine            *string `json:"head_line,omitempty"`
	CallToActionMessage *string `json:"call_to_action,omitempty"`
	Quote               *string `json:"quote,omitempty"`
	FunFact             *string `json:"fun_fact,omitempty"`
}
