package users

import (
	"portfolify/pkg/common"
)

type User struct {
	common.BaseModel `bson:",inline"`
	Name             string `bson:"name" json:"name"`
	Email            string `bson:"email" json:"email"`
	Password         string `bson:"password" json:"-"`
	Slug             string `bson:"slug" json:"slug"`
}

// Input structures for binding
type RegisterUserInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
	Slug     string `json:"slug" binding:"required"`
}

type LoginUserInput struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}
