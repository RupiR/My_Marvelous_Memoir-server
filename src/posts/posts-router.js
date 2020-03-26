const express = require("express");
const path = require("path");
const PostsService = require("./posts-service");
const { requireAuth } = require("../middleware/jwt-auth");

const postsRouter = express.Router();
const jsonBodyParser = express.json();

postsRouter.route("/").get((req, res, next) => {
  PostsService.getAllPosts(req.app.get("db"))
    .then(posts => {
      res.json(posts.map(PostsService.serializePost));
    })
    .catch(next);
})

  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { title, summary, type } = req.body;
    const newPost = { title, summary, posttype: type };

    for (const [key, value] of Object.entries(newPost))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newPost.author_id = req.user.id;

    PostsService.insertPost(req.app.get("db"), newPost)
      .then(post => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(PostsService.serializePost(post));
      })
      .catch(next);
  });

postsRouter
  .route("/:post_id")
  .all(requireAuth)
  .all(checkPostExists)
  .get((req, res) => {
    res.json(PostsService.serializePost(res.post));
  })

  .delete((req, res) => {
    PostsService.deletePost(req.app.get("db"), req.params.post_id)
      .then(r => res.send("Post was deleted"));
  })

  .put(requireAuth, jsonBodyParser, (req, res, next) => {
    const { title, summary, type } = req.body;
    const newPost = { title, summary, posttype: type };

    for (const [key, value] of Object.entries(newPost))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        });

    newPost.author_id = req.user.id;

    PostsService.updatePost(req.app.get("db"), newPost, req.params.post_id)
      .then(post => {
        res
          .status(200)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(PostsService.serializePost(post));
      })
      .catch(next);
  });

postsRouter
  .route("/:post_id/comments/")
  .all(requireAuth)
  .all(checkPostExists)
  .get((req, res, next) => {
    PostsService.getCommentsForPost(req.app.get("db"), req.params.post_id)
      .then(comments => {
        res.json(comments.map(PostsService.serializePostComment));
      })
      .catch(next);
  });

/* async/await syntax for promises */
async function checkPostExists(req, res, next) {
  try {
    const post = await PostsService.getById(
      req.app.get("db"),
      req.params.post_id
    );

    if (!post)
      return res.status(404).json({
        error: `Post doesn't exist`
      });

    res.post = post;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = postsRouter;
