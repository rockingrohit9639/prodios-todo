export const saveToLocalStorage = (newTodo) => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];

  todos.push(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

export const updateStatusInLocalStorage = (id, status) => {
  const todos = JSON.parse(localStorage.getItem("todos"));

  todos.forEach((todo) => {
    if (todo.id === id) {
      todo.status = status;
    }
  });

  localStorage.setItem("todos", JSON.stringify(todos));
};
