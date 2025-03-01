// internal/experience/routes.go
package experience

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterExperienceRoutes(rg *gin.RouterGroup, handler *ExperienceHandler) {
	expRoutes := rg.Group("/experiences")

	// Public
	expRoutes.GET("/user/:slug", handler.GetExperiencesBySlug)
	expRoutes.GET("/:id", handler.GetExperienceByID)

	// Protected
	expRoutes.Use(middleware.AuthRequired())
	{
		expRoutes.POST("/", handler.CreateExperience)
		expRoutes.PUT("/:id", handler.UpdateExperience)
		expRoutes.DELETE("/:id", handler.DeleteExperience)
	}
}
