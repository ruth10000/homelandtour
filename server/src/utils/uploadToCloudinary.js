import cloudinary from "../config/cloudinary.js";

/**
 * Upload a file buffer to Cloudinary into a specified folder.
 * @param {Buffer} fileBuffer - The file buffer from Multer memoryStorage
 * @param {string} folder - The Cloudinary target folder (e.g. homeland-tour/tours)
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    if (!fileBuffer) {
      return reject(new Error("No file buffer provided for upload"));
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(fileBuffer);
  });
};

/**
 * Delete an image from Cloudinary using its public_id.
 * @param {string} publicId - The Cloudinary public_id of the image to delete
 * @returns {Promise<object|null>}
 */
export const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return null;
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return null;
  }
};
