import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: true,
    },
    placeDetails: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Tour = mongoose.model("Tour", tourSchema);

export default Tour;