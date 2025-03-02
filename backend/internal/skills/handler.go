package skills

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"

	categories "portfolify/internal/skillcategories"
	"portfolify/internal/users"
	"portfolify/pkg/logger"
	"portfolify/pkg/responses"
)

type SkillHandler struct {
	skillService    *SkillService
	userService     *users.UserService
	categoryService *categories.CategoryService
}

func NewSkillHandler(skillSrv *SkillService, userSrv *users.UserService, catSrv *categories.CategoryService) *SkillHandler {
	return &SkillHandler{
		skillService:    skillSrv,
		userService:     userSrv,
		categoryService: catSrv,
	}
}

// Input struct for the create skill request
type CreateSkillRequest struct {
	Name        string  `json:"name" binding:"required"`
	Proficiency string  `json:"proficiency,omitempty"`
	Years       float64 `json:"years,omitempty"`
	IconName    string  `json:"icon_name,omitempty"`
	IconURL     string  `json:"icon_url,omitempty"`
	Progress    int     `json:"progress"` // 0..100
	// The user passes category names, e.g. ["Programming","Backend"]
	CategoryNames []string `json:"category_names,omitempty"`
}

// Response struct if you want to return populated categories
type SkillWithCatNames struct {
	Skill         *Skill   `json:"skill"`
	CategoryNames []string `json:"category_names"`
}

// CreateSkill handles a single call that creates categories + skill
func (h *SkillHandler) CreateSkill(c *gin.Context) {
	// Must be authenticated
	userIDstr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}
	userObjID, err := primitive.ObjectIDFromHex(userIDstr.(string))
	if err != nil {
		responses.SendError(c, http.StatusUnauthorized, "Invalid userId in token", err)
		return
	}

	// 1. Bind JSON
	var req CreateSkillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid skill data", err)
		return
	}

	// 2. For each category name, get/create a category ID
	var catIDs []primitive.ObjectID
	for _, catName := range req.CategoryNames {
		// Trim whitespace or check if empty
		if catName == "" {
			continue
		}
		catID, err := h.categoryService.GetOrCreateCategory(catName)
		if err != nil {
			logger.Log.Error("Failed to get/create category", zap.String("catName", catName), zap.Error(err))
			responses.SendError(c, http.StatusInternalServerError, fmt.Sprintf("Failed to create category '%s'", catName), err)
			return
		}
		catIDs = append(catIDs, catID)
	}

	// 3. Construct skill
	skill := &Skill{
		UserID:      userObjID,
		Name:        req.Name,
		Proficiency: req.Proficiency,
		Years:       req.Years,
		IconName:    req.IconName,
		IconURL:     req.IconURL,
		Progress:    req.Progress,
		CategoryIDs: catIDs,
	}

	// 4. Create skill in DB
	createdSkill, err := h.skillService.CreateDirect(skill)
	// ^ "CreateDirect" would be a new service method that accepts a *Skill directly
	//   Or you can adapt your existing service method to accept an entire *Skill struct.

	if err != nil {
		logger.Log.Error("Failed to create skill", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to create skill", err)
		return
	}

	// 5. Build the final response with category names
	//    (We already have them in req.CategoryNames, or we can do a "populate" approach)
	//    Since we used catIDs, let's re-use the original names from req.CategoryNames
	//    to keep it simple:
	skillResp := SkillWithCatNames{
		Skill:         createdSkill,
		CategoryNames: req.CategoryNames,
	}

	responses.SendCreated(c, "Skill created successfully", skillResp)
}

// GetSkillByID - GET /api/skills/:id
func (h *SkillHandler) GetSkillByID(c *gin.Context) {
	skillID := c.Param("id")

	skill, err := h.skillService.GetByID(skillID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Skill not found", err)
		return
	}
	responses.SendSuccess(c, "Skill retrieved successfully", skill)
}

// UpdateSkill - PUT /api/skills/:id
func (h *SkillHandler) UpdateSkill(c *gin.Context) {
	skillID := c.Param("id")

	// Must be authenticated
	userIDstr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Check that skill belongs to the user
	skill, err := h.skillService.GetByID(skillID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Skill not found", err)
		return
	}
	if skill.UserID.Hex() != userIDstr.(string) {
		responses.SendError(c, http.StatusForbidden, "Not allowed to update this skill", nil)
		return
	}

	var updateData bson.M
	if err := c.ShouldBindJSON(&updateData); err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	updatedSkill, err := h.skillService.Update(skillID, updateData)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to update skill", err)
		return
	}

	responses.SendUpdated(c, "Skill updated successfully", updatedSkill)
}

// DeleteSkill - DELETE /api/skills/:id
func (h *SkillHandler) DeleteSkill(c *gin.Context) {
	skillID := c.Param("id")

	// Must be authenticated
	userIDstr, exists := c.Get("userId")
	if !exists {
		responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
		return
	}

	// Check that skill belongs to the user
	skill, err := h.skillService.GetByID(skillID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "Skill not found", err)
		return
	}
	if skill.UserID.Hex() != userIDstr.(string) {
		responses.SendError(c, http.StatusForbidden, "Not allowed to delete this skill", nil)
		return
	}

	if err := h.skillService.Delete(skillID); err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to delete skill", err)
		return
	}

	responses.SendDeleted(c, "Skill deleted successfully")
}

func (h *SkillHandler) GetSkillsBySlug(c *gin.Context) {
	slug := c.Param("slug")

	// 1. Find user by slug
	user, err := h.userService.GetUserBySlug(slug)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
		return
	}

	// 2. Fetch skills for the user
	skills, err := h.skillService.GetByUserID(user.ID)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to fetch skills", err)
		return
	}

	// 3. Extract unique category IDs from the skills
	categoryIDs := make(map[primitive.ObjectID]bool)
	for _, skill := range skills {
		for _, catID := range skill.CategoryIDs {
			categoryIDs[catID] = true
		}
	}

	// 4. Convert category IDs map to a slice for DB query
	var categoryIDSlice []primitive.ObjectID
	for catID := range categoryIDs {
		categoryIDSlice = append(categoryIDSlice, catID)
	}

	// 5. Fetch all categories at once (bulk query)
	categories, err := h.categoryService.GetByIDs(categoryIDSlice)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Failed to fetch category names", err)
		return
	}

	// 6. Build a map of category_id -> category_name
	categoryMap := make(map[primitive.ObjectID]string)
	for _, category := range categories {
		categoryMap[category.ID] = category.Name
	}

	// 7. Modify skill data to include category names
	var skillResponses []map[string]interface{}
	for _, skill := range skills {
		var categoryNames []string
		for _, catID := range skill.CategoryIDs {
			if name, exists := categoryMap[catID]; exists {
				categoryNames = append(categoryNames, name)
			}
		}

		// Build skill response including category names
		skillResponses = append(skillResponses, map[string]interface{}{
			"id":             skill.ID.Hex(),
			"user_id":        skill.UserID.Hex(),
			"name":           skill.Name,
			"proficiency":    skill.Proficiency,
			"years":          skill.Years,
			"icon_name":      skill.IconName,
			"progress":       skill.Progress,
			"category_ids":   skill.CategoryIDs,
			"category_names": categoryNames, // Added populated category names
			"created_at":     skill.CreatedAt,
			"updated_at":     skill.UpdatedAt,
		})
	}

	responses.SendSuccess(c, "Skills retrieved successfully", skillResponses)
}
