package education

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

type EducationHandler struct {
	service     *EducationService
	userService *users.UserService // for slug -> user lookups
}

func NewEducationHandler(service *EducationService, userService *users.UserService) *EducationHandler {
	return &EducationHandler{
		service:     service,
		userService: userService,
	}
}

// CreateEducation - POST /api/educations
func (h *EducationHandler) CreateEducation(c *gin.Context) {
	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	objID, err := primitive.ObjectIDFromHex(userIdStr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId in token", err)
		return
	}

	var input EducationInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid education data", err)
		return
	}

	createdEdu, err := h.service.Create(objID, &input)
	if err != nil {
		logger.Log.Error("Failed to create education", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create education", err)
		return
	}

	responses.SendCreated(c, "Education created successfully", createdEdu)
}

// GetEducationByID - GET /api/educations/:id
func (h *EducationHandler) GetEducationByID(c *gin.Context) {
	eduID := c.Param("id")

	edu, err := h.service.GetByID(eduID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Education not found", err)
		return
	}

	responses.SendSuccess(c, "Education retrieved successfully", edu)
}

// UpdateEducation - PUT /api/educations/:id
func (h *EducationHandler) UpdateEducation(c *gin.Context) {
	eduID := c.Param("id")

	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Check if education belongs to this user
	edu, err := h.service.GetByID(eduID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Education not found", err)
		return
	}
	if edu.UserID.Hex() != userIdStr.(string) {
		responses.SendError(c, http.StatusForbidden, "Not allowed to update this education", nil)
		return
	}

	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid update data", err)
		return
	}

	updatedEdu, err := h.service.Update(eduID, updateData)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update education", err)
		return
	}
	responses.SendUpdated(c, "Education updated successfully", updatedEdu)
}

// DeleteEducation - DELETE /api/educations/:id
func (h *EducationHandler) DeleteEducation(c *gin.Context) {
	eduID := c.Param("id")

	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	edu, err := h.service.GetByID(eduID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Education not found", err)
		return
	}
	if edu.UserID.Hex() != userIdStr.(string) {
		responses.SendError(c, http.StatusForbidden, "Not allowed to delete this education", nil)
		return
	}

	if err := h.service.Delete(eduID); err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete education", err)
		return
	}
	responses.SendDeleted(c, "Education deleted successfully")
}

// GetEducationsBySlug - GET /api/educations/user/:slug (public)
func (h *EducationHandler) GetEducationsBySlug(c *gin.Context) {
	slug := c.Param("slug")

	user, err := h.userService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	edus, err := h.service.GetByUserID(user.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to fetch education records", err)
		return
	}

	responses.SendSuccess(c, "Educations retrieved successfully", edus)
}
