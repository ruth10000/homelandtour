import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    place: {
      type: String,
      required: true,
    },
    day: {
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
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;