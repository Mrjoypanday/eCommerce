import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";
import {
  createBanar,
  deleteBanner,
  gateBanner,
  gateBannerPhoto,
} from "../controllers/bannerControler.js";
const router = express.Router();

// routes
router.post(
  "/create-banner",
  requireSignIn,
  isAdmin,
  formidable(),
  createBanar
);
router.get("/get-bannerphoto/:pid", gateBannerPhoto);
router.get("/get-banner", gateBanner);
router.delete("/delete-banner/:pid", deleteBanner);
export default router;
