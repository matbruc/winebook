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
        type: Date,
    },
    producer: {
        type: Schema.Types.ObjectId,
        ref: 'producer',
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
})

export const winedata = mongoose.model('wine', wineSchema);
