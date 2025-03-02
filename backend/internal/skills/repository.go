package skills

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

type SkillRepository struct {
	Collection *mongo.Collection
}

func NewSkillRepository() *SkillRepository {
	return &SkillRepository{
		Collection: config.GetCollection("skills"), // Store in "skills" collection
	}
}

func (r *SkillRepository) Create(skill *Skill) (*Skill, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	skill.ID = primitive.NewObjectID()
	skill.CreatedAt = time.Now()
	skill.UpdatedAt = time.Now()

	_, err := r.Collection.InsertOne(ctx, skill)
	if err != nil {
		logger.Log.Error("Failed to create skill", zap.Error(err))
		return nil, fmt.Errorf("failed to create skill: %w", err)
	}
	return skill, nil
}

func (r *SkillRepository) GetByID(id string) (*Skill, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid skill ID format: %w", err)
	}

	var skill Skill
	if err := r.Collection.FindOne(ctx, bson.M{"_id": objID}).Decode(&skill); err != nil {
		return nil, fmt.Errorf("skill not found: %w", err)
	}
	return &skill, nil
}

func (r *SkillRepository) Update(id string, updateData bson.M) (*Skill, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, fmt.Errorf("invalid skill ID: %w", err)
	}

	updateData["updated_at"] = time.Now()
	update := bson.M{"$set": updateData}

	_, err = r.Collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update skill: %w", err)
	}

	return r.GetByID(id)
}

func (r *SkillRepository) Delete(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("invalid skill ID: %w", err)
	}

	_, err = r.Collection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		return fmt.Errorf("failed to delete skill: %w", err)
	}
	return nil
}

func (r *SkillRepository) GetByUserID(userID primitive.ObjectID) ([]*Skill, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := r.Collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, fmt.Errorf("failed to find skills: %w", err)
	}
	defer cursor.Close(ctx)

	var skills []*Skill
	for cursor.Next(ctx) {
		var s Skill
		if err := cursor.Decode(&s); err != nil {
			return nil, fmt.Errorf("failed to decode skill: %w", err)
		}
		skills = append(skills, &s)
	}
	return skills, nil
}
