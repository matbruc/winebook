import mongoose from "mongoose";
const { Schema } = mongoose;

const producerSchema = Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    region: {
        type: String,
    },
    registered_on: {
        type: Date,
        default: new Date(),
    },
})

export const producerdata = mongoose.model('producer', producerSchema);
