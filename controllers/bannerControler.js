import bannerModel from "../models/bannerModel.js";
import fs from "fs";

export const createBanar = async (req, res) => {
  try {
    const { name } = req.fields;
    const { photo } = req.files;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case photo && photo.size > 10000000:
        return res
          .status(500)
          .send({ error: "Photo is required sud be 10 mb" });
    }
    const products = new bannerModel({ ...req.fields });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "baner uplod ed",
    });
  } catch (error) {
    console.log(error);
  }
};

export const gateBanner = async (req, res) => {
  try {
    const bannear = await bannerModel.find({}).limit(5);
    res.status(200).send({
      success: true,
      message: "banner get success fully",
      bannear,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "banner did not get",
    });
  }
};
// delete banar
export const deleteBanner = async (req, res) => {
  try {
    await bannerModel.findByIdAndDelete(req.params.pid);
    res.status(201).send({
      success: true,
      message: "banner is deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "banner cud not delete",
    });
  }
};
//get banner photo
export const gateBannerPhoto = async (req, res) => {
  try {
    const product = await bannerModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error in get photo",
      error,
    });
  }
};
