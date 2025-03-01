package uploads

import (
	"portfolify/pkg/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterUploadRoutes(rg *gin.RouterGroup, handler *UploadHandler) {
	uploadGroup := rg.Group("/uploads")

	uploadGroup.Use(middleware.AuthRequired())

	uploadGroup.POST("/single", handler.UploadSingle)
	uploadGroup.POST("/multiple", handler.UploadMultiple)
}
