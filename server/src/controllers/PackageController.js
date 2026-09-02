import Package from "../models/Package.js";

// Add Package
const addPackage = async (req, res) => {
  try {
    const { place, day, placeDetails, price, hotelId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

// Update Package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { place, day, placeDetails, price, hotelId } = req.body;

    const packageData = await Package.findById(id);

    if (!packageData) {
      return res.status(404).json({ message: "Package not found" });
    }

    let imageUrl = packageData.image;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updateFields = {
      place,
      day: Number(day),
      placeDetails,
      price: Number(price),
      image: imageUrl,
    };

    // Three-branch hotel logic:
    // hotelId present + non-empty  → set to ObjectId
    // hotelId present + empty ""   → null (remove hotel)
    // hotelId not in body at all   → leave existing hotel unchanged
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
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

export default {
  addPackage,
  getPackage,
  getPackageById,
  updatePackage,
  deletePackage,
};
