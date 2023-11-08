const { Router } = require("express");
const userService = require("./user.service");
const {
  updateUser,
  deleteUser,
  getUser,
  followUser,
  unfollowUser
} = require("./user.validator");
const verifyUser = require("../../middleware/verifyUser");
const zodValidator = require("../../middleware/zod.middleware");
const { checkAuthAndRevocation, addRevokedToken } = require("../../middleware/revokedToken");

class UserController {
  path = "/users";
  router = Router();
  userService = new userService();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    //update user
    this.router.put(
      `${this.path}`,
      zodValidator(updateUser),
      verifyUser,
      checkAuthAndRevocation,
      this.userService.updateById
    );

    //delete user
    this.router.delete(
      `${this.path}`,
      verifyUser,
      checkAuthAndRevocation,
      this.userService.deleteById
    );

    //get user
    this.router.get(
      `${this.path}/:id`,
      zodValidator(getUser),
      this.userService.getById
    );

    //follow user
    this.router.put(
      `${this.path}/:id/follow/`,
      zodValidator(followUser),
      verifyUser,
      checkAuthAndRevocation,
      this.userService.followById
    );

    //unfollow user
    this.router.put(
      `${this.path}/:id/unfollow/`,
      zodValidator(unfollowUser),
      verifyUser,
      checkAuthAndRevocation,
      this.userService.unfollowById
    );
  }
}

module.exports = { UserController };
