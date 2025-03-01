package userdetails

import (
	"net/http"

	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

type UserDetailsHandler struct {
	service *UserDetailsService
}

func NewUserDetailsHandler(s *UserDetailsService) *UserDetailsHandler {
	return &UserDetailsHandler{service: s}
}

// GetMyDetails - GET /api/user-details/me
// Requires Auth token
func (h *UserDetailsHandler) GetMyDetails(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userId.(string))
	if err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid userId in token", err)
		return
	}

	details, err := h.service.GetByUserID(objID)
	if err != nil {
		logger.Log.Error("Failed to get user details", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to get user details", err)
		return
	}

	if details == nil {
		// Possibly return empty doc or create new automatically
		responses.SendSuccess(c, "No details found", gin.H{"details": nil})
		return
	}

	responses.SendSuccess(c, "User details retrieved", details)
}

// UpdateMyDetails - POST or PATCH /api/user-details
// Requires Auth token
func (h *UserDetailsHandler) UpdateMyDetails(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userId.(string))
	if err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid userId in token", err)
		return
	}

	var input UserDetailsInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	details, err := h.service.CreateOrUpdate(objID, &input)
	if err != nil {
		logger.Log.Error("Failed to update user details", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to update user details", err)
		return
	}

	responses.SendSuccess(c, "User details updated", details)
}

// GetBySlug - GET /api/user-details/slug/:slug (public)
func (h *UserDetailsHandler) GetBySlug(c *gin.Context) {
	slug := c.Param("slug")

	details, err := h.service.GetBySlug(slug)
	if err != nil {
		logger.Log.Error("User details by slug not found", zap.String("slug", slug), zap.Error(err))
		responses.SendError(c, http.StatusNotFound, "User details not found by slug", err)
		return
	}

	// If details is nil, user has no doc
	if details == nil {
		responses.SendSuccess(c, "No user details found for slug", gin.H{"details": nil})
		return
	}

	responses.SendSuccess(c, "User details retrieved by slug", details)
}
