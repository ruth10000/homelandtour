/**
 * Converts a Multer file object or raw buffer with mimetype into a Base64 Data URI string.
 * @param {object} file - The file object from Multer (req.file)
 * @returns {string|null} - Base64 Data URI string (e.g. data:image/jpeg;base64,...)
 */
export const bufferToBase64 = (file) => {
  if (!file || !file.buffer) return null;
  const mimetype = file.mimetype || "image/jpeg";
  return `data:${mimetype};base64,${file.buffer.toString("base64")}`;
};

export default bufferToBase64;
