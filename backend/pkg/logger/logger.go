package logger

import (
	"os"

	"go.uber.org/zap"
)

var Log *zap.Logger

func InitLogger() {
	var err error

	if os.Getenv("ENV") == "production" {
		Log, err = zap.NewProduction()
	} else {
		Log, err = zap.NewDevelopment()
	}

	if err != nil {
		panic("Failed to initialize logger: " + err.Error())
	}

	Log.Info("Logger initialized successfully!")
}
