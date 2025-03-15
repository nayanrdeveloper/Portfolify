package main

import (
	"net/http"

	"portfolify/api"
	"portfolify/config"
	"portfolify/pkg/cloudinary"
	"portfolify/pkg/logger"
	"portfolify/pkg/middleware"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

func main() {
	// Initialize production logger first
	logger.InitLogger()
	defer logger.Log.Sync()

	// Now load environment variables
	config.LoadEnv()

	// Connect to MongoDB.
	config.ConnectDB()

	// Initialize Cloudinary manager.
	cm, err := cloudinary.NewCloudinaryManager()
	if err != nil {
		logger.Log.Fatal("Failed to initialize Cloudinary", zap.Error(err))
	}

	// Initialize Gin router.
	router := gin.Default()

	allowedOrigins := []string{"http://localhost:3000"}
	router.Use(middleware.CORSMiddleware(allowedOrigins))

	// Register API routes.
	api.RegisterRoutes(router, cm)

	// Handle unmatched routes with a standardized error response.
	router.NoRoute(func(c *gin.Context) {
		responses.SendError(c, http.StatusNotFound, "Route not found", nil)
	})

	// Start the server on port 8080.
	if err := router.Run(":8080"); err != nil {
		logger.Log.Fatal("Failed to run server", zap.Error(err))
	}
}
