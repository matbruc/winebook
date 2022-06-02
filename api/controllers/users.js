import { userdata as User } from "../models/userdata.js";

// TODO: remove password from response
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
}

// TODO: remove password from response
// TODO: find by username
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
}

// TODO: encrypt password
const createUser = async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
    });
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({ message: err });
    }
}

// TODO: remove password from response
// TODO: find by username
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
}

// TODO: find by username
const deleteUser = async (req, res) => {
    try {
        const removedUser = await User.deleteOne({ _id: req.params.id });
        res.json(removedUser);
    } catch (err) {
        res.json({ message: err });
    }
}

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
}
