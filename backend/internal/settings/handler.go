package settings

import (
	"net/http"

	"portfolify/internal/users"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SettingsHandler struct {
	service     *SettingsService
	UserService *users.UserService
}

func NewSettingsHandler(service *SettingsService, userService *users.UserService) *SettingsHandler {
	return &SettingsHandler{service: service, UserService: userService}
}

func (h *SettingsHandler) UpdateUserSettings(c *gin.Context) {
	userIDStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId", err)
		return
	}

	var input UserSettingsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid input", err)
		return
	}

	settings, err := h.service.UpdateSettings(userObjID, &input)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update settings", err)
		return
	}

	responses.SendUpdated(c, "Settings updated successfully", settings)
}

func (h *SettingsHandler) GetUserSettings(c *gin.Context) {
	userIDStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId", err)
		return
	}

	settings, err := h.service.GetUserSettings(userObjID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Settings not found", err)
		return
	}

	responses.SendSuccess(c, "Settings retrieved successfully", settings)
}

// GetSettingsBySlug - GET /api/settings/user/:slug (Public)
func (h *SettingsHandler) GetSettingsBySlug(c *gin.Context) {
	slug := c.Param("slug")

	// Fetch the user by slug
	user, err := h.UserService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found", err)
		return
	}

	// Fetch settings by user ID
	settings, err := h.service.GetByUserID(user.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to retrieve settings", err)
		return
	}

	if settings == nil {
		responses.SendSuccess(c, "User settings retrieved successfully", gin.H{
			"template": "default", // Provide a sensible default theme
		})
		return
	}

	// ✅ Return existing settings
	responses.SendSuccess(c, "User settings retrieved successfully", gin.H{
		"template": settings.Template,
	})
}
