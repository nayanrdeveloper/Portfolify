package users

import "github.com/gin-gonic/gin"

// RegisterUserRoutes sets up /api/users routes
func RegisterUserRoutes(rg *gin.RouterGroup, handler *UserHandler) {
	userRoutes := rg.Group("/users")
	{
		userRoutes.POST("/register", handler.Register)
		userRoutes.POST("/login", handler.Login)

		// Example route for retrieving user by ID
		userRoutes.GET("/:id", handler.GetUserByID)
	}
}
