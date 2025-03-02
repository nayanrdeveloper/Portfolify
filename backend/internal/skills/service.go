package skills

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type SkillService struct {
	repo *SkillRepository
}

func NewSkillService(r *SkillRepository) *SkillService {
	return &SkillService{repo: r}
}

// Create skill for user
func (s *SkillService) Create(userID primitive.ObjectID, input *SkillInput) (*Skill, error) {
	catObjIDs, err := stringsToObjectIDs(input.CategoryIDs)
	if err != nil {
		return nil, fmt.Errorf("invalid category IDs: %w", err)
	}

	// Ensure progress is within 0..100
	if input.Progress < 0 || input.Progress > 100 {
		return nil, fmt.Errorf("progress must be between 0 and 100")
	}
	skill := &Skill{
		UserID:      userID,
		Name:        input.Name,
		Proficiency: input.Proficiency,
		Years:       input.Years,
		IconName:    input.IconName,
		IconURL:     input.IconURL,
		CategoryIDs: catObjIDs,
		Progress:    input.Progress,
	}
	return s.repo.Create(skill)
}

func (s *SkillService) GetByID(id string) (*Skill, error) {
	return s.repo.GetByID(id)
}

func (s *SkillService) Update(id string, updateData bson.M) (*Skill, error) {
	if catVals, ok := updateData["category_ids"]; ok {
		catStrs, ok := catVals.([]interface{})
		if !ok {
			return nil, fmt.Errorf("category_ids must be an array of strings")
		}
		var strIDs []string
		for _, v := range catStrs {
			if str, ok := v.(string); ok {
				strIDs = append(strIDs, str)
			} else {
				return nil, fmt.Errorf("invalid category ID type in array")
			}
		}
		objIDs, err := stringsToObjectIDs(strIDs)
		if err != nil {
			return nil, err
		}
		// Replace in updateData with []primitive.ObjectID
		updateData["category_ids"] = objIDs
	}

	// Validate progress if provided
	if progVal, ok := updateData["progress"].(float64); ok {
		if progVal < 0 || progVal > 100 {
			return nil, fmt.Errorf("progress must be between 0 and 100")
		}
		updateData["progress"] = int(progVal)
	}

	return s.repo.Update(id, updateData)
}

// Convert array of string hex IDs to array of ObjectIDs
func stringsToObjectIDs(strIDs []string) ([]primitive.ObjectID, error) {
	var objIDs []primitive.ObjectID
	for _, str := range strIDs {
		id, err := primitive.ObjectIDFromHex(str)
		if err != nil {
			return nil, err
		}
		objIDs = append(objIDs, id)
	}
	return objIDs, nil
}

func (s *SkillService) Delete(id string) error {
	return s.repo.Delete(id)
}

// GetByUserID returns all skills for a user
func (s *SkillService) GetByUserID(userID primitive.ObjectID) ([]*Skill, error) {
	return s.repo.GetByUserID(userID)
}

func (s *SkillService) CreateDirect(skill *Skill) (*Skill, error) {
	// validate progress
	if skill.Progress < 0 || skill.Progress > 100 {
		return nil, fmt.Errorf("progress must be between 0 and 100")
	}

	// validate skill.Name, etc.
	return s.repo.Create(skill)
}
