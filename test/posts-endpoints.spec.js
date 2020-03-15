const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("posts Endpoints", function() {
  let db;

  const { testUsers, testposts, testComments } = helpers.makepostsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/posts`, () => {
    context(`Given no posts`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/posts")
          .expect(200, []);
      });
    });

    context("Given there are posts in the database", () => {
      beforeEach("insert posts", () =>
        helpers.seedpostsTables(db, testUsers, testposts, testComments)
      );

      it("responds with 200 and all of the posts", () => {
        const expectedposts = testposts.map(post =>
          helpers.makeExpectedpost(testUsers, post, testComments)
        );
        return supertest(app)
          .get("/api/posts")
          .expect(200, expectedposts);
      });
    });

    context(`Given an XSS attack post`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciouspost, expectedpost } = helpers.makeMaliciouspost(
        testUser
      );

      beforeEach("insert malicious post", () => {
        return helpers.seedMaliciouspost(db, testUser, maliciouspost);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/posts`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedpost.title);
            expect(res.body[0].content).to.eql(expectedpost.content);
          });
      });
    });
  });

  describe(`GET /api/posts/:post_id`, () => {
    context(`Given no posts`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const postId = 123456;
        return supertest(app)
          .get(`/api/posts/${postId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `post doesn't exist` });
      });
    });

    context("Given there are posts in the database", () => {
      beforeEach("insert posts", () =>
        helpers.seedpostsTables(db, testUsers, testposts, testComments)
      );

      it("responds with 200 and the specified post", () => {
        const postId = 2;
        const expectedpost = helpers.makeExpectedpost(
          testUsers,
          testposts[postId - 1],
          testComments
        );

        return supertest(app)
          .get(`/api/posts/${postId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedpost);
      });
    });

    context(`Given an XSS attack post`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciouspost, expectedpost } = helpers.makeMaliciouspost(
        testUser
      );

      beforeEach("insert malicious post", () => {
        return helpers.seedMaliciouspost(db, testUser, maliciouspost);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/posts/${maliciouspost.id}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedpost.title);
            expect(res.body.content).to.eql(expectedpost.content);
          });
      });
    });
  });

  describe(`GET /api/posts/:post_id/comments`, () => {
    context(`Given no posts`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const postId = 123456;
        return supertest(app)
          .get(`/api/posts/${postId}/comments`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `post doesn't exist` });
      });
    });

    context("Given there are comments for post in the database", () => {
      beforeEach("insert posts", () =>
        helpers.seedpostsTables(db, testUsers, testposts, testComments)
      );

      it("responds with 200 and the specified comments", () => {
        const postId = 1;
        const expectedComments = helpers.makeExpectedpostComments(
          testUsers,
          postId,
          testComments
        );

        return supertest(app)
          .get(`/api/posts/${postId}/comments`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedComments);
      });
    });
  });
});
