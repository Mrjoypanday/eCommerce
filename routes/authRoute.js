import express from "express";
import {
  loginController,
  registerController,
  testController,
  forgetPasswordControll,
  updateProfileController,
  orderController,
  allorderController,
  stautusAllorderController,
} from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerController);

router.post("/login", loginController);

//forget password
router.post("/forgot-password", forgetPasswordControll);

router.get("/test", requireSignIn, testController);

// protected rout user
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});
// protected rout Admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

router.get("/orders", requireSignIn, orderController);
//all orders
router.get("/all-orders", requireSignIn, isAdmin, allorderController);

//order stautus
router.put(
  "/status-orders/:orderId",
  requireSignIn,
  isAdmin,
  stautusAllorderController
);

export default router;
