const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpsMock = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");

// https://mongoosejs.com/docs/models.html#constructing-documents
// https://jestjs.io/docs/en/mock-functions.html
// 已知 Mongoose 要建立一個 document 時，會呼叫 create method，因此為了 Unit test，這裡使用 jest 的 mock function 功能
// 去 overwrite TodoModel.create。每當此 method 被 call 時，並不會真實去執行此 method 的功能 (已被jest.fn 取代)。
TodoModel.create = jest.fn();


describe("TodoController.createTodo", () => {
  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });
  /*
   * 檢查 TodoController.createTodo() 是否有呼叫 TodoModel.create。
   * 在這裡因為使用 jest.fn 去 mock function，因此並不會產生任何 data 在 DB 內。
   */
  it("should call TodoModel.create", () => {
    let req, res, next;
    req = httpsMock.createRequest();
    res = httpsMock.createResponse();
    next = null;
    // 給予 dummy data as input
    req.body = newTodo;
    TodoController.createTodo(req ,res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
});