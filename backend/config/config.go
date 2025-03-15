package config

import (
	"os"
	"portfolify/pkg/logger"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func LoadEnv() {
	// Check if the .env file exists
	if _, err := os.Stat(".env"); os.IsNotExist(err) {
		logger.Log.Info(".env file not found; skipping load, using environment variables from the environment")
		return
	}

	err := godotenv.Load()
	if err != nil {
		logger.Log.Fatal("Error loading .env file", zap.Error(err))
	}
}
