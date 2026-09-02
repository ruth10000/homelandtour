import Tour from "../models/Tour.js";

// Add Tour
const addTour = async (req, res) => {
  try {
    const { place, placeDetails, price } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const newTour = new Tour({
      place,
      placeDetails,
      price: Number(price),
      image: imageUrl,
    });

    const savedTour = await newTour.save();
    res.status(201).json(savedTour);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All / Search Tours
const getTours = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    // Filter by place or placeDetails if search query parameter exists
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
    res.status(500).json({ message: error.message });
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

    // Update image only if a new file is uploaded
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        place,
        placeDetails,
        price: Number(price),
        image: imageUrl,
      },
      { new: true }
    );

    res.status(200).json(updatedTour);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    res.status(500).json({ message: error.message });
  }
};

export default {
  addTour,
  getTours,
  updateTour,
  deleteTour,
};