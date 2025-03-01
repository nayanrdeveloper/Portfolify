package education

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterEducationRoutes(rg *gin.RouterGroup, handler *EducationHandler) {
	eduRoutes := rg.Group("/educations")

	// Public
	eduRoutes.GET("/user/:slug", handler.GetEducationsBySlug)
	eduRoutes.GET("/:id", handler.GetEducationByID)

	// Protected
	eduRoutes.Use(middleware.AuthRequired())
	{
		eduRoutes.POST("/", handler.CreateEducation)
		eduRoutes.PUT("/:id", handler.UpdateEducation)
		eduRoutes.DELETE("/:id", handler.DeleteEducation)
	}
}
