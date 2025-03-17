package settings

import (
	"context"
	"fmt"
	"time"

	"portfolify/config"
	"portfolify/pkg/logger"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

type SettingsRepository struct {
	Collection *mongo.Collection
}

func NewSettingsRepository() *SettingsRepository {
	return &SettingsRepository{
		Collection: config.GetCollection("user_settings"),
	}
}

func (r *SettingsRepository) Upsert(userID primitive.ObjectID, input *UserSettingsInput) (*UserSettings, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now()
	update := bson.M{
		"$set": bson.M{
			"user_id":    userID,
			"template":   input.Template,
			"updated_at": now,
		},
		"$setOnInsert": bson.M{
			"created_at": now,
		},
	}

	opts := options.FindOneAndUpdate().SetUpsert(true).SetReturnDocument(options.After)

	var result UserSettings
	err := r.Collection.FindOneAndUpdate(ctx, bson.M{"user_id": userID}, update, opts).Decode(&result)
	if err != nil {
		logger.Log.Error("Failed to upsert user settings", zap.Error(err))
		return nil, err
	}
	return &result, nil
}

// Fetch settings by user ID
func (r *SettingsRepository) GetByUserID(userID primitive.ObjectID) (*UserSettings, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var settings UserSettings
	err := r.Collection.FindOne(ctx, bson.M{"user_id": userID}).Decode(&settings)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil // No settings found
		}
		logger.Log.Error("Failed to get settings", zap.Error(err))
		return nil, fmt.Errorf("failed to get settings: %w", err)
	}
	return &settings, nil
}
