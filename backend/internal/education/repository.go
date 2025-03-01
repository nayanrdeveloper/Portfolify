package education

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

type EducationRepository struct {
	Collection *mongo.Collection
}

func NewEducationRepository() *EducationRepository {
	return &EducationRepository{
		Collection: config.GetCollection("educations"),
		// "educations" is the collection name in MongoDB
	}
}

// Create inserts a new Education document
func (r *EducationRepository) Create(edu *Education) (*Education, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	edu.ID = primitive.NewObjectID()
	edu.CreatedAt = time.Now()
	edu.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, edu)
	if err != nil {
		logger.Log.Error("Failed to create education", zap.Error(err))
		return nil, fmt.Errorf("failed to create education: %w", err)
	}
	return edu, nil
}

// GetByID fetches a single education by its ID
func (r *EducationRepository) GetByID(id string) (*Education, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid education ID format: %w", err)
	}

	var edu Education
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&edu); err != nil {
		return nil, fmt.Errorf("education not found: %w", err)
	}
	return &edu, nil
}

// Update modifies existing fields of an education record
func (r *EducationRepository) Update(id string, updateData bson.M) (*Education, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid education ID: %w", err)
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update education: %w", err)
	}

	return r.GetByID(id)
}

// Delete removes an education document by ID
func (r *EducationRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid education ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete education: %w", err)
	}
	return nil
}

// GetByUserID fetches all education documents for a given user ID
func (r *EducationRepository) GetByUserID(userID primitive.ObjectID) ([]*Education, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"user_id": userID}
	cursor, err := r.Collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch educations: %w", err)
	}
	defer cursor.Close(ctx)

	var edus []*Education
	for cursor.Next(ctx) {
		var e Education
		if err := cursor.Decode(&e); err != nil {
			return nil, fmt.Errorf("failed to decode education: %w", err)
		}
		edus = append(edus, &e)
	}
	return edus, nil
}
