package settings

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterSettingsRoutes(rg *gin.RouterGroup, handler *SettingsHandler) {
	settingsRoutes := rg.Group("/settings")

	// Public route (fetch user settings by slug)
	settingsRoutes.GET("/user/:slug", handler.GetSettingsBySlug)

	// Protected route (fetch/update settings for the logged-in user)
	settingsRoutes.Use(middleware.AuthRequired())
	{
		settingsRoutes.GET("/", handler.GetUserSettings)
		settingsRoutes.PUT("/", handler.UpdateUserSettings)
	}
}
