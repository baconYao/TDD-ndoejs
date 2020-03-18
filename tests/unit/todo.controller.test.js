const TodoController = require("../../controllers/todo.controller");
const TodoModel = require("../../model/todo.model");
const httpsMock = require("node-mocks-http");
const newTodo = require("../mock-data/new-todo.json");
const allTodos = require("../mock-data/all-todos.json");

// https://mongoosejs.com/docs/models.html#constructing-documents
// https://mongoosejs.com/docs/api.html#model_Model.create

// https://medium.com/enjoy-life-enjoy-coding/jest-jojo%E6%98%AF%E4%BD%A0-%E6%88%91%E7%9A%84%E6%9B%BF%E8%BA%AB%E8%83%BD%E5%8A%9B%E6%98%AF-mock-4de73596ea6e
// https://jestjs.io/docs/en/mock-functions.html
// 已知 Mongoose 要建立一個 document 時，會呼叫 create method，因此為了 Unit test，這裡使用 jest 的 mock function 功能
// 去 overwrite TodoModel.create。每當此 method 被 call 時，並不會真實去執行此 method 的功能 (已被jest.fn 取代)。
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();   // mock Model find() method -> https://mongoosejs.com/docs/api.html#model_Model.find

let req, res, next;
beforeEach (() => {
  req = httpsMock.createRequest();
  res = httpsMock.createResponse();
  next = jest.fn();
});

describe("TodoController.createTodo", () => {
  beforeEach(() => {
    // 給予 dummy data as request's body payload
    req.body = newTodo;
  });
  
  it("should have a createTodo function", () => {
    expect(typeof TodoController.createTodo).toBe("function");
  });
  /*
   * 檢查 TodoController.createTodo() 是否有呼叫 TodoModel.create。
   * 在這裡因為使用 jest.fn 去 mock function，因此並不會產生任何 data 在 DB 內。
   */
  it("should call TodoModel.create", () => {
    TodoController.createTodo(req ,res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });
  /*
   * 檢查 TodoModel.create 新增一筆 document 時，回傳的status code 應該是 201。
   */
  it("should return 201 status code", async () => {
    await TodoController.createTodo(req ,res, next);
    // 驗證回傳的 status code 為 201
    expect(res.statusCode).toBe(201);
    // https://github.com/howardabrams/node-mocks-http
    // _isEndCalled() 是用來驗證 response 是否有被送出。
    // res.status(201) 會過上面的驗證，但應為沒有 send() / json()，因此並沒有真的送出 response
    expect(res._isEndCalled()).toBeTruthy();
  });
  it("should return json body in response", async () => {
    // 由於 TodoModel.create 已經被 mock，因此若要給予回傳的值時，可以使用 mockReturnValue 搭配要給予的值 newTodo
    // 作為當 TodoModel.create 會回傳的值
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req ,res, next);

    // 此 case 中，儘管我們知道 TodoController.createTodo 回傳的 json data newTodo 的內容是一樣的，但仍然會出現錯誤:
    // 'If it should pass with deep equality, replace "toBe" with "toStrictEqual"'，這是因為
    // newTodo 和 createModel (todo.controller.js 回傳的值) 記憶體位址不同，因此 toBe 會判斷為不同的資料。
    // 所以要用 'toStrictEqual' 取代 'toBe'
    // expect(res._getJSONData()).toBe(newTodo);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it("should handle errors" , async () => {
    // 期望收到的 error message (表示 error handling 處理到)
    const errorMessgae = { message: "Done property missing" };
    const rejectPromise = Promise.reject(errorMessgae);
    TodoModel.create.mockReturnValue(rejectPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessgae);
  });
});

describe("TodoController.getTodos", () => {
  it("should have a getTodos function", () => {
    expect(typeof TodoController.getTodos).toBe("function");
  });
  it("should call TodoModel.find({})", async () => {
    await TodoController.getTodos(req ,res, next);
    expect(TodoModel.find).toBeCalledWith({});
  });
  it("should return response with status 200 and all todos", async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req ,res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });
});