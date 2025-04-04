package contactus

import (
    "fmt"

    "go.mongodb.org/mongo-driver/bson/primitive"
)

type ContactUsService struct {
    repo *ContactUsRepository
}

func NewContactUsService(r *ContactUsRepository) *ContactUsService {
    return &ContactUsService{repo: r}
}

// Create a message for the given portfolio owner's user ID
func (s *ContactUsService) Create(ownerUserID primitive.ObjectID, input *ContactUsInput) (*ContactUs, error) {
    if input.Message == "" {
        return nil, fmt.Errorf("message is required")
    }

    contact := &ContactUs{
        OwnerUserID: ownerUserID,
        Name:        input.Name,
        Email:       input.Email,
        PhoneNumber: input.PhoneNumber,
        Message:     input.Message,
    }
    return s.repo.Create(contact)
}

// GetMessages fetches all messages for the portfolio owner
func (s *ContactUsService) GetMessages(ownerUserID primitive.ObjectID) ([]*ContactUs, error) {
    return s.repo.GetMessagesByOwnerUserID(ownerUserID)
}

func (s *ContactUsService) GetByID(id string) (*ContactUs, error) {
    return s.repo.GetByID(id)
}

func (s *ContactUsService) Delete(id string) error {
    return s.repo.Delete(id)
}
