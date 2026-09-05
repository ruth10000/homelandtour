import Tour from "../models/Tour.js";
import { bufferToBase64 } from "../utils/bufferToBase64.js";

// Add Tour
const addTour = async (req, res) => {
  try {
    const { place, placeDetails, price, image: bodyImage } = req.body;

    if (!place || !placeDetails || price === undefined || price === "") {
      return res.status(400).json({ message: "place, placeDetails, and price are required fields." });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = bufferToBase64(req.file);
    } else if (bodyImage) {
      imageUrl = bodyImage;
    }

    if (!imageUrl) {
      return res.status(400).json({ message: "Image file or base64 image data is required" });
    }

    const newTour = new Tour({
      place,
      placeDetails,
      price: Number(price),
      image: imageUrl,
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add tour" });
  }
};

// Get All / Search Tours
const getTours = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { place: { $regex: search, $options: "i" } },
          { placeDetails: { $regex: search, $options: "i" } },
        ],
      };
    }

    const tours = await Tour.find(query);
    res.status(200).json(tours);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch tours" });
  }
};

// Update Tour
const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const { place, placeDetails, price, image: bodyImage } = req.body;

    const tourData = await Tour.findById(id);

    if (!tourData) {
      return res.status(404).json({ message: "Tour not found" });
    }

    let imageUrl = tourData.image;

    if (req.file) {
      imageUrl = bufferToBase64(req.file);
    } else if (bodyImage) {
      imageUrl = bodyImage;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        place: place !== undefined ? place : tourData.place,
        placeDetails: placeDetails !== undefined ? placeDetails : tourData.placeDetails,
        price: price !== undefined ? Number(price) : tourData.price,
        image: imageUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update tour" });
  }
};

// Delete Tour
const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;

    const tourData = await Tour.findById(id);

    if (!tourData) {
      return res.status(404).json({ message: "Tour not found" });
    }

    await Tour.findByIdAndDelete(id);

    res.status(200).json({ message: "Tour deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete tour" });
  }
};

export default {
  addTour,
  getTours,
  updateTour,
  deleteTour,
};