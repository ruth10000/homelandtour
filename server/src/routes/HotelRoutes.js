import express from "express";
import HotelController from "../controllers/HotelController.js";
import { handleArrayUpload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", handleArrayUpload, HotelController.addHotel);
router.get("/", HotelController.getHotels);
router.delete("/:id", HotelController.deleteHotel);

export default router;
