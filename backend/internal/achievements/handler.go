package achievements

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"

	"portfolify/internal/users"
	"portfolify/pkg/logger"
	"portfolify/pkg/responses"
)

type AchievementHandler struct {
	service     *AchievementService
	userService *users.UserService
}

func NewAchievementHandler(service *AchievementService, userService *users.UserService) *AchievementHandler {
	return &AchievementHandler{service: service, userService: userService}
}

// CreateAchievement - POST /api/achievements
func (h *AchievementHandler) CreateAchievement(c *gin.Context) {
	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	userObjID, err := primitive.ObjectIDFromHex(userIdStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId in token", err)
		return
	}

	var input AchievementInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid achievement data", err)
		return
	}

	createdAch, err := h.service.Create(userObjID, &input)
	if err != nil {
		logger.Log.Error("Failed to create achievement", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create achievement", err)
		return
	}

	responses.SendCreated(c, "Achievement created successfully", createdAch)
}

// GetAchievementByID - GET /api/achievements/:id
func (h *AchievementHandler) GetAchievementByID(c *gin.Context) {
	achID := c.Param("id")

	ach, err := h.service.GetByID(achID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Achievement not found", err)
		return
	}

	responses.SendSuccess(c, "Achievement retrieved successfully", ach)
}

// UpdateAchievement - PUT /api/achievements/:id
func (h *AchievementHandler) UpdateAchievement(c *gin.Context) {
	achID := c.Param("id")

	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	ach, err := h.service.GetByID(achID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Achievement not found", err)
		return
	}
	if ach.UserID.Hex() != userIdStr.(string) {
		responses.SendError(c, http.StatusForbidden, "You are not allowed to update this achievement", nil)
		return
	}

	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid update data", err)
		return
	}

	updatedAch, err := h.service.Update(achID, updateData)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update achievement", err)
		return
	}

	responses.SendUpdated(c, "Achievement updated successfully", updatedAch)
}

// DeleteAchievement - DELETE /api/achievements/:id
func (h *AchievementHandler) DeleteAchievement(c *gin.Context) {
	achID := c.Param("id")

	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	ach, err := h.service.GetByID(achID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Achievement not found", err)
		return
	}
	if ach.UserID.Hex() != userIdStr.(string) {
		responses.SendError(c, http.StatusForbidden, "You are not allowed to delete this achievement", nil)
		return
	}

	if err := h.service.Delete(achID); err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete achievement", err)
		return
	}
	responses.SendDeleted(c, "Achievement deleted successfully")
}

// GetAchievementsBySlug - GET /api/achievements/user/:slug (public)
func (h *AchievementHandler) GetAchievementsBySlug(c *gin.Context) {
	slug := c.Param("slug")

	// 1) find user by slug
	user, err := h.userService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	// 2) fetch achievements by user ID
	achs, err := h.service.GetByUserID(user.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to get achievements", err)
		return
	}

	responses.SendSuccess(c, "Achievements retrieved successfully", achs)
}
