package socialmedia

import (
	"context"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"portfolify/config"
)

type SocialMediaRepository struct {
	collection *mongo.Collection
}

func NewSocialMediaRepository() *SocialMediaRepository {
	return &SocialMediaRepository{
		collection: config.GetCollection("social_media"),
	}
}

// GetByUserID retrieves the doc for a user (or nil if not found).
func (r *SocialMediaRepository) GetByUserID(userID primitive.ObjectID) (*SocialMedia, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID}
	var sm SocialMedia
	err := r.collection.FindOne(ctx, filter).Decode(&sm)
	if err == mongo.ErrNoDocuments {
		return nil, nil // doc doesn't exist
	}
	if err != nil {
		return nil, fmt.Errorf("failed to fetch social media doc: %w", err)
	}
	return &sm, nil
}

// UpsertByUserID either updates or creates the doc in one step.
func (r *SocialMediaRepository) UpsertByUserID(
	userID primitive.ObjectID,
	updateFields bson.M,
) (*SocialMedia, error) {

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// We want to ensure we set updated_at
	now := time.Now()
	updateFields["updated_at"] = now

	// Upsert with $setOnInsert to set created_at, user_id if doc doesn't exist
	update := bson.M{
		"$set": updateFields,
		"$setOnInsert": bson.M{
			"created_at": now,
			"user_id":    userID,
		},
	}

	opts := options.FindOneAndUpdate().
		SetUpsert(true).                 // create if not found
		SetReturnDocument(options.After) // return the updated doc

	filter := bson.M{"user_id": userID}
	result := r.collection.FindOneAndUpdate(ctx, filter, update, opts)
	if err := result.Err(); err != nil {
		return nil, fmt.Errorf("failed to upsert social media doc: %w", err)
	}

	var sm SocialMedia
	if err := result.Decode(&sm); err != nil {
		return nil, fmt.Errorf("failed to decode upserted doc: %w", err)
	}
	return &sm, nil
}
