const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    username: { type: String },
    comment: { type: String },
    commentedBy: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);

const postSchema = new Schema(
  {
    title: { type: String },
    image: { type: String },
    description: { type: String },
    postedBy: { type: Schema.Types.ObjectId, ref: "user" },
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Post = mongoose.model("post", postSchema);

module.exports = Post;
