import mongoose from "mongoose";
const { Schema } = mongoose;

const wineSchema = Schema({
    name: {
      type: String,
    },
    variety: {
      type: String,
    },
    year: {
      type: Number,
    },
    producer: {
        type: JSON,
    },
    region: {
        type: String,
    },
    subregion: {
        type: String,
    },
    country: {
        type: String,
    },
    review: {
        type: String,
    },
    rating: {
        type: Number,
    }
})

export const winedata = mongoose.model('wine', wineSchema);
