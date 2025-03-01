package projects

import (
	"errors"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type ProjectService struct {
	Repo *ProjectRepository
}

func NewProjectService(repo *ProjectRepository) *ProjectService {
	return &ProjectService{Repo: repo}
}

func (s *ProjectService) CreateProject(project *Project) (*Project, error) {
	if project.Name == "" {
		return nil, errors.New("project name is required")
	}
	return s.Repo.CreateProject(project)
}

func (s *ProjectService) GetProjectByID(id string) (*Project, error) {
	return s.Repo.GetProjectByID(id)
}

func (s *ProjectService) UpdateProject(id string, updateData bson.M) (*Project, error) {
	return s.Repo.UpdateProject(id, updateData)
}

func (s *ProjectService) DeleteProject(id string) error {
	return s.Repo.DeleteProject(id)
}

func (s *ProjectService) GetProjectsByUserID(userID primitive.ObjectID) ([]*Project, error) {
	return s.Repo.GetProjectsByUserID(userID)
}
