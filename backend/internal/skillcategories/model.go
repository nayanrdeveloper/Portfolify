package categories

import (
	"portfolify/pkg/common"
)

// Category is global to the system, no user ownership
type Category struct {
	common.BaseModel `bson:",inline"`
	Name             string `bson:"name" json:"name"` // e.g. "Programming", "Database", "Communication"
}

// CategoryInput is used for creating/updating categories
type CategoryInput struct {
	Name string `json:"name" binding:"required"`
}
