package contactus

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "portfolify/internal/users"
    "portfolify/pkg/responses"
)

type ContactUsHandler struct {
    service     *ContactUsService
    userService *users.UserService // to find user by slug
}

func NewContactUsHandler(svc *ContactUsService, userSvc *users.UserService) *ContactUsHandler {
    return &ContactUsHandler{
        service:     svc,
        userService: userSvc,
    }
}

// CreateMessage (Public)
// POST /api/contact/:slug
// Anyone can contact the user who has the given slug
func (h *ContactUsHandler) CreateMessage(c *gin.Context) {
    slug := c.Param("slug") // e.g. "nayan-rdeveloper"

    // 1) Find the user (portfolio owner) by slug
    owner, err := h.userService.GetUserBySlug(slug)
    if err != nil {
        responses.SendError(c, http.StatusNotFound, "User not found by slug", err)
        return
    }

    // 2) Bind the JSON input
    var input ContactUsInput
    if err := c.ShouldBindJSON(&input); err != nil {
        responses.SendError(c, http.StatusBadRequest, "Invalid contact message data", err)
        return
    }

    // 3) Create the message
    msg, err := h.service.Create(owner.ID, &input)
    if err != nil {
        responses.SendError(c, http.StatusInternalServerError, "Failed to create contact message", err)
        return
    }

    responses.SendCreated(c, "Contact message sent successfully", msg)
}

// GetMessages (Protected)
// GET /api/contact/messages
// Only the portfolio owner can see their messages
func (h *ContactUsHandler) GetMessages(c *gin.Context) {
    userIDstr, exists := c.Get("userId")
    if !exists {
        responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
        return
    }

    ownerID, err := primitive.ObjectIDFromHex(userIDstr.(string))
    if err != nil {
        responses.SendError(c, http.StatusUnauthorized, "Invalid userID in token", err)
        return
    }

    messages, err := h.service.GetMessages(ownerID)
    if err != nil {
        responses.SendError(c, http.StatusInternalServerError, "Failed to retrieve messages", err)
        return
    }

    responses.SendSuccess(c, "Messages retrieved successfully", messages)
}

// GetMessageByID - GET /api/contact/:id
// Only the portfolio owner can see the full details of a single message
func (h *ContactUsHandler) GetMessageByID(c *gin.Context) {
    messageID := c.Param("id")

    // Must be authenticated
    userIDstr, exists := c.Get("userId")
    if !exists {
        responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
        return
    }

    ownerID, err := primitive.ObjectIDFromHex(userIDstr.(string))
    if err != nil {
        responses.SendError(c, http.StatusUnauthorized, "Invalid userId in token", err)
        return
    }

    // 1) Fetch the message from DB
    contactMsg, err := h.service.GetByID(messageID)
    if err != nil {
        responses.SendError(c, http.StatusNotFound, "Contact message not found", err)
        return
    }

    // 2) Check ownership
    if contactMsg.OwnerUserID != ownerID {
        responses.SendError(c, http.StatusForbidden, "Not allowed to view this message", nil)
        return
    }

    responses.SendSuccess(c, "Contact message retrieved successfully", contactMsg)
}

// DeleteMessageByID - DELETE /api/contact/:id
// Only the portfolio owner can delete
func (h *ContactUsHandler) DeleteMessageByID(c *gin.Context) {
    messageID := c.Param("id")

    // Must be authenticated
    userIDstr, exists := c.Get("userId")
    if !exists {
        responses.SendError(c, http.StatusUnauthorized, "Unauthorized", nil)
        return
    }

    ownerID, err := primitive.ObjectIDFromHex(userIDstr.(string))
    if err != nil {
        responses.SendError(c, http.StatusUnauthorized, "Invalid userId in token", err)
        return
    }

    // 1) Fetch the message to confirm ownership
    contactMsg, err := h.service.GetByID(messageID)
    if err != nil {
        responses.SendError(c, http.StatusNotFound, "Contact message not found", err)
        return
    }

    // 2) Check ownership
    if contactMsg.OwnerUserID != ownerID {
        responses.SendError(c, http.StatusForbidden, "Not allowed to delete this message", nil)
        return
    }

    // 3) Delete it
    if err := h.service.Delete(messageID); err != nil {
        responses.SendError(c, http.StatusInternalServerError, "Failed to delete contact message", err)
        return
    }

    responses.SendDeleted(c, "Contact message deleted successfully")
}

