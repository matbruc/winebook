import { producerdata as Producer } from "../models/producerdata.js";

const getProducers = async (req, res) => {
  try {
    const producers = await Producer.find();
    res.json(producers);
  } catch (err) {
    res.json({ message: err });
  }
}

const getProducer = async (req, res) => {
  const notFoundMessage = "Producer not found";
  try {
    const producer = await Producer.findById(req.params.id);
    producer ? res.json(producer) : res.status(404).json({ message: notFoundMessage });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        message: notFoundMessage
      });
    }
    return res.status(500).json({
      message: "Error retrieving producer with id " + req.params.id
    });
  }
}

const createProducer = async (req, res) => {
  const producer = new Producer({
    name: req.body.name,
    region: req.body.region,
    registered_on: req.body.registered_on,
  });
  try {
    const savedProducer = await producer.save();
    res.json(savedProducer);
  } catch (err) {
    res.json({ message: err });
  }
}

const updateProducer = async (req, res) => {
  try {
    const producer = await Producer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(producer);
  } catch (err) {
    res.json({ message: err });
  }
}

const deleteProducer = async (req, res) => {
  try {
    const removedProducer = await Producer.deleteOne({ _id: req.params.id });
    res.json(removedProducer);
  } catch (err) {
    res.json({ message: err });
  }
}

export default {
    getProducers,   // get all producers
    getProducer,    // get a producer
    createProducer, // create a producer
    updateProducer, // update a producer
    deleteProducer, // delete a producer
}