import { reviewdata as Review } from "../models/reviewdata.js";

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.json({ message: err });
  }
}

const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    res.json(review);
  } catch (err) {
    res.json({ message: err });
  }
}

const createReview = async (req, res) => {
  const review = new Review({
    username: req.body.username,
    wine: req.body.wine,
    look_tone: req.body.look_tone,
    look_intensity: req.body.look_intensity,
    nose: req.body.nose,
    mouth: req.body.mouth,
    body: req.body.body,
    balance: req.body.balance,
    acidity: req.body.acidity,
    alcohol: req.body.alcohol,
    sweet: req.body.sweet,
    remarks: req.body.remarks,
    rating: req.body.rating,
  });
  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (err) {
    res.json({ message: err });
  }
}

const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(review);
  } catch (err) {
    res.json({ message: err });
  }
}

const deleteReview = async (req, res) => {
  try {
    const removedReview = await Review.deleteOne({ _id: req.params.id });
    res.json(removedReview);
  } catch (err) {
    res.json({ message: err });
  }
}

export default { getReviews, getReview, createReview, updateReview, deleteReview };