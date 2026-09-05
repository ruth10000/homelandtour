import Package from "../models/Package.js";
import { bufferToBase64 } from "../utils/bufferToBase64.js";

// Add Package
const addPackage = async (req, res) => {
  try {
    const { place, day, placeDetails, price, hotelId, image: bodyImage } = req.body;

    if (!place || day === undefined || !placeDetails || price === undefined) {
      return res.status(400).json({ message: "place, day, placeDetails, and price are required." });
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

    const newPackage = new Package({
      place,
      day: Number(day),
      placeDetails,
      price: Number(price),
      image: imageUrl,
      hotel: hotelId || undefined,
    });

    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to add package" });
  }
};

// Get All / Search Packages
const getPackage = async (req, res) => {
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

    const packages = await Package.find(query).populate("hotel", "name");
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch packages" });
  }
};

// Get Single Package by ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const pkg = await Package.findById(id).populate("hotel");

    if (!pkg) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(pkg);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to fetch package" });
  }
};

// Update Package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { place, day, placeDetails, price, hotelId, image: bodyImage } = req.body;

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    let imageUrl = packageData.image;

    if (req.file) {
      imageUrl = bufferToBase64(req.file);
    } else if (bodyImage) {
      imageUrl = bodyImage;
    }

    const updateFields = {
      place: place !== undefined ? place : packageData.place,
      day: day !== undefined ? Number(day) : packageData.day,
      placeDetails: placeDetails !== undefined ? placeDetails : packageData.placeDetails,
      price: price !== undefined ? Number(price) : packageData.price,
      image: imageUrl,
    };

    if ("hotelId" in req.body) {
      updateFields.hotel = req.body.hotelId || null;
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).populate("hotel", "name");

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update package" });
  }
};

// Delete Package
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    await Package.findByIdAndDelete(id);

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to delete package" });
  }
};

export default {
  addPackage,
  getPackage,
  getPackageById,
  updatePackage,
  deletePackage,
};
