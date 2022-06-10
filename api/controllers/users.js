import {userdata as User} from "../models/userdata.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.json({ message: err });
  }
}

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    res.json({ message: err });
  }
}

const createUser = async (req, res) => {

    const { name, email, password } = req.body;

    if (!(email && password && name)) {
      return res.status(400).json({message: "All inputs are required"});
    }

    // check if user already exist
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).json({message: "User Already Exist. Please Login"});
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    // save user token
    user.token = jwt.sign(
      {user_id: user._id, email},
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({id: user._id, name: user.name, email: user.email, token: user.token});
}

// TODO: remove password from response
// TODO: find by username
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
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

const login = async (req, res) => {
  const {email, password} = req.body;

  if (!(email && password)) {
    return res.status(400).json({message: "All inputs are required"});
  }

  // check if user exists
  const user = await User.findOne({email});

  if (user && (await bcrypt.compare(password, user.password))) {
    // save user token
    user.token = jwt.sign(
      {user_id: user._id, email},
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({email: user.email, token: user.token});
  }
  res.status(400).json({message: "Invalid Credentials"});
}

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    login,
}
