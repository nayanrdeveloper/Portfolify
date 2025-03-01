package userdetails

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

type UserDetailsRepository struct {
	Collection *mongo.Collection
}

func NewUserDetailsRepository() *UserDetailsRepository {
	return &UserDetailsRepository{
		Collection: config.GetCollection("user_details"), // separate collection
	}
}

// GetByUserID fetches the user details document for a particular user ID
func (r *UserDetailsRepository) GetByUserID(userID primitive.ObjectID) (*UserDetails, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var details UserDetails
	err := r.Collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&details)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // no details found
		}
		return nil, fmt.Errorf("failed to find user details by user_id: %w", err)
	}
	return &details, nil
}

// Create inserts a new user details doc
func (r *UserDetailsRepository) Create(details *UserDetails) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := r.Collection.InsertOne(ctx, details)
	if err != nil {
		logger.Log.Error("Failed to create user details", zap.Error(err))
		return fmt.Errorf("failed to insert user details: %w", err)
	}
	return nil
}

// Update updates an existing user details doc
func (r *UserDetailsRepository) Update(details *UserDetails) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": details.ID}
	update := bson.M{"$set": details}
	_, err := r.Collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return fmt.Errorf("failed to update user details: %w", err)
	}
	return nil
}

// GetBySlug is used for public access by slug
// We'll need to cross-reference from the 'users' collection. We'll do that in service or handler.
