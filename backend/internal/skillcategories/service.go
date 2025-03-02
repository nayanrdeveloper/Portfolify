package categories

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type CategoryService struct {
	repo *CategoryRepository
}

func NewCategoryService(r *CategoryRepository) *CategoryService {
	return &CategoryService{repo: r}
}

func (s *CategoryService) Create(input *CategoryInput) (*Category, error) {
	cat := &Category{
		Name: input.Name,
	}
	return s.repo.Create(cat)
}

func (s *CategoryService) GetByID(id string) (*Category, error) {
	return s.repo.GetByID(id)
}

func (s *CategoryService) Update(id string, updateData bson.M) (*Category, error) {
	// E.g. ensure "name" is not empty, etc.
	if name, ok := updateData["name"].(string); ok && name == "" {
		return nil, fmt.Errorf("category name cannot be empty")
	}
	return s.repo.Update(id, updateData)
}

func (s *CategoryService) Delete(id string) error {
	return s.repo.Delete(id)
}

func (s *CategoryService) GetAll() ([]*Category, error) {
	return s.repo.GetAll()
}

func (s *CategoryService) GetOrCreateCategory(name string) (primitive.ObjectID, error) {
	// 1. See if a category with this name already exists
	existing, err := s.repo.GetByName(name)
	if err != nil {
		return primitive.NilObjectID, err
	}
	if existing != nil {
		// Found it; return its ID
		return existing.ID, nil
	}

	// 2. Otherwise, create a new category
	cat := &Category{Name: name}
	created, err := s.repo.Create(cat)
	if err != nil {
		return primitive.NilObjectID, err
	}
	return created.ID, nil
}

func (s *CategoryService) GetByIDs(categoryIDs []primitive.ObjectID) ([]*Category, error) {
	if len(categoryIDs) == 0 {
		return []*Category{}, nil // Return empty slice if no categories
	}

	return s.repo.GetByIDs(categoryIDs)
}
