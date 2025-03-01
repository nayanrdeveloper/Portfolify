package users

import (
	"net/http"

	"portfolify/pkg/jwt"
	"portfolify/pkg/logger"
	"portfolify/pkg/responses"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.uber.org/zap"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(s *UserService) *UserHandler {
	return &UserHandler{service: s}
}

// Register endpoint - POST /api/users/register
func (h *UserHandler) Register(c *gin.Context) {
	var input RegisterUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Log.Error("Invalid registration data", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, "Invalid registration data", err)
		return
	}

	user, err := h.service.RegisterUser(input)
	if err != nil {
		logger.Log.Error("Failed to register user", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, err.Error(), err)
		return
	}

	responses.SendCreated(c, "User registered successfully", user)
}

// Login endpoint - POST /api/users/login
func (h *UserHandler) Login(c *gin.Context) {
	var input LoginUserInput
	if err := c.ShouldBindJSON(&input); err != nil {
		logger.Log.Error("Invalid login data", zap.Error(err))
		responses.SendError(c, http.StatusBadRequest, "Invalid login data", err)
		return
	}

	user, err := h.service.LoginUser(input)
	if err != nil {
		logger.Log.Error("Invalid credentials", zap.Error(err))
		responses.SendError(c, http.StatusUnauthorized, "Invalid credentials", err)
		return
	}

	// Generate JWT
	tokenString, err := jwt.GenerateToken(user.ID.Hex(), user.Email, user.Slug)
	if err != nil {
		logger.Log.Error("Failed to generate token", zap.Error(err))
		responses.SendError(c, http.StatusInternalServerError, "Failed to generate token", err)
		return
	}

	responses.SendSuccess(c, "User logged in successfully", gin.H{
		"token": tokenString,
	})
}

// (Optional) Example: GET /api/users/:id
func (h *UserHandler) GetUserByID(c *gin.Context) {
	userID := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		responses.SendError(c, http.StatusBadRequest, "Invalid user ID", err)
		return
	}

	user, err := h.service.GetUserByID(objID)
	if err != nil {
		responses.SendError(c, http.StatusNotFound, "User not found", err)
		return
	}

	responses.SendSuccess(c, "User retrieved successfully", user)
}
