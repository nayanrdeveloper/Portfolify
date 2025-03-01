// internal/experience/service.go
package experience

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ExperienceService struct {
	repo *ExperienceRepository
}

func NewExperienceService(r *ExperienceRepository) *ExperienceService {
	return &ExperienceService{repo: r}
}

func (s *ExperienceService) Create(userID primitive.ObjectID, input *ExperienceInput) (*Experience, error) {
	exp := &Experience{
		UserID:      userID,
		Title:       input.Title,
		Company:     input.Company,
		Location:    input.Location,
		StartDate:   input.StartDate,
		EndDate:     input.EndDate,
		IsCurrent:   input.IsCurrent,
		Description: input.Description,
	}
	return s.repo.Create(exp)
}

func (s *ExperienceService) GetByID(id string) (*Experience, error) {
	return s.repo.GetByID(id)
}

func (s *ExperienceService) Update(id string, updateData bson.M) (*Experience, error) {
	// Possibly validate some fields in updateData
	return s.repo.Update(id, updateData)
}

func (s *ExperienceService) Delete(id string) error {
	return s.repo.Delete(id)
}

// GetByUserID returns all experiences for a given user ID
func (s *ExperienceService) GetByUserID(userID primitive.ObjectID) ([]*Experience, error) {
	return s.repo.GetByUserID(userID)
}
