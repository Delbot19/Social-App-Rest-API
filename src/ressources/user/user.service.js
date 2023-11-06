const User = require("../../models/user");
const { hashPassword } = require("../../utils/auth.util");
const { jsonResponse } = require("../../utils/jsonResponse.util");

class UserService {

  //update user
  async updateById(req, res, next) {
    const session = req.user;

    if (session) {
      if (req.body.password) {
        try {
          req.body.password = hashPassword(req.body.password)
        } catch (error) {
          return res.json(jsonResponse("Erreur de serveur", { status: 500 }))
        }
      }

      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body
        })
        return res.json(
          jsonResponse(
            JSON.stringify(user),
            200,
            "Account has been update"
          )
        );
      } catch (error) {
        return res.json(jsonResponse("Erreur de serveur", { status: 500 }))
      }
    } else {
      return res.json(jsonResponse(undefined, { status: 403 }, "You can only update your account"))
    }
  }

  //delete user
  async deleteById(req, res, next) {
    const session = req.user;
    if (session) {
      try {
        await User.findByIdAndDelete(req.params.id);
        return res.json(jsonResponse(undefined, { status: 200 }, "Account has been deleted!"))
      } catch (err) {
        return res.json(jsonResponse("Internal Server Error", { status: 500 }))
      }
    } else {
      return res.json(jsonResponse("You can only delete your account", { status: 403 }))
    }
  }

  //get a user
  async getById(req, res, next) {
    try {
      const user = await User.findById(req.params.id)
      const { password, updatedat, ...other } = user._doc
      return res.json(jsonResponse(other, { status: 200 }))
    } catch (error) {
      return res.json(jsonResponse("Internal Server Error", { status: 500 }))
    }
  }

  //follow a user
  async followById(req, res) {
    const session = req.user

    if (session) {
      if (session.id != req.params.id) {
        try {
          const user = User.findById(req.params.id)
          const currentUser = User.findById(session.id)

          if (!user.followers.includes(session.id)) {
            await user.updateOne({ $push: { followers: session.id } })
            await currentUser.updateOne({ $push: { followings: req.params.id } })
            return res.json(jsonResponse("User has been followed", { status: 200 }))
          } else {
            res.json(jsonResponse("You already follow this user", { status: 403 }))
          }

        } catch (error) {
          return res.json(jsonResponse("Internal Server Error", { status: 500 }))
        }
      } else {
        return res.json(jsonResponse("You can't follow yourself", { status: 403 }))
      }
    } else {
      return res.json(jsonResponse("Internal server error", { status: 500 }))
    }
  }

  //unfollow a user
  async unfollowById(req, res) {
    const session = req.user

    if (session) {
      if (session.id != req.params.id) {
        try {
          const user = User.findById(req.params.id)
          const currentUser = User.findById(session.id)

          if (user.followers.includes(session.id)) {
            await user.updateOne({ $pull: { followers: session.id } })
            await currentUser.updateOne({ $pull: { followings: req.params.id } })
            return res.json(jsonResponse("User has been unfollowed", { status: 200 }))

          } else {
            res.json(jsonResponse("You don't follow this user", { status: 403 }))
          }

        } catch (error) {
          return res.json(jsonResponse("Internal Server Error", { status: 500 }))
        }
      } else {
        return res.json(jsonResponse("You can't unfollow yourself", { status: 403 }))
      }
    } else {
      return res.json(jsonResponse("Internal server error", { status: 500 }))
    }
  }

}

module.exports = UserService;
