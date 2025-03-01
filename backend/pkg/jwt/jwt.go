package jwt

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// CustomClaims - custom JWT claims
type CustomClaims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	Slug   string `json:"slug"`
	jwt.RegisteredClaims
}

// GenerateToken generates a JWT token for a given user.
func GenerateToken(userID, email, slug string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// For production, ensure JWT_SECRET is set
		secret = "default_jwt_secret"
	}

	claims := CustomClaims{
		UserID: userID,
		Email:  email,
		Slug:   slug,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)), // 24h validity
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

// ValidateToken parses and validates a token string.
func ValidateToken(tokenString string) (*CustomClaims, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "default_jwt_secret"
	}

	token, err := jwt.ParseWithClaims(tokenString, &CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
	if err != nil {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid token claims")
	}

	return claims, nil
}
