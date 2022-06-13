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
  const notFoundMessage = "Wine not found";
  try {
    const wine = await Wine.findById(req.params.id);
    wine ? res.json(wine) : res.status(404).json({ message: notFoundMessage });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        message: notFoundMessage
      });
    }
    return res.status(500).json({
      message: "Error retrieving wine with id " + req.params.id
    });
  }
}

const createWine = async (req, res) => {
  const wine = new Wine({
    name: req.body.name,
    variety: req.body.variety,
    year: req.body.year,
    country: req.body.country,
    region: req.body.region,
    subregion: req.body.subregion,
    producer: req.body.producer,
    review: req.body.review,
    rating: req.body.rating
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