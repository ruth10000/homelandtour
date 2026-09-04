import express from "express";
import tourController from "../controllers/TourController.js";
import { handleSingleUpload } from "../middleware/upload.js";

const router = express.Router();

// Routes
router.post("/", handleSingleUpload, tourController.addTour);
router.get("/", tourController.getTours);
router.put("/:id", handleSingleUpload, tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

export default router;