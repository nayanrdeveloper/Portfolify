package categories

import "github.com/gin-gonic/gin"

func RegisterCategoryRoutes(rg *gin.RouterGroup, handler *CategoryHandler) {
	catRoutes := rg.Group("/categories")

	// If you want these endpoints to be fully public or admin-protected, adjust accordingly
	catRoutes.POST("/", handler.CreateCategory)
	catRoutes.GET("/", handler.GetAllCategories)
	catRoutes.PUT("/:id", handler.UpdateCategory)
	catRoutes.DELETE("/:id", handler.DeleteCategory)
}
