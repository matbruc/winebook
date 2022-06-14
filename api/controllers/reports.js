import { winedata as Wine } from "../models/winedata.js";
import { producerdata as Producer } from "../models/producerdata.js";


const getWinesPerProducer = async (req, res) => {

  try {
    const report = await Wine.aggregate([
      { $group: { _id: "$producer", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(report);
  } catch (err) {
    res.json({ message: err });
  }

}

const getWinesPerRegion = async (req, res) => {

  try {
    const report = await Wine.aggregate([
      { $group: { _id: "$region", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(report);
  } catch (err) {
    res.json({ message: err });
  }
}

const getWinesPerSubregion = async (req, res) => {

  try {
    const report = await Wine.aggregate([
      { $group: { _id: "$subregion", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(report);
  } catch (err) {
    res.json({ message: err });
  }
}

const getTopWines = async (req, res) => {

  try {
    const report = await Wine.find({})
      .select('name rating -_id')
      .sort([['rating', -1]])
      .limit(10);
    res.json(report);
  } catch (err) {
    res.json({ message: err });
  }
}

export default {
  getWinesPerProducer,
  getWinesPerRegion,
  getWinesPerSubregion,
  getTopWines
}
