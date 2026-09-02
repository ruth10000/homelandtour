import Hotel from "../models/Hotel.js";

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

    const imageUrls = req.files.map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    const newHotel = new Hotel({
      name,
      images: imageUrls,
      description: description || "",
    });

    const savedHotel = await newHotel.save();
    res.status(201).json(savedHotel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Hotels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  addHotel,
  getHotels,
};
