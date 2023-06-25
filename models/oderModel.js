import mongoose from "mongoose";
import { Schema } from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shiping", "Deliverd", "Canel"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);
