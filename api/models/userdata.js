import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    registered_on: {
        type: Date,
        default: new Date(),
    },
})

export const userdata = mongoose.model('user', userSchema);
