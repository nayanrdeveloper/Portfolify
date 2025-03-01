package uploads

import (
	"io"
	"net/http"

	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.uber.org/zap"
)

type UploadHandler struct {
	service *UploadService
}

func NewUploadHandler(s *UploadService) *UploadHandler {
	return &UploadHandler{service: s}
}

// UploadSingle godoc:
// @Summary Uploads a single file
// @Description Upload a single file to Cloudinary (image, video, or PDF)
// @Accept multipart/form-data
// @Produce json
// @Param file formData file true "File to upload"
// @Param folder query string false "Optional folder name in Cloudinary"
// @Success 200 {object} gin.H
// @Router /uploads/single [post]
func (h *UploadHandler) UploadSingle(c *gin.Context) {
	fileHeader, err := c.FormFile("file")
	if err != nil {
		logger.Log.Error("file not found in form data", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, "File is required", err)
		return
	}

	// Optional folder param
	folder := c.Query("folder")
	if folder == "" {
		folder = "portfolio_uploads" // default
	}

	// Validate (size, type)
	if err := h.service.ValidateFile(fileHeader); err != nil {
		responses.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	// Read file into bytes
	file, err := fileHeader.Open()
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Unable to open file", err)
		return
	}
	defer file.Close()

	fileBytes, err := io.ReadAll(file)
	if err != nil {
		responses.SendError(c, http.StatusInternalServerError, "Unable to read file", err)
		return
	}

	// Upload to Cloudinary
	secureURL, err := h.service.UploadFile(fileBytes, fileHeader.Filename, folder)
	if err != nil {
		logger.Log.Error("Failed to upload to Cloudinary", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Upload failed", err)
		return
	}

	responses.SendSuccess(c, "File uploaded successfully", gin.H{
		"secure_url": secureURL,
	})
}

// UploadMultiple godoc:
// @Summary Upload multiple files
// @Description Upload multiple files (images, videos, or PDFs) to Cloudinary
// @Accept multipart/form-data
// @Produce json
// @Param files formData file true "Multiple files to upload" collectionFormat(multi)
// @Param folder query string false "Optional folder name in Cloudinary"
// @Success 200 {object} gin.H
// @Router /uploads/multiple [post]
func (h *UploadHandler) UploadMultiple(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid form data", err)
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		responses.SendError(c, http.StatusBadRequest, "No files provided", nil)
		return
	}

	folder := c.Query("folder")
	if folder == "" {
		folder = "portfolio_uploads"
	}

	var uploadedURLs []string

	for _, fileHeader := range files {
		if err := h.service.ValidateFile(fileHeader); err != nil {
			responses.SendError(c, http.StatusBadRequest, err.Error(), err)
			return
		}

		file, err := fileHeader.Open()
		if err != nil {
			responses.SendError(c, http.StatusInternalServerError, "Unable to open file", err)
			return
		}
		defer file.Close()

		fileBytes, err := io.ReadAll(file)
		if err != nil {
			responses.SendError(c, http.StatusInternalServerError, "Unable to read file", err)
			return
		}

		secureURL, err := h.service.UploadFile(fileBytes, fileHeader.Filename, folder)
		if err != nil {
			responses.SendError(c, http.StatusInternalServerError, "Failed to upload file to Cloudinary", err)
			return
		}
		uploadedURLs = append(uploadedURLs, secureURL)
	}

	responses.SendSuccess(c, "Files uploaded successfully", gin.H{
		"secure_urls": uploadedURLs,
	})
}
