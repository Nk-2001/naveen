const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require("../models/model"); // Ensure this matches your model name
const requireLogin = require('../middlewares/requireLogin');

// to get user profile
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name"); // or more fields if needed

    return res.status(200).json({ user, posts });

  } catch (err) {
    console.error("Error fetching user or posts:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});


// to follow user
router.put('/follow', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.followId,
      { $push: { followers: req.user._id } },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $push: { following: req.body.followId } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});



// to Unfollow user
router.put('/unfollow', requireLogin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.body.followId,
      { $pull: { followers: req.user._id } },
      { new: true }
    );

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { following: req.body.followId } },
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    res.status(422).json({ error: err.message });
  }
});

// to upload profile pic 
// router.put('/uploadProfilePic', requireLogin, async (req, res) => {
//   const { pic } = req.body;

//   if (!pic) {
//     return res.status(400).json({ error: 'No picture provided' });
//   }

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       { $set: { photo: pic } }, // assuming your User model has a `photo` field
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res.json(updatedUser);
//   } catch (err) {
//     console.error('Error updating profile picture:', err);
//     res.status(500).json({ error: 'Server error while updating profile picture' });
//   }
// });

// routes/user.js

router.post('/uploadProfilePic', requireLogin, async (req, res) => {
  const { pic } = req.body;

  if (!pic) {
    return res.status(400).json({ error: 'No picture provided' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { photo: pic } }, // update photo field
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile picture updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ error: 'Server error while updating profile picture' });
  }
});



// routes/user.js

router.post('/uploadProfilePic', requireLogin, async (req, res) => {
  const { pic } = req.body;

  if (!pic) {
    return res.status(400).json({ error: 'No picture provided' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { photo: pic } }, // update photo field
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile picture updated successfully', user: updatedUser });
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ error: 'Server error while updating profile picture' });
  }
});




module.exports = router;
