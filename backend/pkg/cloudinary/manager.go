// pkg/cloudinary/manager.go
package cloudinary

import (
	"bytes"
	"context"
	"fmt"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryManager struct {
	Client *cloudinary.Cloudinary
}

// Helper to convert bool to *bool
func boolPtr(b bool) *bool {
	return &b
}

// Create a background context
func ctx() context.Context {
	return context.Background()
}

// NewCloudinaryManager initializes a Cloudinary instance from environment variables
func NewCloudinaryManager() (*CloudinaryManager, error) {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return nil, fmt.Errorf("missing one of CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET")
	}

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize Cloudinary: %w", err)
	}

	return &CloudinaryManager{Client: cld}, nil
}

func (cm *CloudinaryManager) UploadSingleFile(data []byte, fileName string, folder string) (*uploader.UploadResult, error) {
	uploadParams := uploader.UploadParams{
		Folder:       folder,
		PublicID:     fileName,
		Overwrite:    boolPtr(true), // pointer to bool
		ResourceType: "auto",
	}

	// Convert []byte to io.Reader
	dataReader := bytes.NewReader(data)

	// Pass the io.Reader instead of the raw []byte
	return cm.Client.Upload.Upload(ctx(), dataReader, uploadParams)
}
