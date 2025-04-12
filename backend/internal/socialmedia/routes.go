package socialmedia

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterSocialMediaRoutes(rg *gin.RouterGroup, handler *SocialMediaHandler) {
	rg.GET("/socialmedia/user/:slug", handler.GetSocialMedia)

	smGroup := rg.Group("/socialmedia").Use(middleware.AuthRequired())
	{
		smGroup.POST("/", handler.CreateSocialMedia)
		smGroup.PUT("/", handler.UpdateSocialMedia)
		smGroup.DELETE("/", handler.DeleteSocialMedia)
	}
}
