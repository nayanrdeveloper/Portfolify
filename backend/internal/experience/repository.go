package experience

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

type ExperienceRepository struct {
	Collection *mongo.Collection
}

func NewExperienceRepository() *ExperienceRepository {
	return &ExperienceRepository{
		Collection: config.GetCollection("experiences"),
	}
}

// Create inserts a new Experience document
func (r *ExperienceRepository) Create(exp *Experience) (*Experience, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	exp.ID = primitive.NewObjectID()
	exp.CreatedAt = time.Now()
	exp.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, exp)
	if err != nil {
		logger.Log.Error("Failed to create experience", zap.Error(err))
		return nil, fmt.Errorf("failed to create experience: %w", err)
	}
	return exp, nil
}

// GetByID fetches a single experience by its ID
func (r *ExperienceRepository) GetByID(id string) (*Experience, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid experience ID format: %w", err)
	}

	var exp Experience
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&exp); err != nil {
		return nil, fmt.Errorf("experience not found: %w", err)
	}
	return &exp, nil
}

// Update updates fields of an experience
func (r *ExperienceRepository) Update(id string, updateData bson.M) (*Experience, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid experience ID: %w", err)
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update experience: %w", err)
	}

	// Return the updated doc
	return r.GetByID(id)
}

// Delete removes an experience document by ID
func (r *ExperienceRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid experience ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete experience: %w", err)
	}
	return nil
}

// GetByUserID fetches all experiences for a given user ID
func (r *ExperienceRepository) GetByUserID(userID primitive.ObjectID) ([]*Experience, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID}
	cursor, err := r.Collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch experiences: %w", err)
	}
	defer cursor.Close(ctx)

	var exps []*Experience
	for cursor.Next(ctx) {
		var e Experience
		if err := cursor.Decode(&e); err != nil {
			return nil, fmt.Errorf("failed to decode experience: %w", err)
		}
		exps = append(exps, &e)
	}
	return exps, nil
}
