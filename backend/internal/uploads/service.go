package uploads

import (
	"fmt"
	"mime/multipart"
	"strings"

	"portfolify/pkg/cloudinary"
)

// UploadService defines the logic for uploading.
type UploadService struct {
	CloudManager *cloudinary.CloudinaryManager
}

func NewUploadService(cm *cloudinary.CloudinaryManager) *UploadService {
	return &UploadService{CloudManager: cm}
}

// AllowedFileTypes is a simple map of allowed MIME "prefixes" or extensions for images, videos, PDFs
var AllowedFileTypes = []string{"image/", "video/", "application/pdf"}

// ValidateFile checks content type + size
func (s *UploadService) ValidateFile(fileHeader *multipart.FileHeader) error {
	// Example: limit file size to ~20 MB
	const MAX_SIZE int64 = 20 << 20 // 20 MB
	if fileHeader.Size > MAX_SIZE {
		return fmt.Errorf("file size exceeds 20 MB limit")
	}

	// Check content type
	// If your server is running behind a proxy or on certain OS, `fileHeader.Header.Get("Content-Type")` might differ;
	// consider detecting the type by reading a few bytes or using a library like "net/http/sniff".
	contentType := fileHeader.Header.Get("Content-Type")
	if !isAllowed(contentType) {
		return fmt.Errorf("invalid file type: %s; only images/videos/pdf allowed", contentType)
	}

	return nil
}

// UploadFile uploads a single file to Cloudinary, returning the public URL
func (s *UploadService) UploadFile(fileBytes []byte, filename string, folder string) (string, error) {
	result, err := s.CloudManager.UploadSingleFile(fileBytes, filename, folder)
	if err != nil {
		return "", err
	}
	return result.SecureURL, nil
}

// isAllowed checks if content type is in AllowedFileTypes list
func isAllowed(contentType string) bool {
	for _, prefix := range AllowedFileTypes {
		if strings.HasPrefix(contentType, prefix) {
			return true
		}
	}
	return false
}
