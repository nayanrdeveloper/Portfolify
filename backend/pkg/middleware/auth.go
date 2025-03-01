package middleware

import (
	"net/http"
	"strings"

	"portfolify/pkg/jwt"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			responses.SendError(c, http.StatusUnauthorized, "Missing Authorization header", nil)
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			responses.SendError(c, http.StatusUnauthorized, "Invalid Authorization format", nil)
			c.Abort()
			return
		}

		tokenString := parts[1]
		claims, err := jwt.ValidateToken(tokenString)
		if err != nil {
			responses.SendError(c, http.StatusUnauthorized, "Invalid token", err)
			c.Abort()
			return
		}

		// Store user info in context
		c.Set("userId", claims.UserID)
		c.Set("email", claims.Email)
		c.Set("slug", claims.Slug)

		c.Next()
	}
}
