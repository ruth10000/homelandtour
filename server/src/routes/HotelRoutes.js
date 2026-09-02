import express from "express";
import multer from "multer";
import path from "path";
import HotelController from "../controllers/HotelController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + Math.round(Math.random() * 1e6) + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// upload.array("images", 4) — field name "images", max 4 files
router.post("/", upload.array("images", 4), HotelController.addHotel);
router.get("/", HotelController.getHotels);

export default router;
