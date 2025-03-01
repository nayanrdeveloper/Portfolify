package projects

import (
	"net/http"

	"portfolify/internal/users"
	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

type ProjectHandler struct {
	Service     *ProjectService
	UserService *users.UserService
}

func NewProjectHandler(service *ProjectService, userService *users.UserService) *ProjectHandler {
	return &ProjectHandler{Service: service, UserService: userService}
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {
	userId, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	var project Project
	if err := c.ShouldBindJSON(&project); err != nil {
		logger.Log.Error("Invalid project data", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	// Convert string -> ObjectID
	objID, err := primitive.ObjectIDFromHex(userId.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId in token", err)
		return
	}

	project.UserID = objID

	created, err := h.Service.CreateProject(&project)
	if err != nil {
		logger.Log.Error("Failed to create project", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create project", err)
		return
	}

	responses.SendCreated(c, "Project created successfully", created)
}

func (h *ProjectHandler) GetProjectByID(c *gin.Context) {
	id := c.Param("id")

	project, err := h.Service.GetProjectByID(id)
	if err != nil {
		logger.Log.Error("Project not found", zap.String("id", id), zap.Error(err))
		responses.SendError(c, http.StatusNotFound, "Project not found", err)
		return
	}

	responses.SendSuccess(c, "Project retrieved successfully", project)
}

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	id := c.Param("id")

	userId, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Ensure the project belongs to this user
	project, err := h.Service.GetProjectByID(id)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Project not found", err)
		return
	}
	if project.UserID.Hex() != userId.(string) {
		responses.SendError(c, http.StatusForbidden, "You are not allowed to update this project", nil)
		return
	}

	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	updated, err := h.Service.UpdateProject(id, updateData)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update project", err)
		return
	}

	responses.SendUpdated(c, "Project updated successfully", updated)
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")

	userId, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Ensure the project belongs to this user
	project, err := h.Service.GetProjectByID(id)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Project not found", err)
		return
	}
	if project.UserID.Hex() != userId.(string) {
		responses.SendError(c, http.StatusForbidden, "You are not allowed to delete this project", nil)
		return
	}

	if err := h.Service.DeleteProject(id); err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete project", err)
		return
	}

	responses.SendDeleted(c, "Project deleted successfully")
}

func (h *ProjectHandler) GetProjectsBySlug(c *gin.Context) {
	slug := c.Param("slug")

	// 1. Look up the user by their slug
	user, err := h.UserService.GetUserBySlug(slug)
	if err != nil {
		logger.Log.Error("User not found by slug", zap.String("slug", slug), zap.Error(err))
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	// 2. Use the user's ID to fetch all projects
	projects, err := h.Service.GetProjectsByUserID(user.ID)
	if err != nil {
		logger.Log.Error("Failed to get projects by user slug", zap.String("slug", slug), zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to get projects", err)
		return
	}

	responses.SendSuccess(c, "Projects retrieved successfully", projects)
}
