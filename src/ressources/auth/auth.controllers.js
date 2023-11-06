const { Router } = require("express");
const authService = require("./auth.service");
const {
  createUser,
  login,
} = require("./auth.validator");
const zodValidator = require("../../middleware/zod.middleware");

class AuthController {
  path = "/auth";
  router = Router();
  authService = new authService();
  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {

    //create a user
    this.router.post(
      `${this.path}/register/`,
      zodValidator(createUser),
      this.authService.register
    );

    //login
    this.router.post(
      `${this.path}/login/`,
      zodValidator(login),
      this.authService.oAuthLogin
    );
  }
}

module.exports = { AuthController };
