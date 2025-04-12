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
	userService *users.UserService // for slug-based lookups
}

func NewSocialMediaHandler(svc *SocialMediaService, userSvc *users.UserService) *SocialMediaHandler {
	return &SocialMediaHandler{
		service:     svc,
		userService: userSvc,
	}
}

// CreateSocialMedia - POST /api/socialmedia
// The user must be authenticated and must not already have a doc
func (h *SocialMediaHandler) CreateSocialMedia(c *gin.Context) {
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userIdStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId token", err)
		return
	}

	var input SocialMediaInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid social media data", err)
		return
	}

	doc, err := h.service.Create(userObjID, &input)
	if err != nil {
		logger.Log.Error("Failed to create social media doc", zap.Error(err))
		responses.SendError(c, http.StatusConflict, err.Error(), err)
		return
	}

	responses.SendCreated(c, "Social media doc created successfully", doc)
}

// UpdateSocialMedia - PUT /api/socialmedia
// We only have one doc per user, so no ID needed in route. We'll just do userID-based
func (h *SocialMediaHandler) UpdateSocialMedia(c *gin.Context) {
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userIdStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId", err)
		return
	}

	var updateData map[string]interface{}
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid update data", err)
		return
	}

	updatedDoc, err := h.service.Update(userObjID, updateData)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update doc", err)
		return
	}
	responses.SendUpdated(c, "Social media doc updated successfully", updatedDoc)
}

// GetSocialMedia - GET /api/socialmedia/user/:slug
// Public endpoint so visitors can see the user’s social links
func (h *SocialMediaHandler) GetSocialMedia(c *gin.Context) {
	slug := c.Param("slug")

	// find user by slug
	owner, err := h.userService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	doc, err := h.service.GetByUserID(owner.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to retrieve social links", err)
		return
	}
	// If doc is nil, means user hasn't set them yet
	if doc == nil {
		responses.SendSuccess(c, "No social media doc set", nil)
		return
	}

	responses.SendSuccess(c, "Social media retrieved", doc)
}

// DeleteSocialMedia - DELETE /api/socialmedia
// Let the user remove their doc if they want
func (h *SocialMediaHandler) DeleteSocialMedia(c *gin.Context) {
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userIdStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId", err)
		return
	}

	// remove doc
	if err := h.service.Delete(userObjID); err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete doc", err)
		return
	}
	responses.SendDeleted(c, "Social media doc deleted successfully")
}
