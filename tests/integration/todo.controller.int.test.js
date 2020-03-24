const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

/* Testing Node.js + Mongoose with an in-memory database
 *    https://dev.to/paulasantamaria/testing-node-js-mongoose-with-an-in-memory-database-32np
 * https://github.com/Hyllesen/express-tdd/tree/11_InMemoryDb
 */ 

const endpointUrl = "/todos/";
let firstTodo;

describe(endpointUrl, () => {
  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    firstTodo = response.body[0];
  });
  it(`GET by Id ${endpointUrl}:todoId`, async () => {
    const response = await request(app).get(endpointUrl + firstTodo._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });
  it(`GET todo by id doesn't exist ${endpointUrl}:todoId`, async () => {
    const response = await request(app).get(endpointUrl + "5e7102ef1389a92705edcf12");
    expect(response.statusCode).toBe(404);
  });
  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send(newTodo);
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
  }, 10000);
  it(`should return error 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: "Missing done property" });
    expect(response.status).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required."
    });
  });
});