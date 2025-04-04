package contactus

import (
    "portfolify/pkg/common"
    "go.mongodb.org/mongo-driver/bson/primitive"
)

type ContactUs struct {
    common.BaseModel `bson:",inline"`           // Provides ID, CreatedAt, UpdatedAt
    OwnerUserID      primitive.ObjectID `bson:"owner_user_id" json:"owner_user_id"` // The portfolio owner's user ID
    Name             string             `bson:"name" json:"name"`                   // Visitor's name
    Email            string             `bson:"email,omitempty" json:"email,omitempty"`
    PhoneNumber      string             `bson:"phone_number,omitempty" json:"phone_number,omitempty"`
    Message          string             `bson:"message" json:"message"`
}

type ContactUsInput struct {
    Name        string `json:"name" binding:"required"`
    Email       string `json:"email,omitempty"`
    PhoneNumber string `json:"phone_number,omitempty"`
    Message     string `json:"message" binding:"required"`
}
