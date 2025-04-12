package contactus

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterContactUsRoutes(router *gin.RouterGroup, handler *ContactUsHandler) {
	// Public route to send a contact message
	router.POST("/contact/:slug", handler.CreateMessage)

	// Protected route to get all contact messages for the logged-in user
	authGroup := router.Group("/contact").Use(middleware.AuthRequired())
	{
		authGroup.GET("/messages", handler.GetMessages)
		authGroup.GET("/:id", handler.GetMessageByID)
		authGroup.DELETE("/:id", handler.DeleteMessageByID)
	}
}
