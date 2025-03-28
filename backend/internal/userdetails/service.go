package userdetails

import (
	"fmt"
	"time"

	"portfolify/internal/users" // to lookup user by slug or ID if needed

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserDetailsService struct {
	repo        *UserDetailsRepository
	userService *users.UserService // We'll need this for slug -> user
}

func NewUserDetailsService(r *UserDetailsRepository, u *users.UserService) *UserDetailsService {
	return &UserDetailsService{
		repo:        r,
		userService: u,
	}
}

// GetOrCreate fetches the user details doc for a userID. If none, create a new empty one.
func (s *UserDetailsService) GetOrCreate(userID primitive.ObjectID) (*UserDetails, error) {
	existing, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return existing, nil
	}
	// create a new doc
	details := &UserDetails{
		ID:        primitive.NewObjectID(),
		UserID:    userID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	if err := s.repo.Create(details); err != nil {
		return nil, err
	}
	return details, nil
}

// CreateOrUpdate used when user sets or updates fields
func (s *UserDetailsService) CreateOrUpdate(userID primitive.ObjectID, input *UserDetailsInput) (*UserDetails, error) {
	details, err := s.GetOrCreate(userID)
	if err != nil {
		return nil, err
	}

	// Only update if the input field is non-nil
	if input.Title != nil {
		details.Title = *input.Title
	}
	if input.FullName != nil {
		details.FullName = *input.FullName
	}
	if input.SubTitle != nil {
		details.SubTitle = *input.SubTitle
	}
	if input.About != nil {
		details.About = *input.About
	}
	if input.Bio != nil {
		details.Bio = *input.Bio
	}
	if input.Location != nil {
		details.Location = *input.Location
	}
	if input.ProfilePictureURL != nil {
		details.ProfilePictureURL = *input.ProfilePictureURL
	}
	if input.GitHubURL != nil {
		details.GitHubURL = *input.GitHubURL
	}
	if input.LinkedInURL != nil {
		details.LinkedInURL = *input.LinkedInURL
	}
	if input.TwitterURL != nil {
		details.TwitterURL = *input.TwitterURL
	}

	details.UpdatedAt = time.Now()

	// Save changes
	if err := s.repo.Update(details); err != nil {
		return nil, err
	}
	return details, nil
}

// GetByUserID returns the user details if it exists, or nil if not found
func (s *UserDetailsService) GetByUserID(userID primitive.ObjectID) (*UserDetails, error) {
	return s.repo.GetByUserID(userID)
}

// GetBySlug looks up the user by slug in the 'users' collection, then fetches that user’s details
func (s *UserDetailsService) GetBySlug(slug string) (*UserDetails, error) {
	// 1) Find the user by slug
	user, err := s.userService.GetUserBySlug(slug)
	if err != nil {
		return nil, fmt.Errorf("user with slug '%s' not found: %w", slug, err)
	}

	// 2) Fetch details by userId
	details, err := s.repo.GetByUserID(user.ID)
	if err != nil {
		return nil, err
	}
	return details, nil
}
