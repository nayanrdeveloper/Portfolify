package projects

import (
	"net/http"

	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.uber.org/zap"
)

type ProjectHandler struct {
	Service *ProjectService
}

func NewProjectHandler(service *ProjectService) *ProjectHandler {
	return &ProjectHandler{Service: service}
}

func (h *ProjectHandler) CreateProject(c *gin.Context) {
	var project Project
	if err := c.ShouldBindJSON(&project); err != nil {
		logger.Log.Error("Invalid request body", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	createdProject, err := h.Service.CreateProject(&project)
	if err != nil {
		logger.Log.Error("Failed to create project", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create project", err)
		return
	}

	responses.SendCreated(c, "Project created successfully", createdProject)
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
	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		logger.Log.Error("Invalid request body", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	updatedProject, err := h.Service.UpdateProject(id, updateData)
	if err != nil {
		logger.Log.Error("Failed to update project", zap.String("id", id), zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to update project", err)
		return
	}

	responses.SendUpdated(c, "Project updated successfully", updatedProject)
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")
	if err := h.Service.DeleteProject(id); err != nil {
		logger.Log.Error("Failed to delete project", zap.String("id", id), zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete project", err)
		return
	}
	responses.SendDeleted(c, "Project deleted successfully")
}
