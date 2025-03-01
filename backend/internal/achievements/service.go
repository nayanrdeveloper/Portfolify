package achievements

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AchievementService struct {
	repo *AchievementRepository
}

func NewAchievementService(r *AchievementRepository) *AchievementService {
	return &AchievementService{repo: r}
}

// Create a new achievement for a given user
func (s *AchievementService) Create(userID primitive.ObjectID, input *AchievementInput) (*Achievement, error) {
	ach := &Achievement{
		UserID:         userID,
		Name:           input.Name,
		Issuer:         input.Issuer,
		IssueDate:      input.IssueDate,
		ExpirationDate: input.ExpirationDate,
		CredentialID:   input.CredentialID,
		CredentialURL:  input.CredentialURL,
		Description:    input.Description,
	}
	return s.repo.Create(ach)
}

func (s *AchievementService) GetByID(id string) (*Achievement, error) {
	return s.repo.GetByID(id)
}

func (s *AchievementService) Update(id string, updateData bson.M) (*Achievement, error) {
	return s.repo.Update(id, updateData)
}

func (s *AchievementService) Delete(id string) error {
	return s.repo.Delete(id)
}

// GetByUserID returns all achievements for a given user
func (s *AchievementService) GetByUserID(userID primitive.ObjectID) ([]*Achievement, error) {
	return s.repo.GetByUserID(userID)
}
