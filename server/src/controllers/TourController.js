import Tour from "../models/Tour.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/uploadToCloudinary.js";

// Add Tour
const addTour = async (req, res) => {
  try {
    const { place, placeDetails, price } = req.body;

    if (!place || !placeDetails || price === undefined || price === "") {
      return res.status(400).json({ message: "place, placeDetails, and price are required fields." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    // Upload image buffer to Cloudinary under folder 'homeland-tour/tours'
    const { secure_url, public_id } = await uploadToCloudinary(
      req.file.buffer,
      "homeland-tour/tours"
    );

    const newTour = new Tour({
      place,
      placeDetails,
      price: Number(price),
      image: secure_url,
      imagePublicId: public_id,
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
    const { place, placeDetails, price } = req.body;

    const tourData = await Tour.findById(id);

    if (!tourData) {
      return res.status(404).json({ message: "Tour not found" });
    }

    let imageUrl = tourData.image;
    let imagePublicId = tourData.imagePublicId;
    let oldPublicIdToDelete = null;

    // Update image if a new file is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        "homeland-tour/tours"
      );
      imageUrl = uploadResult.secure_url;
      oldPublicIdToDelete = tourData.imagePublicId;
      imagePublicId = uploadResult.public_id;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        place: place !== undefined ? place : tourData.place,
        placeDetails: placeDetails !== undefined ? placeDetails : tourData.placeDetails,
        price: price !== undefined ? Number(price) : tourData.price,
        image: imageUrl,
        imagePublicId,
      },
      { new: true }
    );

    // Delete old Cloudinary image only AFTER the new upload and DB update succeeded
    if (oldPublicIdToDelete) {
      await deleteFromCloudinary(oldPublicIdToDelete);
    }

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

    // Delete image from Cloudinary if public_id exists
    if (tourData.imagePublicId) {
      await deleteFromCloudinary(tourData.imagePublicId);
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