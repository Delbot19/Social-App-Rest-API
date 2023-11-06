require('dotenv').config();
const App = require("./app");
const { AuthController } = require('./ressources/auth/auth.controllers');
const { PostController } = require('./ressources/posts/post.controllers');
const { UserController } = require('./ressources/user/user.controllers');



const app = new App(
  [
    new AuthController,
    new UserController,
    new PostController,
  ],
  8000
);

app.listen();
