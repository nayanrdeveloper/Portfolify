package projects

import (
	"net/http"

	"portfolify/pkg/logger"

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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	createdProject, err := h.Service.CreateProject(&project)
	if err != nil {
		logger.Log.Error("Failed to create project", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create project", "details": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Project created successfully", "data": createdProject})
}

func (h *ProjectHandler) GetProjectByID(c *gin.Context) {
	id := c.Param("id")

	project, err := h.Service.GetProjectByID(id)
	if err != nil {
		logger.Log.Error("Project not found", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project retrieved successfully", "data": project})
}

func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	id := c.Param("id")
	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		logger.Log.Error("Invalid request body", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body", "details": err.Error()})
		return
	}

	updatedProject, err := h.Service.UpdateProject(id, updateData)
	if err != nil {
		logger.Log.Error("Failed to update project", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update project", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Project updated successfully", "data": updatedProject})
}

func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	id := c.Param("id")
	if err := h.Service.DeleteProject(id); err != nil {
		logger.Log.Error("Failed to delete project", zap.String("id", id), zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete project", "details": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Project deleted successfully"})
}
