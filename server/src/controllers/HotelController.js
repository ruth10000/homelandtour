import Hotel from "../models/Hotel.js";
import { bufferToBase64 } from "../utils/bufferToBase64.js";

// Add Hotel — accepts up to 4 images via multer array upload or base64 strings array in JSON body
const addHotel = async (req, res) => {
  try {
    const { name, description, images: bodyImages } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Hotel name is required" });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      if (req.files.length > 4) {
        return res.status(400).json({ message: "A hotel can have at most 4 images" });
      }
      imageUrls = req.files.map((file) => bufferToBase64(file));
    } else if (Array.isArray(bodyImages) && bodyImages.length > 0) {
      if (bodyImages.length > 4) {
        return res.status(400).json({ message: "A hotel can have at most 4 images" });
      }
      imageUrls = bodyImages;
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({ message: "At least one hotel image is required" });
    }

    const newHotel = new Hotel({
      name,
      images: imageUrls,
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
