// internal/socialmedia/repository.go

package socialmedia

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

type SocialMediaRepository struct {
	Collection *mongo.Collection
}

func NewSocialMediaRepository() *SocialMediaRepository {
	return &SocialMediaRepository{
		Collection: config.GetCollection("social_medias"),
	}
}

// Create a social media doc
func (r *SocialMediaRepository) Create(doc *SocialMedia) (*SocialMedia, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	doc.ID = primitive.NewObjectID()
	doc.CreatedAt = time.Now()
	doc.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, doc)
	if err != nil {
		logger.Log.Error("Failed to create social media doc", zap.Error(err))
		return nil, fmt.Errorf("failed to create social media doc: %w", err)
	}
	return doc, nil
}

// Because each user might have only one SocialMedia doc, we can fetch it by userID
func (r *SocialMediaRepository) GetByUserID(userID primitive.ObjectID) (*SocialMedia, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var sm SocialMedia
	err := r.Collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&sm)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No doc found
		}
		return nil, fmt.Errorf("failed to find social media doc: %w", err)
	}
	return &sm, nil
}

// Update fields by userID (since we store exactly one doc per user, we can identify it by userID)
func (r *SocialMediaRepository) UpdateByUserID(userID primitive.ObjectID, updateData bson.M) (*SocialMedia, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	result := r.Collection.FindOneAndUpdate(ctx, bson.M{"user_id": userID}, update)
	if result.Err() != nil {
		return nil, fmt.Errorf("failed to update social media doc: %w", result.Err())
	}

	// Return the updated doc
	var updated SocialMedia
	if err := result.Decode(&updated); err != nil {
		return nil, fmt.Errorf("failed to decode updated social media doc: %w", err)
	}
	return &updated, nil
}

// DeleteByUserID if you want to remove the doc
func (r *SocialMediaRepository) DeleteByUserID(userID primitive.ObjectID) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.Collection.DeleteOne(ctx, bson.M{"user_id": userID})
	if err != nil {
		logger.Log.Error("Failed to delete social media doc", zap.Error(err))
		return fmt.Errorf("failed to delete social media doc: %w", err)
	}
	return nil
}
