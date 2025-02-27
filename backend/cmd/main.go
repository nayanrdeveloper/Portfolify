package main

import (
	"net/http"

	"portfolify/api"
	"portfolify/config"
	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// Load environment variables.
	config.LoadEnv()

	// Initialize production logger.
	logger.InitLogger()
	defer logger.Log.Sync()

	// Connect to MongoDB.
	config.ConnectDB()

	// Initialize Gin router.
	router := gin.Default()

	// Register API routes.
	api.RegisterRoutes(router)

	// Handle unmatched routes with a standardized error response.
	router.NoRoute(func(c *gin.Context) {
		responses.SendError(c, http.StatusNotFound, "Route not found", nil)
	})

	// Start the server on port 8080.
	if err := router.Run(":8080"); err != nil {
		logger.Log.Fatal("Failed to run server", zap.Error(err))
	}
}
