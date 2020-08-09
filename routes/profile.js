const profileRouter = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, new Date().toDateString() + "_" + file.originalname);
  },
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

const upload = multer({ storage, fileFilter });

const postController = require("../controllers/postController");
const route = require("../middlewares/accessRoute");

profileRouter.get("/", route.protect, postController.profile);

profileRouter.get("/my-posts", route.protect, postController.myPosts);

profileRouter.get("/post/:id", route.protect, postController.onePost);

profileRouter.post(
  "/create-post",
  route.protect,
  upload.single("image"),
  postController.newPost
);

profileRouter.put(
  "/edit-post/:id",
  route.protect,
  upload.single("image"),
  postController.editPost
);

profileRouter.delete(
  "/delete-post/:id",
  route.protect,
  postController.deletePost
);

module.exports = profileRouter;
