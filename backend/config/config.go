package config

import (
	"portfolify/pkg/logger"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
)

func LoadEnv() {
	err := godotenv.Load()
	if err != nil {
		logger.Log.Fatal("Error loading .env file", zap.Error(err))
	}
}
