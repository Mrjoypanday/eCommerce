import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import oderModel from "../models/oderModel.js";
export const registerController = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      answer,
      landMark,
      village,
      pin,
    } = req.body;
    if (!name) {
      return res.send({ message: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }
    const exisitingUser = await userModel.findOne({ email });
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please Login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const users = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
      landMark,
      village,
      pin,
    }).save();
    res.status(201).send({
      success: true,
      message: "User registion success",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erroe in Registeration",
      error,
    });
  }
};
//login control

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const users = await userModel.findOne({ email });
    if (!users) {
      return res.status(404).send({
        success: false,
        message: "Email not registerd",
      });
    }
    const match = await comparePassword(password, users.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    //token
    const token = await JWT.sign({ _id: users._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      users: {
        name: users.name,
        email: users.email,
        phone: users.phone,
        address: users.address,
        role: users.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};
//forgetPasswordControll
export const forgetPasswordControll = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New password is required" });
    }
    //check
    const users = await userModel.findOne({ email, answer });
    if (!users) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(users._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "password updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Somthing went Wrong",
      error,
    });
  }
};
// test controller
export const testController = (req, res) => {
  res.send("proted rought");
};
//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone, village, pin, landMark } =
      req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
        landMark: landMark || user.landMark,
        village: village || user.village,
        pin: pin || user.pin,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};
// order controller
export const orderController = async (req, res) => {
  try {
    const order = await oderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "cud Not get Orders",
      error,
    });
  }
};
export const allorderController = async (req, res) => {
  try {
    const order = await oderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "phone")

      .sort({ createdAt: "-1" });
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "cud Not get Orders",
      error,
    });
  }
};
//stautus oder
export const stautusAllorderController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await oderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Cud not change stautus",
      error,
    });
  }
};
