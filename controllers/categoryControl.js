import CatagoryModel from "../models/CatagoryModel.js";
import slugify from "slugify";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    const existingCategory = await CatagoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category is allready Exisits",
      });
    }
    const category = await new CatagoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "Category Created",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Error in Category",
    });
  }
};

//update
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const category = await CatagoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "category Updated",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error update category",
      error,
    });
  }
};

//all category

export const getAllCategorry = async (req, res) => {
  try {
    const category = await CatagoryModel.find({});
    res.status(200).send({
      success: true,
      message: "get all category",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Error will all category",
      error,
    });
  }
};
//sigel category
export const getSingelCategory = async (req, res) => {
  try {
    const category = await CatagoryModel.findOne({ slug: req.params.slug });
    res.status(200).send({
      success: true,
      message: "Singel category get",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Category dusnot Exjit",
      error,
    });
  }
};
//delet
export const deletCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await CatagoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: "Cudnot Delete category",
    });
  }
};
