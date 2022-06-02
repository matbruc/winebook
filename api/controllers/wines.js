import { winedata as Wine } from "../models/winedata.js";

const getWines = async (req, res) => {
  try {
    const wines = await Wine.find();
    res.json(wines);
  } catch (err) {
    res.json({ message: err });
  }
}

const getWine = async (req, res) => {
  try {
    const wine = await Wine.findById(req.params.id);
    res.json(wine);
  } catch (err) {
    res.json({ message: err });
  }
}

const createWine = async (req, res) => {
  const wine = new Wine({
    name: req.body.name,
    year: req.body.year,
    grapes: req.body.grapes,
    country: req.body.country,
    region: req.body.region,
    description: req.body.description,
    picture: req.body.picture,
    price: req.body.price,
    alcohol: req.body.alcohol,
  });
  try {
    const savedWine = await wine.save();
    res.json(savedWine);
  } catch (err) {
    res.json({ message: err });
  }
}

const updateWine = async (req, res) => {
  try {
    const wine = await Wine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(wine);
  } catch (err) {
    res.json({ message: err });
  }
}

const deleteWine = async (req, res) => {
  try {
    const removedWine = await Wine.deleteOne({ _id: req.params.id });
    res.json(removedWine);
  } catch (err) {
    res.json({ message: err });
  }
}

export default { getWines, getWine, createWine, updateWine, deleteWine };