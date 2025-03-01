package experience

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

type ExperienceHandler struct {
	service     *ExperienceService
	userService *users.UserService // for slug -> user lookups
}

func NewExperienceHandler(service *ExperienceService, userService *users.UserService) *ExperienceHandler {
	return &ExperienceHandler{
		service:     service,
		userService: userService,
	}
}

// CreateExperience - POST /api/experiences
func (h *ExperienceHandler) CreateExperience(c *gin.Context) {
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

	var input ExperienceInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid experience data", err)
		return
	}

	createdExp, err := h.service.Create(objID, &input)
	if err != nil {
		logger.Log.Error("Failed to create experience", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create experience", err)
		return
	}

	responses.SendCreated(c, "Experience created successfully", createdExp)
}

// GetExperienceByID - GET /api/experiences/:id
func (h *ExperienceHandler) GetExperienceByID(c *gin.Context) {
	expID := c.Param("id")

	exp, err := h.service.GetByID(expID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Experience not found", err)
		return
	}

	responses.SendSuccess(c, "Experience retrieved successfully", exp)
}

// UpdateExperience - PUT /api/experiences/:id
func (h *ExperienceHandler) UpdateExperience(c *gin.Context) {
	expID := c.Param("id")

	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Check if experience belongs to user
	exp, err := h.service.GetByID(expID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Experience not found", err)
		return
	}
	if exp.UserID.Hex() != userIdStr.(string) {
		responses.SendError(c, http.StatusForbidden, "Not allowed to update this experience", nil)
		return
	}

	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid update data", err)
		return
	}

	updatedExp, err := h.service.Update(expID, updateData)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update experience", err)
		return
	}
	responses.SendUpdated(c, "Experience updated successfully", updatedExp)
}

// DeleteExperience - DELETE /api/experiences/:id
func (h *ExperienceHandler) DeleteExperience(c *gin.Context) {
	expID := c.Param("id")

	// Must be authenticated
	userIdStr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	exp, err := h.service.GetByID(expID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Experience not found", err)
		return
	}
	if exp.UserID.Hex() != userIdStr.(string) {
		responses.SendError(c, http.StatusForbidden, "Not allowed to delete this experience", nil)
		return
	}

	if err := h.service.Delete(expID); err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete experience", err)
		return
	}
	responses.SendDeleted(c, "Experience deleted successfully")
}

// GetExperiencesBySlug - GET /api/experiences/user/:slug (public)
func (h *ExperienceHandler) GetExperiencesBySlug(c *gin.Context) {
	slug := c.Param("slug")

	// Look up user by slug
	user, err := h.userService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	exps, err := h.service.GetByUserID(user.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to fetch experiences", err)
		return
	}

	responses.SendSuccess(c, "Experiences retrieved successfully", exps)
}
