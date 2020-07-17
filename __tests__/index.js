const supertest = require("supertest");
const server = require("../index");
const db = require("../data/config");

// a global jest hook to run before each individual test
beforeEach(async () => {
    // re-run the seeds and start with a fresh database for each test
    await db.seed.run();
});

// a global jest hook to run after all the tests are done
afterAll(async () => {
    // closes the database connection so the jest command doesn't stall
    await db.destroy();
});

describe("users integration tests", () => {
    it("POST /users", async () => {
        const res = await supertest(server).post("/users/register").send({
            username: "jackdoe",
            password: "abc123",
        });
        expect(res.statusCode).toBe(201);
        expect(res.headers["content-type"]).toBe(
            "application/json; charset=utf-8"
        );
        expect(res.body.id).toBeDefined();
        expect(res.body.username).toBe("jackdoe");
    });

    it("DELETE /users/:id", async () => {
        const res = await supertest(server).delete("/users/2");
        expect(res.statusCode).toBe(200);
        expect(res.headers["content-type"]).toBe(
            "application/json; charset=utf-8"
        );
        expect(res.body.removed).toBe(1);
    });
});
