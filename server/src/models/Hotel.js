import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length >= 1 && arr.length <= 4,
        message: "A hotel must have between 1 and 4 images.",
      },
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
