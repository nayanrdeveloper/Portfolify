package api

import (
	"portfolify/internal/achievements"
	"portfolify/internal/categories"
	"portfolify/internal/contactus"
	"portfolify/internal/education"
	"portfolify/internal/experience"
	"portfolify/internal/projects"
	"portfolify/internal/settings"
	"portfolify/internal/skills"
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

	settingsRepo := settings.NewSettingsRepository()
	settingsService := settings.NewSettingsService(settingsRepo)
	settingsHandler := settings.NewSettingsHandler(settingsService, userService)
	settings.RegisterSettingsRoutes(apiGroup, settingsHandler)

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

	achRepo := achievements.NewAchievementRepository()
	achService := achievements.NewAchievementService(achRepo)
	achHandler := achievements.NewAchievementHandler(achService, userService)
	achievements.RegisterAchievementRoutes(apiGroup, achHandler)

	catRepo := categories.NewCategoryRepository()
	catService := categories.NewCategoryService(catRepo)
	catHandler := categories.NewCategoryHandler(catService)
	categories.RegisterCategoryRoutes(apiGroup, catHandler)

	skillRepo := skills.NewSkillRepository()
	skillService := skills.NewSkillService(skillRepo)
	skillHandler := skills.NewSkillHandler(skillService, userService, catService)
	skills.RegisterSkillRoutes(apiGroup, skillHandler)


	contactRepo := contactus.NewContactUsRepository()
    contactService := contactus.NewContactUsService(contactRepo)
    contactHandler := contactus.NewContactUsHandler(contactService, userService)
    contactus.RegisterContactUsRoutes(apiGroup, contactHandler)
}
