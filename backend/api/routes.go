package api

import (
	"portfolify/internal/projects"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	apiGroup := router.Group("/api")

	projectRepo := projects.NewProjectRepository()
	projectService := projects.NewProjectService(projectRepo)
	projectHandler := projects.NewProjectHandler(projectService)
	projects.RegisterProjectRoutes(apiGroup, projectHandler)
}
