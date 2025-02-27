package config

import (
	"context"
	"os"
	"time"

	"portfolify/pkg/logger"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

var DB *mongo.Database

func ConnectDB() {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		logger.Log.Fatal("MONGO_URI is not set in environment variables")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		logger.Log.Fatal("Could not connect to MongoDB", zap.Error(err))
	}

	if err := client.Ping(ctx, nil); err != nil {
		logger.Log.Fatal("Could not ping MongoDB", zap.Error(err))
	}

	DB = client.Database("portfolify")
	logger.Log.Info("Successfully connected to MongoDB!")
}

func GetCollection(collectionName string) *mongo.Collection {
	return DB.Collection(collectionName)
}
