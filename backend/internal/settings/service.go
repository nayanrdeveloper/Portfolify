package settings

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SettingsService struct {
	repo *SettingsRepository
}

func NewSettingsService(repo *SettingsRepository) *SettingsService {
	return &SettingsService{repo: repo}
}

func (s *SettingsService) UpdateSettings(userID primitive.ObjectID, input *UserSettingsInput) (*UserSettings, error) {
	// Add any business logic or validation here
	return s.repo.Upsert(userID, input)
}

func (s *SettingsService) GetUserSettings(userID primitive.ObjectID) (*UserSettings, error) {
	return s.repo.GetByUserID(userID)
}

// Fetch settings by user ID
func (s *SettingsService) GetByUserID(userID primitive.ObjectID) (*UserSettings, error) {
	return s.repo.GetByUserID(userID)
}
