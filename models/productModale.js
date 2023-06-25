import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    Ram: {
      type: String,
    },
    Camera: {
      type: String,
    },
    Battery: {
      type: String,
    },
    Processor: {
      type: String,
    },
    Warrrnty: {
      type: String,
    },
    Price: {
      type: Number,
      required: true,
    },
    Category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    Display: {
      type: String,
    },
    Replace: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    photo: {
      data: Buffer,
      contentType: String,
    },
    shipping: {
      type: Boolean,
    },
    storege: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Products", productSchema);
