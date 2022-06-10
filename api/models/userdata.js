import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = Schema({
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
    token: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
    }
})

export const userdata = mongoose.model('user', userSchema);
