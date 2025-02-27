package projects

import (
	"context"
	"errors"
	"portfolify/config"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
		return nil, err
	}

	return project, nil
}

func (r *ProjectRepository) GetProjectByID(id string) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid project ID format")
	}

	var project Project
	err = r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&project)
	if err != nil {
		return nil, err
	}

	return &project, nil
}

func (r *ProjectRepository) UpdateProject(id string, updateData bson.M) (*Project, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, errors.New("invalid project ID format")
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, err
	}

	return r.GetProjectByID(id)
}

func (r *ProjectRepository) DeleteProject(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return errors.New("invalid project ID format")
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return err
	}

	return nil
}
