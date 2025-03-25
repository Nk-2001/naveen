
const express = require('express');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const Post = require('../models/post'); 
const { schema } = require('../models/model');
const router = express.Router();

// Route
router.get('/allposts',requireLogin,(req,res)=>{
    Post.find() 
    .populate("postedBy","_id name photo")
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts=>{res.json({posts})})
    .catch(err=>{console.log(err)})
})

router.post('/createPost', requireLogin, async (req, res) => {
    try {
        const {body , pic } = req.body;
        console.log(pic)
        if (!body || !pic) {
            return res.status(422).json({ error: "Please add all the fields" });
        }
        
        console.log(req.user); 
        const newPost = new Post({ 
            body,
            photo:pic,
            postedBy: req.user
        });

        const savedPost = await newPost.save();
        return res.json({ post: savedPost });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/myPosts',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name") 
    // .populate("comment.postedBy", "_id name")
    .sort("-createdAt")
    .then(myPosts=>{res.json(myPosts)})
})

router.put('/like', requireLogin, async (req, res) => {
    try {
      const result = await Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.user._id } },
        { new: true }
      ).populate("postedBy","_id name photo")
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });
  
router.put('/unlike', requireLogin, async (req, res) => {
    try {
      const result = await Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.user._id } },
        { new: true }
      ).populate("postedBy","_id name photo")
      res.json(result);
    } catch (err) {
      res.status(422).json({ error: err.message });
    }
  });
  
router.post("/comment", requireLogin, async (req, res) => {
  const { text, postId } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: "Comment cannot be empty" });

  const comment = {
    comment: text,
    postedBy: req.user._id,
  };

  try {
    console.log("Post ID:", postId);
    console.log("Comment text:", text);
  
    const result = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("postedBy", "_id name photo")
      .populate("comments.postedBy", "_id name photo");
  
    console.log("Updated Post:", result);  // Check this
    res.json(result);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(422).json({ error: err.message });
  }
  
});





//Api to delete post
router.delete("/deletePost/:postID", requireLogin, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.postID }).populate("postedBy", "_id");

    if (!post) {
      return res.status(422).json({ error: "Post not found" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully", post });

  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/myfollowingpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then(posts => {
      res.json({ posts });
    })
    .catch(err => {
      console.error("Error fetching following posts:", err);
      res.status(500).json({ error: "Something went wrong" });
    });
});





module.exports = router;
