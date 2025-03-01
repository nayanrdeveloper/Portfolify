package achievements

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

type AchievementRepository struct {
	Collection *mongo.Collection
}

func NewAchievementRepository() *AchievementRepository {
	// We'll store them in "achievements" collection
	return &AchievementRepository{
		Collection: config.GetCollection("achievements"),
	}
}

// Create inserts a new Achievement document
func (r *AchievementRepository) Create(ach *Achievement) (*Achievement, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	ach.ID = primitive.NewObjectID()
	ach.CreatedAt = time.Now()
	ach.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, ach)
	if err != nil {
		logger.Log.Error("Failed to create achievement", zap.Error(err))
		return nil, fmt.Errorf("failed to create achievement: %w", err)
	}
	return ach, nil
}

// GetByID fetches a single achievement by ID
func (r *AchievementRepository) GetByID(id string) (*Achievement, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid achievement ID: %w", err)
	}

	var ach Achievement
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&ach); err != nil {
		return nil, fmt.Errorf("achievement not found: %w", err)
	}
	return &ach, nil
}

// Update modifies existing fields of an achievement
func (r *AchievementRepository) Update(id string, updateData bson.M) (*Achievement, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid achievement ID: %w", err)
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update achievement: %w", err)
	}

	return r.GetByID(id)
}

// Delete removes an achievement
func (r *AchievementRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid achievement ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete achievement: %w", err)
	}
	return nil
}

// GetByUserID fetches all achievements for a given user
func (r *AchievementRepository) GetByUserID(userID primitive.ObjectID) ([]*Achievement, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID}
	cursor, err := r.Collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to find achievements: %w", err)
	}
	defer cursor.Close(ctx)

	var achs []*Achievement
	for cursor.Next(ctx) {
		var a Achievement
		if err := cursor.Decode(&a); err != nil {
			return nil, fmt.Errorf("failed to decode achievement: %w", err)
		}
		achs = append(achs, &a)
	}
	return achs, nil
}
