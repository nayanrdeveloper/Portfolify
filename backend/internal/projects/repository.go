package projects

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

type ProjectRepository struct {
	Collection *mongo.Collection
}

func NewProjectRepository() *ProjectRepository {
	return &ProjectRepository{
		Collection: config.GetCollection("projects"), // reuse config.GetCollection
	}
}

func (r *ProjectRepository) CreateProject(project *Project) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	project.ID = primitive.NewObjectID()
	project.CreatedAt = time.Now()
	project.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, project)
	if err != nil {
		wrappedErr := fmt.Errorf("failed to create project: %w", err)
		logger.Log.Error("Failed to create project", zap.Error(wrappedErr))
		return nil, wrappedErr
	}
	logger.Log.Info("Project created", zap.String("id", project.ID.Hex()))
	return project, nil
}

func (r *ProjectRepository) GetProjectByID(id string) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid project ID format: %w", err)
	}

	var project Project
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&project); err != nil {
		return nil, fmt.Errorf("project not found: %w", err)
	}
	return &project, nil
}

func (r *ProjectRepository) GetProjectsByUserID(userID primitive.ObjectID) ([]*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.Collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, fmt.Errorf("failed to find projects: %w", err)
	}
	defer cursor.Close(ctx)

	var projects []*Project
	for cursor.Next(ctx) {
		var p Project
		if err := cursor.Decode(&p); err != nil {
			return nil, fmt.Errorf("failed to decode project: %w", err)
		}
		projects = append(projects, &p)
	}
	return projects, nil
}

func (r *ProjectRepository) UpdateProject(id string, updateData bson.M) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid project ID format: %w", err)
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update project: %w", err)
	}
	// Return the updated project
	return r.GetProjectByID(id)
}

func (r *ProjectRepository) DeleteProject(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid project ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete project: %w", err)
	}
	return nil
}
