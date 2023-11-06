const User = require("../../models/user");
const { verifyPassword } = require("../../utils/auth.util");
const { hashPassword } = require("../../utils/auth.util");
const jwt = require("jsonwebtoken");
const { jsonResponse } = require("../../utils/jsonResponse.util");
require("dotenv").config();

class AuthService {

  //Create account
  async register(req, res, next) {
    const { username, email, password } = await req.body;

    try {

      const userExist = await User.findOne({ email });

      if (userExist) {
        console.log(jsonResponse("Erreur de serveur", { status: 500 }));
        return res.json(
          jsonResponse(
            JSON.stringify(undefined),
            { status: 400 },
            "user already exist"
          )
        );
      }


      const passhash = await hashPassword(password);

      const newUser = new User({
        username: username,
        email: email,
        password: passhash
      })

      const user = await newUser.save();

      return res.json(jsonResponse(JSON.stringify(user), { status: 201 }));

    } catch (error) {

      console.log(error);

      return res.json(jsonResponse("Erreur de serveur", { status: 500 }));
    }

  }

  //Login
  async oAuthLogin(req, res, next) {
    try {
      const { email, password } = await req.body

      const userLogin = await User.findOne({ email: email })

      if (!userLogin) {
        throw new Error("Erreur: utilisateur introuvable");
      }

      const isValid = await verifyPassword(password, userLogin.password);

      if (!isValid) {
        throw new Error("Erreur: Mot de passe incorrect");
      }

      const user = {
        id: userLogin._id,
        username: userLogin.username,
        email: userLogin.email,
        isAdmin: userLogin.isAdmin,
      };
      const token = jwt.sign(user, process.env.JWT_ACCESS_KEY, {
        expiresIn: "365d",
      });

      return res.json(
        jsonResponse(
          JSON.stringify({ ...user, token }),
          200,
          "User logged successfully"
        )
      );
    } catch (error) {
      return res.json(
        jsonResponse(JSON.stringify(undefined), 400, error.message)
      );
    }
  }


}

module.exports = AuthService;
