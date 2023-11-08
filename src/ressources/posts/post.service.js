const { promise } = require("zod");
const Post = require("../../models/post");
const User = require("../../models/user");
const { jsonResponse } = require("../../utils/jsonResponse.util");
const logger = require("../../config/logger");

class PostService {

  async createPost(req, res) {
    const session = req.user
    if (session) {
      const { desc, img } = await req.body
      try {
        const post = new Post({
          userId: session.id,
          desc,
          img,
        });

        await post.save();
        return res.json(jsonResponse(post, 201));
      } catch (error) {
        console.log(error);
        return res.json(
          jsonResponse(undefined, 500, "Erreur de creation de service")
        );
      }
    } else {
      return res.json(
        jsonResponse("Vous devez vous connecter pour effectuer cette action", {
          status: 401,
        })
      );
    }
  }

  async updateById(req, res) {
    const session = req.user
    if (session) {
      try {
        const post = await Post.findByIdAndUpdate(req.params.id, {
          $set: req.body
        }, { new: true })

        return res.json(jsonResponse(JSON.stringify(post), { status: 201 }));
      } catch (error) {
        console.log(error);
        return res.json(
          jsonResponse("Erreur de creation de service", { status: 500 })
        );
      }
    } else {
      return res.json(
        jsonResponse("Vous devez vous connecter pour effectuer cette action", {
          status: 401,
        })
      );
    }
  }

  async deleteById(req, res) {
    const session = req.user;
    if (session) {
      try {
        await Post.findByIdAndDelete(req.params.id);
        return res.json(jsonResponse("Post supprimer avec success", { status: 200, }));
      } catch (error) {
        return res.json(jsonResponse("Internal Server Error", { status: 500 }))
      }
    } else {
      return res.json(jsonResponse("Vous devez vous connecter pour effectuer cette action", { status: 500 }))
    }
  }

  async likeById(req, res) {
    const session = req.user

    if (session) {
      try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(session.id)) {
          await post.updateOne({ $push: { likes: session.id } })
          return res.json(jsonResponse("The post has been liked", { status: 200 }));
        } else {
          await post.updateOne({ $pull: { likes: session.id } })
          return res.json(jsonResponse("The post has been disliked", { status: 200 }));
        }
      } catch (error) {
        return res.json(jsonResponse("Internal Server Error", { status: 500 }))
      }
    } else {
      return res.json(jsonResponse("Vous devez vous connecter pour effectuer cette action", { status: 500 }))
    }
  }

  async getById(req, res) {
    try {
      const post = await Post.findById(req.params.id)
      return res.json(jsonResponse(JSON.stringify(post), { status: 200 }));
    } catch (error) {
      return res.json(jsonResponse("Internal Server Error", { status: 500 }))
    }
  }

  async getTimeline(req, res) {
    const session = req.user
    if (session) {
      try {
        const currentUser = await User.findById(session.id)
        logger.info(session.id)

        const userPosts = await Post.find({ userId: currentUser._id });
        const friendsPosts = await Promise.all(
          currentUser.followings.map((friendId) => {
            return Post.find({ userId: friendId })
          })
        )
        return res.json(jsonResponse(JSON.stringify(userPosts.concat(...friendsPosts))))
      } catch (error) {
        return res.json(jsonResponse("Internal Server Error", { status: 500 }))
      }
    } else {
      return res.json(jsonResponse("Vous devez vous connecter pour effectuer cette action", { status: 500 }))
    }
  }
}


module.exports = PostService;
