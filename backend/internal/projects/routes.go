package projects

import (
	"github.com/gin-gonic/gin"
)

func RegisterProjectRoutes(router *gin.RouterGroup, handler *ProjectHandler) {
	projectRoutes := router.Group("/projects")
	{
		projectRoutes.POST("/", handler.CreateProject)
		projectRoutes.GET("/:id", handler.GetProjectByID)
		projectRoutes.PUT("/:id", handler.UpdateProject)
		projectRoutes.DELETE("/:id", handler.DeleteProject)
	}
}
