const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const app = require("../app");

const db = require("../db/connection");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

test("404: Responds with an error when the endpoint does not exist", () => {
  return request(app)
    .get("/api/non-existent-endpoint")
    .expect(404)
    .then(({ body }) => {
      expect(body.msg).toBe("Route not found");
    });
});

describe("GET /api/articles/:article_id", () => {
  const validArticleIds = [1, 3, 5, 6, 9];
  validArticleIds.forEach((article_id) => {
    test("200: Responds with an article object each with the correct properties", () => {
      return request(app)
        .get(`/api/articles/${article_id}`)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
  });

  // test("404: responds with error as article does not exist", () => {
  //   return request(app)
  //     .get("/api/articles/789")
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.msg).toBe("Id not found");
  //     });
  // });
});

//task 5

describe("GET /api/articles", () => {
  test("200: Responds with an array of all articles with the correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("404: responds with error as articles do not exist", () => {
    return request(app)
      .get("/api/kiwi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

//task 6
describe("GET /api/articles/:article_id/comments", () => {
  const validArticleIds = [1, 3, 5, 6, 9];
  validArticleIds.forEach((article_id) => {
    test("200: responds with an array of the comments for specific article id", () => {
      return request(app)
        .get(`/api/articles/${article_id}/comments`)
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
        });
    });
  });

  test("404: Responds with an appropriate status and error message when given a valid but non-existent article_id", () => {
    const article_id = 321;
    return request(app)
      .get(`/api/articles/${article_id}/comment`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});

//tastk 7
describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the newly posted comment", () => {
    const newComment = {
      username: "butter_bridge", // Use an existing user from your seed data
      body: "This is an amazing article!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            author: "butter_bridge",
            body: "This is an amazing article!",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Successfully posts a comment and returns the new comment", async () => {
    const article_id = 1;
    const newComment = { username: "butter_bridge", body: "comment" };

    const { body } = await request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201);

    expect(body.comment).toEqual(
      expect.objectContaining({
        comment_id: expect.any(Number),
        article_id: article_id,
        author: "butter_bridge",
        body: "comment",
        votes: 0,
        created_at: expect.any(String),
      })
    );
  });
  test("404: Responds with error if the article_id does not exist", () => {
    const newComment = {
      username: "butter_bridge",
      body: "non-existent id",
    };

    return request(app)
      .post("/api/articles/999999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found: Invalid article_id or username");
      });
  });

  test("400: Responds with error if the article_id is invalid", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Invalid ID",
    };

    return request(app)
      .post("/api/articles/bananas/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid article_id");
      });
  });

  test("400: respond with erro if there is no username or comment", () => {
    const newComment = { username: "butter_bridge" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
});
