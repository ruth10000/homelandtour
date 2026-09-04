import express from "express";
import PackageController from "../controllers/PackageController.js";
import { handleSingleUpload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", handleSingleUpload, PackageController.addPackage);
router.get("/", PackageController.getPackage);
router.get("/:id", PackageController.getPackageById);
router.put("/:id", handleSingleUpload, PackageController.updatePackage);
router.delete("/:id", PackageController.deletePackage);

export default router;