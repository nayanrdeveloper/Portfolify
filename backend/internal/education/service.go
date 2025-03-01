package education

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EducationService struct {
	repo *EducationRepository
}

func NewEducationService(r *EducationRepository) *EducationService {
	return &EducationService{repo: r}
}

// Create a new education record for a specific user.
func (s *EducationService) Create(userID primitive.ObjectID, input *EducationInput) (*Education, error) {
	edu := &Education{
		UserID:       userID,
		Institution:  input.Institution,
		Degree:       input.Degree,
		FieldOfStudy: input.FieldOfStudy,
		StartDate:    input.StartDate,
		EndDate:      input.EndDate,
		IsCurrent:    input.IsCurrent,
		Description:  input.Description,
	}
	return s.repo.Create(edu)
}

func (s *EducationService) GetByID(id string) (*Education, error) {
	return s.repo.GetByID(id)
}

// Update modifies fields of an education record
func (s *EducationService) Update(id string, updateData bson.M) (*Education, error) {
	return s.repo.Update(id, updateData)
}

func (s *EducationService) Delete(id string) error {
	return s.repo.Delete(id)
}

// GetByUserID returns all education docs for a given user
func (s *EducationService) GetByUserID(userID primitive.ObjectID) ([]*Education, error) {
	return s.repo.GetByUserID(userID)
}
