package userdetails

import (
	"fmt"
	"time"

	"portfolify/internal/users"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserDetailsService struct {
	repo        *UserDetailsRepository
	userService *users.UserService
}

func NewUserDetailsService(r *UserDetailsRepository, u *users.UserService) *UserDetailsService {
	return &UserDetailsService{
		repo:        r,
		userService: u,
	}
}

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

func (s *UserDetailsService) CreateOrUpdate(userID primitive.ObjectID, input *UserDetailsInput) (*UserDetails, error) {
	details, err := s.GetOrCreate(userID)
	if err != nil {
		return nil, err
	}

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
	if input.Location != nil {
		details.Location = *input.Location
	}
	if input.ProfilePictureURL != nil {
		details.ProfilePictureURL = *input.ProfilePictureURL
	}
	if input.Email != nil {
		details.Email = *input.Email
	}
	if input.CurrentCompany != nil {
		details.CurrentCompany = *input.CurrentCompany
	}
	if input.YearsOfExperience != nil {
		details.YearsOfExperience = *input.YearsOfExperience
	}
	if input.PhoneNumber != nil {
		details.PhoneNumber = *input.PhoneNumber
	}
	if input.ResumeURL != nil {
		details.ResumeURL = *input.ResumeURL
	}
	if input.DateOfBirth != nil {
		details.DateOfBirth = *input.DateOfBirth
	}
	if input.WebsiteURL != nil {
		details.WebsiteURL = *input.WebsiteURL
	}
	if input.GreetingText != nil {
		details.GreetingText = *input.GreetingText
	}
	if input.HeadLine != nil {
		details.HeadLine = *input.HeadLine
	}
	if input.CallToActionMessage != nil {
		details.CallToActionMessage = *input.CallToActionMessage
	}
	if input.Quote != nil {
		details.Quote = *input.Quote
	}
	if input.FunFact != nil {
		details.FunFact = *input.FunFact
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
