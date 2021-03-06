import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@description Auth user and get token
//@route POST /api/users/login
//@access Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      throw new Error("Invalid email or password!");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//@description Register a new user
//@route POST /api/users
//@access Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
};

//@description GET user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
    }
  } catch (error) {}
};

//@description Update user profile
//@route PUT /api/users/profile
//@access Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
      });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(404).send(error);
  }
};

//@description GET all users
//@route GET /api/users
//@access Private/Admin
const getUsers = async (req, res) => {
  try {
    // console.log("Request", req);
    const users = await User.find({});
    res.json(users);
  } catch (error) {}
};

//@description Delete user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser = async (req, res) => {
  try {
    // console.log("Request", req);
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      throw new Error("User not Found");
    }
  } catch (error) {
    res.send(error);
  }
};

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
};
