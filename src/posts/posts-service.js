const xss = require("xss");

const PostsService = {
  getAllPosts(db) {
    return db
      .from("memoir_posts AS art")
      .select(
        "art.id",
        "art.title",
        "art.date_created",
        "art.posttype",
        "art.summary",
        db.raw(`count(DISTINCT comm) AS number_of_comments`),
        db.raw(
          `json_strip_nulls(
            json_build_object(
              'id', usr.id,
              'username', usr.username,
              'full_name', usr.full_name,
              'nickname', usr.nickname,
              'date_created', usr.date_created,
              'date_modified', usr.date_modified
            )
          ) AS "author"`
        )
      )
      .leftJoin("memoir_comments AS comm", "art.id", "comm.post_id")
      .leftJoin("memoir_users AS usr", "art.author_id", "usr.id")
      .groupBy("art.id", "usr.id");
  },

  insertPost(db, newPost) {
    return db
      .insert(newPost)
      .into("memoir_posts")
      .returning("*")
      .then(([post]) => post)
      .then(post => PostsService.getById(db, post.id));
  },

  getById(db, id) {
    return PostsService
      .getAllPosts(db)
      .where("art.id", id)
      .first();
  },

  deletePost(db, id) {
    return db("memoir_posts")
      .where("id", id)
      .del();
  },

  updatePost(db, newpost, id) {
    return db("memoir_posts")
      .where({ id: id })
      .update(newpost)
      .then(post => PostsService.getById(db, id));
  },


  getCommentsForPost(db, post_id) {
    return db
      .from("memoir_comments AS comm")
      .select(
        "comm.id",
        "comm.text",
        "comm.date_created",
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.username,
                  usr.full_name,
                  usr.nickname,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .where("comm.post_id", post_id)
      .leftJoin("memoir_users AS usr", "comm.user_id", "usr.id")
      .groupBy("comm.id", "usr.id");
  },

  serializePost(post) {
    const { author } = post;
    return {
      id: post.id,
      posttype: post.posttype,
      title: xss(post.title),
      summary: xss(post.summary),
      date_created: new Date(post.date_created),
      number_of_comments: Number(post.number_of_comments) || 0,
      author: {
        id: author.id,
        username: author.username,
        full_name: author.full_name,
        nickname: author.nickname,
        date_created: new Date(author.date_created),
        date_modified: new Date(author.date_modified) || null
      }
    };
  },

  serializePostComment(comment) {
    const { user } = comment;
    return {
      id: comment.id,
      post_id: comment.post_id,
      text: xss(comment.text),
      date_created: new Date(comment.date_created),
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      }
    };
  }
};

module.exports = PostsService;
