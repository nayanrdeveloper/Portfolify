package categories

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterCategoryRoutes(rg *gin.RouterGroup, handler *CategoryHandler) {
	catRoutes := rg.Group("/categories")

	// Public route for GET
	catRoutes.GET("/", handler.GetAllCategories)

	// Protected routes
	catRoutes.Use(middleware.AuthRequired())
	{
		catRoutes.POST("/", handler.CreateCategory)
		catRoutes.PUT("/:id", handler.UpdateCategory)
		catRoutes.DELETE("/:id", handler.DeleteCategory)
	}
}
