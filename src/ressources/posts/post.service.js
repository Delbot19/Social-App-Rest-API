const { promise } = require("zod");
const Post = require("../../models/post");
const User = require("../../models/user");
const { jsonResponse } = require("../../utils/jsonResponse.util");

class PostService {

  async createPost(req, res) {
    const session = req.user
    if (session) {
      try {
        const post = new Post(req.body);

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
        const post = await Post.findByIdAndDelete(req.params.id, {
          $set: req.body
        })

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

    try {
      if (!session) {
        throw new Error(
          "Vous devez vous connecter pour effectuer cette operation"
        );
      }
      const post = await Post.findByIdAndDelete(req.params.id);
      return res.json(
        jsonResponse("Post supprimer avec success", {
          status: 200,
        })
      );
    } catch (error) {
      return res.json(jsonResponse("Vous devez vous connecter pour effectuer cette action", { status: 500 }));
    }
  }

  async likeById(req, res) {
    const session = req.user

    if (session) {
      try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
          await post.updateOne({ $push: { likes: req.body.userId } })
          return res.json(jsonResponse("The post has been liked", { status: 200 }));
        } else {
          await post.updateOne({ $pull: { likes: req.body.userId } })
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
    let postArray = [];
    try {
      const currentUser = await User.findById(req.body.userId)
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
  }
}


module.exports = PostService;
