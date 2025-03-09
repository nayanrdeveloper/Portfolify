package middleware

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware returns a gin.HandlerFunc that applies the CORS config.
func CORSMiddleware(allowedOrigins []string) gin.HandlerFunc {
	config := cors.Config{
		// Which origins are allowed? In production, you might set something
		// like: []string{"https://mydomain.com"}
		AllowOrigins: allowedOrigins,

		// AllowedMethods can include GET, POST, PUT, PATCH, DELETE, OPTIONS
		AllowMethods: []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},

		// AllowedHeaders: which headers can be sent by the client
		AllowHeaders: []string{"Content-Type", "Authorization"},

		// ExposeHeaders: which headers can be exposed to the browser
		ExposeHeaders: []string{"Content-Length", "Content-Type"},

		// AllowCredentials: set to true if you need cookies/auth
		AllowCredentials: true,

		// MaxAge: how long (in seconds) the results of a preflight request can be cached
		MaxAge: 12 * time.Hour,
	}

	return cors.New(config)
}
