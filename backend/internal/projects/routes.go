package projects

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterProjectRoutes(router *gin.RouterGroup, handler *ProjectHandler) {
	projectRoutes := router.Group("/projects")

	projectRoutes.GET("/:id", handler.GetProjectByID)
	projectRoutes.GET("/user/:slug", handler.GetProjectsBySlug)
	projectRoutes.Use(middleware.AuthRequired())
	{
		projectRoutes.POST("/", handler.CreateProject)
		projectRoutes.PUT("/:id", handler.UpdateProject)
		projectRoutes.DELETE("/:id", handler.DeleteProject)
	}
}
