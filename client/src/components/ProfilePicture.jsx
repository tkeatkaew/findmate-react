import React from "react";

const ProfilePicture = ({ src, alt = "Profile", size = "md" }) => {
  // Helper to determine if URL is a Cloudinary URL
  const isCloudinaryUrl = (url) => {
    return url && url.includes("res.cloudinary.com");
  };

  // Get default dimensions based on size prop
  const getDimensions = () => {
    switch (size) {
      case "sm":
        return "h-12 w-12";
      case "lg":
        return "h-40 w-40";
      case "md":
      default:
        return "h-24 w-24";
    }
  };

  // Determine source URL
  const getImageUrl = () => {
    if (!src) return "/api/placeholder/150/150";
    if (isCloudinaryUrl(src)) return src;
    if (src.startsWith("/uploads/")) {
      // Handle legacy paths by showing placeholder
      return "/api/placeholder/150/150";
    }
    return src;
  };

  return (
    <img
      src={getImageUrl()}
      alt={alt}
      className={`${getDimensions()} rounded-lg object-cover`}
    />
  );
};

export default ProfilePicture;
