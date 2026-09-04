import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE"), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
  fileFilter,
});

/**
 * Middleware wrapper for single image upload ("image")
 * Handles Multer validation and file size errors returning clean HTTP 400 JSON response.
 */
export const handleSingleUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image size must be less than 5MB." });
      }
      if (err.message === "INVALID_FILE_TYPE") {
        return res.status(400).json({ message: "Only JPEG, PNG and WebP images are allowed." });
      }
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
};

/**
 * Middleware wrapper for multiple image upload ("images", max 4)
 * Handles Multer validation and file size errors returning clean HTTP 400 JSON response.
 */
export const handleArrayUpload = (req, res, next) => {
  upload.array("images", 4)(req, res, (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Image size must be less than 5MB." });
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({ message: "A hotel can have at most 4 images." });
      }
      if (err.message === "INVALID_FILE_TYPE") {
        return res.status(400).json({ message: "Only JPEG, PNG and WebP images are allowed." });
      }
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
};

export default upload;
