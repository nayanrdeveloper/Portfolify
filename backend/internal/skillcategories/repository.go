package categories

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

type CategoryRepository struct {
	Collection *mongo.Collection
}

func NewCategoryRepository() *CategoryRepository {
	return &CategoryRepository{
		Collection: config.GetCollection("skill_categories"),
		// "skill_categories" is the Mongo collection for categories
	}
}

func (r *CategoryRepository) Create(cat *Category) (*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cat.ID = primitive.NewObjectID()
	cat.CreatedAt = time.Now()
	cat.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, cat)
	if err != nil {
		logger.Log.Error("Failed to create category", zap.Error(err))
		return nil, fmt.Errorf("failed to create category: %w", err)
	}
	return cat, nil
}

func (r *CategoryRepository) GetByID(id string) (*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid category ID: %w", err)
	}

	var cat Category
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&cat); err != nil {
		return nil, fmt.Errorf("category not found: %w", err)
	}
	return &cat, nil
}

// Update modifies an existing Category
func (r *CategoryRepository) Update(id string, updateData bson.M) (*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid category ID: %w", err)
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update category: %w", err)
	}

	return r.GetByID(id)
}

// Delete removes a Category by ID
func (r *CategoryRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid category ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete category: %w", err)
	}
	return nil
}

// GetAll returns all categories (global)
func (r *CategoryRepository) GetAll() ([]*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to fetch categories: %w", err)
	}
	defer cursor.Close(ctx)

	var categories []*Category
	for cursor.Next(ctx) {
		var c Category
		if err := cursor.Decode(&c); err != nil {
			return nil, fmt.Errorf("failed to decode category: %w", err)
		}
		categories = append(categories, &c)
	}
	return categories, nil
}

func (r *CategoryRepository) GetByName(name string) (*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var cat Category
	err := r.Collection.FindOne(ctx, bson.M{"name": name}).Decode(&cat)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // no category found
		}
		return nil, fmt.Errorf("failed to get category by name: %w", err)
	}
	return &cat, nil
}

func (r *CategoryRepository) GetByIDs(categoryIDs []primitive.ObjectID) ([]*Category, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": bson.M{"$in": categoryIDs}}
	cursor, err := r.Collection.Find(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch categories: %w", err)
	}
	defer cursor.Close(ctx)

	var categories []*Category
	for cursor.Next(ctx) {
		var category Category
		if err := cursor.Decode(&category); err != nil {
			return nil, fmt.Errorf("failed to decode category: %w", err)
		}
		categories = append(categories, &category)
	}
	return categories, nil
}
