import mongoose from "mongoose";
const { Schema } = mongoose;

const reviewSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
    wine: {
        type: Schema.Types.ObjectId,
        ref: 'wine',
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
