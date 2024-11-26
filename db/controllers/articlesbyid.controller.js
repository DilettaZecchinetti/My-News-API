const { fetchArticleById } = require("../../db/models/articlebyid.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  if (!article_id || isNaN(Number(article_id))) {
    return next({
      status: 400,
      msg: "bad request",
    });
  }

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
