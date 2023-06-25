import productModale from "../models/productModale.js";
import CatagoryModel from "../models/CatagoryModel.js";
import oderModel from "../models/oderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";

import dotenv from "dotenv";

dotenv.config();

//payment getwaya
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});
export const createproductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      Ram,
      Camera,
      Battery,
      Processor,
      Warrrnty,
      Price,
      Category,
      description,
      Display,
      Replace,
      quantity,
      shipping,
      storege,
    } = req.fields;
    const { photo } = req.files;
    //validesion
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !Price:
        return res.status(500).send({ error: "Price is required" });
      case !Category:
        return res.status(500).send({ error: "Category is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 10000000:
        return res
          .status(500)
          .send({ error: "Photo is required sud be 10 mb" });
    }
    const products = new productModale({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "product created Successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in createing product",
    });
  }
};
//get product
export const gttProductController = async (req, res) => {
  try {
    const product = await productModale
      .find({})
      .select("-photo")
      .populate("Category")
      .limit(30)
      .sort({ createAt: -1 });
    res.status(200).send({
      success: true,
      message: "get all product",
      product,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "cudnot get product",
      error,
    });
  }
};
//singel product
export const gttSingelProductController = async (req, res) => {
  try {
    const product = await productModale
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("Category");
    res.status(200).send({
      success: true,
      message: "success get singel Product",
      product,
    });
  } catch (error) {
    req.status(404).send({
      success: false,
      message: "Error get singel product",
      error,
    });
  }
};
//get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModale
      .findById(req.params.pid)
      .select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "Error in get photo",
      error,
    });
  }
};
//delete product
export const productDeleteController = async (req, res) => {
  try {
    await productModale.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product delete Successfully",
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "product dusnot Delete",
    });
  }
};
//update product
export const upDateproductController = async (req, res) => {
  try {
    const {
      name,
      slug,
      Ram,
      Camera,
      Battery,
      Processor,
      Warrrnty,
      Price,
      Category,
      description,
      Display,
      Replace,
      quantity,
      shipping,
    } = req.fields;
    const { photo } = req.files;
    //validesion
    switch (true) {
      case !name:
        return res.status(500).send({ error: "name is required" });
      case !Price:
        return res.status(500).send({ error: "Price is required" });
      case !Category:
        return res.status(500).send({ error: "Category is required" });
      case !description:
        return res.status(500).send({ error: "description is required" });
      case !quantity:
        return res.status(500).send({ error: "quantity is required" });
      case photo && photo.size > 10000000:
        return res
          .status(500)
          .send({ error: "Photo is required sud be 10 mb" });
    }
    const products = await productModale.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "product Update Successfully",
      products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in update product",
    });
  }
};
//search Product
export const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModale
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "cudNot Get api",
      error,
    });
  }
};
//releted product
export const reletedProduct = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const product = await productModale
      .find({ Category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(20)
      .populate("Category");
    res.status(200).send({
      success: true,
      product,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "product cud not get",
      error,
    });
  }
};
//category controller
export const productCategoryController = async (req, res) => {
  try {
    const Category = await CatagoryModel.findOne({ slug: req.params.slug });
    const products = await productModale
      .find({ Category })
      .populate("Category");

    res.status(200).send({
      success: true,
      Category,
      products,
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: "product not found",
      error,
    });
  }
};
//payment getwaya controller

export const braintreeTokenRouter = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {}
};

//payment
export const brainrteePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.Price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new oderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {}
};
