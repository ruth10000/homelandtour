import express from "express";
import multer from "multer";
import path from "path";
import tourController from "../controllers/TourController.js";

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), tourController.addTour);
router.get("/", tourController.getTours);
router.put("/:id", upload.single("image"), tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

export default router;