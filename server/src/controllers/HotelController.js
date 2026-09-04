import Hotel from "../models/Hotel.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary.js";

// Add Hotel — accepts up to 4 images via multer array upload
const addHotel = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Hotel name is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one hotel image is required" });
    }

    if (req.files.length > 4) {
      return res.status(400).json({ message: "A hotel can have at most 4 images" });
    }

    // Upload all files to Cloudinary under folder 'homeland-tour/hotels'
    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, "homeland-tour/hotels")
    );

    const uploadResults = await Promise.all(uploadPromises);

    const imageUrls = uploadResults.map((res) => res.secure_url);
    const imagePublicIds = uploadResults.map((res) => res.public_id);

    const newHotel = new Hotel({
      name,
      images: imageUrls,
      imagePublicIds,
      description: description || "",
    });

    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add hotel" });
  }
};

// Get All Hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch hotels" });
  }
};

// Delete Hotel
const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    // Delete all associated images from Cloudinary
    if (hotel.imagePublicIds && hotel.imagePublicIds.length > 0) {
      const deletePromises = hotel.imagePublicIds.map((publicId) =>
        deleteFromCloudinary(publicId)
      );
      await Promise.all(deletePromises);
    }

    await Hotel.findByIdAndDelete(id);

    res.status(200).json({ message: "Hotel deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete hotel" });
  }
};

export default {
  addHotel,
  getHotels,
  deleteHotel,
};
