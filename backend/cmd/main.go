package main

import (
	"net/http"
	"portfolify/api" // Update if your routes are in a different package
	"portfolify/config"

	"github.com/gin-gonic/gin"
)

func main() {
	config.LoadEnv()

	config.ConnectDB()

	router := gin.Default()

	api.RegisterRoutes(router)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Route not found",
		})
	})

	router.Run(":8080")
}
