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

// Create a new doc if it doesn't exist yet for that user
func (s *SocialMediaService) Create(userID primitive.ObjectID, input *SocialMediaInput) (*SocialMedia, error) {
	// Check if doc already exists
	existing, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, fmt.Errorf("social media doc already exists for this user – use update instead")
	}

	doc := &SocialMedia{
		UserID:    userID,
		LinkedIn:  input.LinkedIn,
		Twitter:   input.Twitter,
		Facebook:  input.Facebook,
		Instagram: input.Instagram,
		GitHub:    input.GitHub,
		YouTube:   input.YouTube,
	}
	return s.repo.Create(doc)
}

// Get doc by user ID
func (s *SocialMediaService) GetByUserID(userID primitive.ObjectID) (*SocialMedia, error) {
	return s.repo.GetByUserID(userID)
}

// Update fields by userID
func (s *SocialMediaService) Update(userID primitive.ObjectID, updateData bson.M) (*SocialMedia, error) {
	return s.repo.UpdateByUserID(userID, updateData)
}

// Delete doc by userID
func (s *SocialMediaService) Delete(userID primitive.ObjectID) error {
	return s.repo.DeleteByUserID(userID)
}
