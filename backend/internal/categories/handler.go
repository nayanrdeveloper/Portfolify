package categories

import (
	"net/http"

	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.uber.org/zap"
)

type CategoryHandler struct {
	service *CategoryService
}

func NewCategoryHandler(s *CategoryService) *CategoryHandler {
	return &CategoryHandler{service: s}
}

// CreateCategory - POST /api/categories
// (Might be admin-only, so you could wrap with Auth + role check if needed)
func (h *CategoryHandler) CreateCategory(c *gin.Context) {
	var input CategoryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid category data", err)
		return
	}

	createdCat, err := h.service.Create(&input)
	if err != nil {
		logger.Log.Error("Failed to create category", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create category", err)
		return
	}

	responses.SendCreated(c, "Category created successfully", createdCat)
}

// GetAllCategories - GET /api/categories
func (h *CategoryHandler) GetAllCategories(c *gin.Context) {
	categories, err := h.service.GetAll()
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to fetch categories", err)
		return
	}

	responses.SendSuccess(c, "Categories retrieved", categories)
}

// UpdateCategory - PUT /api/categories/:id
func (h *CategoryHandler) UpdateCategory(c *gin.Context) {
	catID := c.Param("id")
	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid update data", err)
		return
	}

	updatedCat, err := h.service.Update(catID, updateData)
	if err != nil {
		logger.Log.Error("Failed to update category", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to update category", err)
		return
	}

	responses.SendUpdated(c, "Category updated successfully", updatedCat)
}

// DeleteCategory - DELETE /api/categories/:id
func (h *CategoryHandler) DeleteCategory(c *gin.Context) {
	catID := c.Param("id")

	if err := h.service.Delete(catID); err != nil {
		logger.Log.Error("Failed to delete category", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete category", err)
		return
	}

	responses.SendDeleted(c, "Category deleted successfully")
}
