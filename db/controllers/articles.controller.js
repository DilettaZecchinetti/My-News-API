const {
  fetchArticleById,
  fetchAllArticles,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id);

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
