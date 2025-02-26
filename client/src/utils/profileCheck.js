// src/utils/profileCheck.js
export const checkProfileCompleteness = (personalInfo, personalityTraits) => {
  // Required fields for personalInfo
  const requiredPersonalInfo = [
    "firstname",
    "lastname",
    "nickname",
    "age",
    "maritalstatus",
    "gender",
    "province",
    "university",
  ];

  // Required fields for personalityTraits
  const requiredTraits = [
    "type",
    "sleep",
    "wake",
    "clean",
    "air_conditioner",
    "drink",
    "smoke",
    "money",
    "expense",
    "pet",
    "cook",
    "loud",
    "friend",
    "religion",
    "period",
  ];

  // Check if any required personal info is missing
  const hasIncompleteInfo = requiredPersonalInfo.some(
    (field) => !personalInfo || !personalInfo[field]
  );

  // Check if any required traits are missing
  const hasIncompleteTraits = requiredTraits.some(
    (field) => !personalityTraits || !personalityTraits[field]
  );

  return {
    isComplete: !hasIncompleteInfo && !hasIncompleteTraits,
    hasIncompleteInfo,
    hasIncompleteTraits,
  };
};
