package socialmedia

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SocialMediaService struct {
	repo *SocialMediaRepository
}

func NewSocialMediaService(r *SocialMediaRepository) *SocialMediaService {
	return &SocialMediaService{repo: r}
}

// GetByUserID fetches the doc for that user (nil if none)
func (s *SocialMediaService) GetByUserID(userID primitive.ObjectID) (*SocialMedia, error) {
	return s.repo.GetByUserID(userID)
}

// Upsert for user: merges the partial fields from SocialMediaUpdate
func (s *SocialMediaService) Upsert(userID primitive.ObjectID, input *SocialMediaUpdate) (*SocialMedia, error) {
	// Convert pointer fields to a bson.M
	updateFields := bson.M{}
	if input.LinkedIn != nil {
		updateFields["linkedin"] = *input.LinkedIn
	}
	if input.Twitter != nil {
		updateFields["twitter"] = *input.Twitter
	}
	if input.Facebook != nil {
		updateFields["facebook"] = *input.Facebook
	}
	if input.Instagram != nil {
		updateFields["instagram"] = *input.Instagram
	}
	if input.GitHub != nil {
		updateFields["github"] = *input.GitHub
	}
	if input.YouTube != nil {
		updateFields["youtube"] = *input.YouTube
	}

	if len(updateFields) == 0 {
		return nil, fmt.Errorf("no fields to update")
	}

	// Upsert in repository
	return s.repo.UpsertByUserID(userID, updateFields)
}
