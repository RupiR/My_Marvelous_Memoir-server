const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("posts Endpoints", function () {
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
    });

    context(`Given an XSS attack post`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciouspost, expectedpost } = helpers.makeMaliciouspost(
        testUser
      );

      beforeEach("insert malicious post", () => {
        return helpers.seedMaliciouspost(db, testUser, maliciouspost);
      });
    });

    describe(`GET /api/posts/:post_id`, () => {
      context(`Given no posts`, () => {
        beforeEach(() => helpers.seedUsers(db, testUsers));
      });

      context("Given there are posts in the database", () => {
        beforeEach("insert posts", () =>
          helpers.seedpostsTables(db, testUsers, testposts, testComments)
        );
      });

      context(`Given an XSS attack post`, () => {
        const testUser = helpers.makeUsersArray()[1];
        const { maliciouspost, expectedpost } = helpers.makeMaliciouspost(
          testUser
        );
      });
    });
  });
});
