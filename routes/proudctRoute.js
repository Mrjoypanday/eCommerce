import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  brainrteePaymentController,
  braintreeTokenRouter,
  createproductController,
  gttProductController,
  gttSingelProductController,
  productCategoryController,
  productDeleteController,
  productPhotoController,
  reletedProduct,
  searchProduct,
  upDateproductController,
} from "../controllers/productControll.js";
import formidable from "express-formidable";

const router = express.Router();

// routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createproductController
);
// update
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  upDateproductController
);

// get product
router.get("/get-product", gttProductController);
//singel product
router.get("/get-product/:slug", gttSingelProductController);

//get photo
router.get("/product-photo/:pid", productPhotoController);
//delet product
router.delete("/delete-product/:pid", productDeleteController);
//search product
router.get("/search/:keyword", searchProduct);
//similer product
router.get("/releted-product/:pid/:cid", reletedProduct);

// category controller
router.get("/product-category/:slug", productCategoryController);

//peyment token route
router.get("/braintree/token", braintreeTokenRouter);

// payment Route
router.post("/braintree/payment", requireSignIn, brainrteePaymentController);

export default router;
