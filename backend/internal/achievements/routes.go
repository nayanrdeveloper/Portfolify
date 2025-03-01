package achievements

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterAchievementRoutes(rg *gin.RouterGroup, handler *AchievementHandler) {
	achievementRoutes := rg.Group("/achievements")

	// Public endpoints
	achievementRoutes.GET("/user/:slug", handler.GetAchievementsBySlug)
	achievementRoutes.GET("/:id", handler.GetAchievementByID)

	// Protected endpoints (must be logged in)
	achievementRoutes.Use(middleware.AuthRequired())
	{
		achievementRoutes.POST("/", handler.CreateAchievement)
		achievementRoutes.PUT("/:id", handler.UpdateAchievement)
		achievementRoutes.DELETE("/:id", handler.DeleteAchievement)
	}
}
