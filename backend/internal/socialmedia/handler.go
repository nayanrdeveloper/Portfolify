package socialmedia

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"

	"portfolify/internal/users"
	"portfolify/pkg/logger"
	"portfolify/pkg/responses"
)

type SocialMediaHandler struct {
	service     *SocialMediaService
	userService *users.UserService
}

func NewSocialMediaHandler(svc *SocialMediaService, userSvc *users.UserService) *SocialMediaHandler {
	return &SocialMediaHandler{
		service:     svc,
		userService: userSvc,
	}
}

// GetSocialMediaBySlug - GET /api/socialmedia/user/:slug (public)
func (h *SocialMediaHandler) GetSocialMediaBySlug(c *gin.Context) {
	slug := c.Param("slug")

	// 1) find user
	user, err := h.userService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	// 2) get doc
	doc, err := h.service.GetByUserID(user.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to fetch social media links", err)
		return
	}
	if doc == nil {
		// no doc
		responses.SendSuccess(c, "No social media links set", nil)
		return
	}

	responses.SendSuccess(c, "Social media links retrieved", doc)
}

// UpdateSocialMedia - PUT /api/socialmedia (protected)
func (h *SocialMediaHandler) UpdateSocialMedia(c *gin.Context) {
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

	var input SocialMediaUpdate
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid JSON data", err)
		return
	}

	updated, err := h.service.Upsert(userObjID, &input)
	if err != nil {
		logger.Log.Error("Failed to upsert social media doc", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, err.Error(), err)
		return
	}

	responses.SendUpdated(c, "Social media links updated successfully", updated)
}
