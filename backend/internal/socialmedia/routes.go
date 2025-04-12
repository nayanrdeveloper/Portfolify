package socialmedia

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterSocialMediaRoutes(rg *gin.RouterGroup, handler *SocialMediaHandler) {
	rg.GET("/socialmedia/user/:slug", handler.GetSocialMediaBySlug)

	smGroup := rg.Group("/socialmedia").Use(middleware.AuthRequired())
	{
		smGroup.PUT("/", handler.UpdateSocialMedia)
	}
}
