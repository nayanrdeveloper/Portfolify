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
		Collection: config.GetCollection("projects"),
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

	logger.Log.Info("Project successfully created", zap.String("id", project.ID.Hex()))
	return project, nil
}

func (r *ProjectRepository) GetProjectByID(id string) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		wrappedErr := fmt.Errorf("invalid project ID format: %w", err)
		logger.Log.Warn("Invalid project ID format", zap.String("id", id))
		return nil, wrappedErr
	}

	var project Project
	err = r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&project)
	if err != nil {
		wrappedErr := fmt.Errorf("project not found: %w", err)
		logger.Log.Warn("Project not found", zap.String("id", id))
		return nil, wrappedErr
	}

	logger.Log.Info("Project successfully retrieved", zap.String("id", id))
	return &project, nil
}

func (r *ProjectRepository) UpdateProject(id string, updateData bson.M) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		wrappedErr := fmt.Errorf("invalid project ID format: %w", err)
		logger.Log.Warn("Invalid project ID format", zap.String("id", id))
		return nil, wrappedErr
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		wrappedErr := fmt.Errorf("failed to update project: %w", err)
		logger.Log.Error("Failed to update project", zap.String("id", id), zap.Error(wrappedErr))
		return nil, wrappedErr
	}

	logger.Log.Info("Project successfully updated", zap.String("id", id))
	return r.GetProjectByID(id)
}

func (r *ProjectRepository) DeleteProject(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		wrappedErr := fmt.Errorf("invalid project ID format: %w", err)
		logger.Log.Warn("Invalid project ID format", zap.String("id", id))
		return wrappedErr
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		wrappedErr := fmt.Errorf("failed to delete project: %w", err)
		logger.Log.Error("Failed to delete project", zap.String("id", id), zap.Error(wrappedErr))
		return wrappedErr
	}

	logger.Log.Info("Project successfully deleted", zap.String("id", id))
	return nil
}
