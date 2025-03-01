package api

import (
	"portfolify/internal/projects"
	"portfolify/internal/userdetails"
	"portfolify/internal/users"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine) {
	apiGroup := router.Group("/api")

	userRepo := users.NewUserRepository()
	userService := users.NewUserService(userRepo)
	userHandler := users.NewUserHandler(userService)
	users.RegisterUserRoutes(apiGroup, userHandler)

	userDetailsRepo := userdetails.NewUserDetailsRepository()
	userDetailsService := userdetails.NewUserDetailsService(userDetailsRepo, userService)
	userDetailsHandler := userdetails.NewUserDetailsHandler(userDetailsService)
	userdetails.RegisterUserDetailsRoutes(apiGroup, userDetailsHandler)

	projectRepo := projects.NewProjectRepository()
	projectService := projects.NewProjectService(projectRepo)
	projectHandler := projects.NewProjectHandler(projectService, userService)
	projects.RegisterProjectRoutes(apiGroup, projectHandler)
}
