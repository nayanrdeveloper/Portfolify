package skills

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterSkillRoutes(rg *gin.RouterGroup, handler *SkillHandler) {
	skillRoutes := rg.Group("/skills")

	// Public
	skillRoutes.GET("/user/:slug", handler.GetSkillsBySlug)
	skillRoutes.GET("/:id", handler.GetSkillByID)

	// Protected
	skillRoutes.Use(middleware.AuthRequired())
	{
		skillRoutes.POST("/", handler.CreateSkill)
		skillRoutes.PUT("/:id", handler.UpdateSkill)
		skillRoutes.DELETE("/:id", handler.DeleteSkill)
	}
}
