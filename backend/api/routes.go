package api

import (
	"portfolify/internal/education"
	"portfolify/internal/experience"
	"portfolify/internal/projects"
	"portfolify/internal/uploads"
	"portfolify/internal/userdetails"
	"portfolify/internal/users"
	"portfolify/pkg/cloudinary"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(router *gin.Engine, cm *cloudinary.CloudinaryManager) {
	apiGroup := router.Group("/api")

	userRepo := users.NewUserRepository()
	userService := users.NewUserService(userRepo)
	userHandler := users.NewUserHandler(userService)
	users.RegisterUserRoutes(apiGroup, userHandler)

	uploadService := uploads.NewUploadService(cm)
	uploadHandler := uploads.NewUploadHandler(uploadService)
	uploads.RegisterUploadRoutes(apiGroup, uploadHandler)

	userDetailsRepo := userdetails.NewUserDetailsRepository()
	userDetailsService := userdetails.NewUserDetailsService(userDetailsRepo, userService)
	userDetailsHandler := userdetails.NewUserDetailsHandler(userDetailsService)
	userdetails.RegisterUserDetailsRoutes(apiGroup, userDetailsHandler)

	projectRepo := projects.NewProjectRepository()
	projectService := projects.NewProjectService(projectRepo)
	projectHandler := projects.NewProjectHandler(projectService, userService)
	projects.RegisterProjectRoutes(apiGroup, projectHandler)

	expRepo := experience.NewExperienceRepository()
	expService := experience.NewExperienceService(expRepo)
	expHandler := experience.NewExperienceHandler(expService, userService)
	experience.RegisterExperienceRoutes(apiGroup, expHandler)

	eduRepo := education.NewEducationRepository()
	eduService := education.NewEducationService(eduRepo)
	eduHandler := education.NewEducationHandler(eduService, userService)
	education.RegisterEducationRoutes(apiGroup, eduHandler)
}
