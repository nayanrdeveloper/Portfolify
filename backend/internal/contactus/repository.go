package contactus

import (
	"context"
	"fmt"
	"time"

	"portfolify/config"
	"portfolify/pkg/logger"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.uber.org/zap"
)

type ContactUsRepository struct {
	Collection *mongo.Collection
}

func NewContactUsRepository() *ContactUsRepository {
	return &ContactUsRepository{
		Collection: config.GetCollection("contact_us"), // Storing in "contact_us" collection
	}
}

// Create inserts a new contact message
func (r *ContactUsRepository) Create(contact *ContactUs) (*ContactUs, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	contact.ID = primitive.NewObjectID()
	contact.CreatedAt = time.Now()
	contact.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, contact)
	if err != nil {
		logger.Log.Error("Failed to create contact message", zap.Error(err))
		return nil, fmt.Errorf("failed to create contact message: %w", err)
	}
	return contact, nil
}

// GetMessagesByOwnerUserID returns all contact messages for a particular owner
func (r *ContactUsRepository) GetMessagesByOwnerUserID(ownerID primitive.ObjectID) ([]*ContactUs, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"owner_user_id": ownerID}
	cursor, err := r.Collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find contact messages: %w", err)
	}
	defer cursor.Close(ctx)

	var messages []*ContactUs
	for cursor.Next(ctx) {
		var msg ContactUs
		if err := cursor.Decode(&msg); err != nil {
			return nil, fmt.Errorf("failed to decode contact message: %w", err)
		}
		messages = append(messages, &msg)
	}
	return messages, nil
}

func (r *ContactUsRepository) GetByID(id string) (*ContactUs, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid contact message ID: %w", err)
	}

	var contact ContactUs
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&contact); err != nil {
		return nil, fmt.Errorf("contact message not found: %w", err)
	}
	return &contact, nil
}

func (r *ContactUsRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid contact message ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete contact message: %w", err)
	}
	return nil
}
