package userdetails

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterUserDetailsRoutes(rg *gin.RouterGroup, handler *UserDetailsHandler) {
	detailsGroup := rg.Group("/user-details")

	// Public route: fetch user details by slug
	detailsGroup.GET("/slug/:slug", handler.GetBySlug)

	// Protected routes: must be logged in
	detailsGroup.Use(middleware.AuthRequired())
	{
		// Example: get my own details
		detailsGroup.GET("/me", handler.GetMyDetails)

		detailsGroup.POST("/", handler.UpdateMyDetails)
	}
}
