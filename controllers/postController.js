const Post = require("../models/post");
const multer = require("multer");

// profile page
async function profile(req, res) {
  res.status(200).json({ message: "this is profile page" });
}

// fetching all posts
async function myPosts(req, res) {
  const posts = await Post.find({ postedBy: req.user.id }).populate(
    "postedBy",
    "username"
  );
  res.status(200).json({ posts });
}

// opening or selecting a post
async function onePost(req, res) {
  const post = await Post.findOne({ _id: req.params.id });
  res.status(200).json({ post });
}

//add a new post
async function newPost(req, res) {
  await new Post({
    title: req.body.title,
    image: `http://localhost:${process.env.PORT}/` + req.file.path,
    description: req.body.description,
    postedBy: req.user.id,
  }).save();
  res.status(200).json({ message: "Your post has been uploaded" });
}

//edit the post
async function editPost(req, res) {
  const post = await Post.findOne({ _id: req.params.id });
  if (req.user.id == post.postedBy) {
    await Post.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          image: `http://localhost:${process.env.PORT}/` + req.file.path,
          description: req.body.description,
        },
      }
    );
    res.status(200).json({ message: "Your post has been updated" });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to update someone's post" });
  }
}

//delete the post
async function deletePost(req, res) {
  const post = await Post.findOne({ _id: req.params.id });
  if (req.user.id === post.postedBy) {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Your post has been deleted" });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to delete someone's post" });
  }
}

module.exports = {
  profile,
  myPosts,
  onePost,
  newPost,
  editPost,
  deletePost,
};
