package responses

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Default messages for common operations.
const (
	DefaultCreatedMessage   = "Resource created successfully."
	DefaultRetrievedMessage = "Resource retrieved successfully."
	DefaultUpdatedMessage   = "Resource updated successfully."
	DefaultDeletedMessage   = "Resource deleted successfully."
)

type Response struct {
	Status  string      `json:"status"`          // "success" or "error"
	Message string      `json:"message"`         // A brief message for the client
	Data    interface{} `json:"data,omitempty"`  // Response payload (optional)
	Error   string      `json:"error,omitempty"` // Detailed error message (optional)
}

// defaultMsg returns the provided message if not empty; otherwise, it returns the default.
func defaultMsg(provided, def string) string {
	if provided == "" {
		return def
	}
	return provided
}

// SendSuccess sends a standard success response (HTTP 200).
// If message is empty, it uses a default message for retrieval.
func SendSuccess(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: defaultMsg(message, DefaultRetrievedMessage),
		Data:    data,
	})
}

// SendCreated sends a response for successful creation (HTTP 201).
// Uses a default message if none is provided.
func SendCreated(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusCreated, Response{
		Status:  "success",
		Message: defaultMsg(message, DefaultCreatedMessage),
		Data:    data,
	})
}

// SendUpdated sends a response for a successful update (HTTP 200).
// Uses a default message if none is provided.
func SendUpdated(c *gin.Context, message string, data interface{}) {
	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: defaultMsg(message, DefaultUpdatedMessage),
		Data:    data,
	})
}

// SendDeleted sends a response for a successful deletion (HTTP 200).
// Uses a default message if none is provided.
func SendDeleted(c *gin.Context, message string) {
	c.JSON(http.StatusOK, Response{
		Status:  "success",
		Message: defaultMsg(message, DefaultDeletedMessage),
	})
}

// SendError sends a standardized error response.
// The 'err' parameter can include internal error details.
func SendError(c *gin.Context, code int, message string, err error) {
	errorMsg := ""
	if err != nil {
		errorMsg = err.Error()
	}
	c.JSON(code, Response{
		Status:  "error",
		Message: message,
		Error:   errorMsg,
	})
}
