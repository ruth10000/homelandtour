import express from "express";
import multer from "multer";
import path from "path";
import PackageController from "../controllers/PackageController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), PackageController.addPackage);
router.get("/", PackageController.getPackage);
router.get("/:id", PackageController.getPackageById);
router.put("/:id", upload.single("image"), PackageController.updatePackage);
router.delete("/:id", PackageController.deletePackage);
export default router;