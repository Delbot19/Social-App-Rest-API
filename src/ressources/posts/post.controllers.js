const { Router } = require("express");
const postService = require("./post.service");
const {
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
} = require("./post.validator");
const verifyUser = require("../../middleware/verifyUser");
const zodValidator = require("../../middleware/zod.middleware");

class PostController {
  path = "/posts";
  router = Router();
  postService = new postService();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {

    //create a post
    this.router.post(
      `${this.path}/`,
      zodValidator(createPost),
      verifyUser,
      this.postService.createPost
    )

    //update a post
    this.router.put(
      `${this.path}/:id`,
      zodValidator(updatePost),
      verifyUser,
      this.postService.updateById
    )

    //delete a post
    this.router.delete(
      `${this.path}/:id`,
      zodValidator(deletePost),
      verifyUser,
      this.postService.deleteById
    )

    //like a post
    this.router.put(
      `${this.path}/:id/like/`,
      zodValidator(likePost),
      verifyUser,
      this.postService.likeById
    )

    //get a post
    this.router.get(
      `${this.path}/:id`,
      zodValidator(getPost),
      this.postService.getById
    )

    //get timeline post
    this.router.get(
      `${this.path}/timeline`,
      this.postService.getTimeline
    )
  }
}

module.exports = { PostController };
