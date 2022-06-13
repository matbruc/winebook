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
  const notFoundMessage = "User not found";
  try {
    const user = await User.findById(req.params.id).select("-password");
    user ? res.json(user) : res.status(404).json({ message: notFoundMessage });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).json({
        message: notFoundMessage
      });
    }
    return res.status(500).json({
      message: "Error retrieving user with id " + req.params.id
    });
  }
}

const createUser = async (req, res) => {

    const { name, email, password } = req.body;

    const role = req.body.role || "user";

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
      role,
    });

    // save user token
    user.token = jwt.sign(
      {user_id: user._id, email, role},
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    res.status(201).json({id: user._id, name: user.name, email: user.email, token: user.token, role: user.role});
}

const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
}

const deleteUser = async (req, res) => {
    try {
        const removedUser = await User.deleteOne({ _id: req.params.id });
        res.json(removedUser);
    } catch (err) {
        res.json({ message: err });
    }
}

const login = async (req, res) => {
  try {
    const {email, password} = req.body;
    if (!(email && password)) {
      return res.status(400).json({message: "All inputs are required"});
    }

    // check if user exists
    const user = await User.findOne({email});

    if (user && (await bcrypt.compare(password, user.password))) {
      // save user token
      user.token = jwt.sign(
        {user_id: user._id, email, role: user.role},
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      return res.status(200).json({email: user.email, token: user.token, role: user.role});
    }
    res.status(400).json({message: "Invalid Credentials"});
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }

}

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    login,
}
