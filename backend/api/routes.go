package api

import (
	"portfolify/internal/projects"
	"portfolify/internal/users"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	apiGroup := router.Group("/api")

	userRepo := users.NewUserRepository()
	userService := users.NewUserService(userRepo)
	userHandler := users.NewUserHandler(userService)
	users.RegisterUserRoutes(apiGroup, userHandler)

	projectRepo := projects.NewProjectRepository()
	projectService := projects.NewProjectService(projectRepo)
	projectHandler := projects.NewProjectHandler(projectService, userService)
	projects.RegisterProjectRoutes(apiGroup, projectHandler)
}
