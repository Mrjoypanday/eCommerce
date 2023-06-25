import mongoose from "mongoose";

const bannner = mongoose.Schema({
  name: {
    type: String,
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
});
export default mongoose.model("banner", bannner);
