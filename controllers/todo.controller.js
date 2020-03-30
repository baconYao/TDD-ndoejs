const TodoModel = require("../model/todo.model");

exports.createTodo = async (req, res, next) => {
  try {
    const createModel = await TodoModel.create(req.body);
    res.status(201).json(createModel);
  } catch(err) {
    next(err);
  }
};

exports.getTodos = async (req, res, next) => {
  try {
    const allTodos = await TodoModel.find({});
    res.json(allTodos);
  } catch(err) {
    next(err);
  }
}

exports.getTodoById = async (req, res, next) => {
  try {
    const todo = await TodoModel.findById(req.params.todoId);
    if(todo) {
      res.json(todo);
    } else {
      res.status(404).send();
    }
  } catch(err) {
    next(err);
  }
}

exports.updateTodo = async (req, res, next) => {
  console.log(req.params.todoId)
  console.log(req.body)
  const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, {
    new: true,
    useFindAndModify: false
  });

  res.json(updatedTodo);
}