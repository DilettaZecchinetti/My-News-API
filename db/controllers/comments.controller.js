const { fetchCommentsByArticleId } = require("../models/comments.model");

exports.getCommentsByArticleId = (req, res, next) => {
  console.log("hi from controller");

  const { article_id } = req.params;

  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
