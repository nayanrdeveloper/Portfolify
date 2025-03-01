package users

import (
	"fmt"

	"portfolify/pkg/hash"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserService struct {
	repo *UserRepository
}

func NewUserService(r *UserRepository) *UserService {
	return &UserService{repo: r}
}

// RegisterUser hashes the password and creates a new user in DB.
func (s *UserService) RegisterUser(input RegisterUserInput) (*User, error) {
	// Check if email is already in use
	existing, _ := s.repo.GetUserByEmail(input.Email)
	if existing != nil {
		return nil, fmt.Errorf("email is already in use")
	}

	hashedPwd, err := hash.HashPassword(input.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	user := &User{
		Name:     input.Name,
		Email:    input.Email,
		Password: hashedPwd,
		Slug:     input.Slug,
	}

	if err := s.repo.CreateUser(user); err != nil {
		return nil, err
	}
	return user, nil
}

// LoginUser checks the user's credentials and returns the user if valid.
func (s *UserService) LoginUser(input LoginUserInput) (*User, error) {
	user, err := s.repo.GetUserByEmail(input.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	// Compare password hash
	if !hash.CheckPasswordHash(input.Password, user.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}
	return user, nil
}

func (s *UserService) GetUserBySlug(slug string) (*User, error) {
	return s.repo.GetUserBySlug(slug)
}

func (s *UserService) GetUserByID(id primitive.ObjectID) (*User, error) {
	return s.repo.GetUserByID(id)
}
