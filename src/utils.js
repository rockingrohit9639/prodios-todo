export const saveToLocalStorage = (newTodo) => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
};
