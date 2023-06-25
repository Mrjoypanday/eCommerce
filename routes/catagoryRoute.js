import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createCategoryController,
  deletCategory,
  getAllCategorry,
  getSingelCategory,
  updateCategory,
} from "./../controllers/categoryControl.js";
const router = express.Router();

//router

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);
//update

router.put("/update-category/:id", requireSignIn, isAdmin, updateCategory);

//all category

router.get("/get-category", getAllCategorry);

// singel category

router.get("/singel-category/:slug", getSingelCategory);

//delet
router.delete("/delete-category/:id", requireSignIn, isAdmin, deletCategory);
export default router;
