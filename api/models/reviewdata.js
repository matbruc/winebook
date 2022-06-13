import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = Schema({
    user: {
        type: JSON,
    },
    wine: {
        type: JSON,
    },
    submitted_on: {
        type: Date,
        default: new Date(),
    },
    look_tone: {
        type: String,
    },
    look_intensity: {
        type: String,
    },
    nose: {
        type: String,
    },
    mouth: {
        type: String,
    },
    body: {
        type: Number,
    },
    balance: {
        type: Number,
    },
    acidity: {
        type: Number,
    },
    alcohol: {
        type: Number,
    },
    sweet: {
        type: Number,
    },
    remarks: {
        type: String,
    },
    rating: {
        type: Number,
    }
})

export const reviewdata = mongoose.model('review', reviewSchema);
