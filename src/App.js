import "./App.css";
import {
  closestCorners,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import Container from "./Components/Container/Container";
import {
  defaultAnimateLayoutChanges,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import {
  deleteFromLocalStorage,
  saveToLocalStorage,
  updateStatusInLocalStorage,
} from "./utils";

function App() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);

  const animateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = (id) => {
    let container = null;

    pending.filter((item) => (item.id === id ? (container = "pending") : null));

    if (!container) {
      completed.filter((item) =>
        item.id === id ? (container = "completed") : null
      );
    }

    return container;
  };

  const findItem = (id, container) => {
    if (container === "pending") {
      return pending.find((item) => item.id === id);
    } else if (container === "completed") {
      return completed.find((item) => item.id === id);
    }
  };

  const handleDragEnd = (e) => {
    const { active, over } = e;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    let overContainer = "";

    if (overId === "pending" || overId === "completed") {
      overContainer = overId;
    } else {
      overContainer = findContainer(overId);
    }

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    if (overContainer === "completed") {
      setPending(pending.filter((item) => item.id !== id));
      let item = findItem(id, activeContainer);
      item.status = "completed";
      setCompleted([item, ...completed]);
      updateStatusInLocalStorage(item.id, "completed");
    } else if (overContainer === "pending") {
      setCompleted(completed.filter((item) => item.id !== id));
      let item = findItem(id, activeContainer);
      item.status = "pending";
      setPending([item, ...pending]);
      updateStatusInLocalStorage(item.id, "pending");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title) {
      window.alert("Please enter a title");
      return;
    }

    if (!desc) {
      window.alert("Please enter a description");
      return;
    }

    const unique_id = uuid();
    const id = unique_id.slice(0, 8);

    const newTodo = {
      id,
      title,
      desc,
      status: "pending",
    };

    setPending((prev) => [...prev, newTodo]);

    saveToLocalStorage(newTodo);
    setTitle("");
    setDesc("");
  };

  const handleDelete = (id, status) => {
    if (status === "pending") {
      setPending(pending.filter((item) => item.id !== id));
    } else if (status === "completed") {
      setCompleted(completed.filter((item) => item.id !== id));
    }

    deleteFromLocalStorage(id);
  };

  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos"));
    if (todos) {
      setPending(todos.filter((todo) => todo.status === "pending"));
      setCompleted(todos.filter((todo) => todo.status === "completed"));
    }
  }, []);

  return (
    <div className="App">
      <main className="home">
        <div className="home__bg">
          <div className="overlay"></div>
          <img src="/assets/bg.jpg" alt="bg" className="bg__img" />
        </div>

        <div className="home__content">
          <h1 className="heading">prodios todo</h1>

          <form className="inputForm" onSubmit={handleSubmit}>
            <input
              type="text"
              className="input inputForm__title"
              placeholder="Todo Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              rows="4"
              className="input inputForm__desc"
              placeholder="Todo Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>

            <button className="inputForm__button" type="submit">
              Add
            </button>
          </form>
        </div>

        <div className="todos">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
            animateLayoutChanges={animateLayoutChanges}
          >
            <Container
              id="pending"
              handleDelete={handleDelete}
              items={pending}
            />
            <Container
              id="completed"
              handleDelete={handleDelete}
              items={completed}
            />
          </DndContext>
        </div>
      </main>
    </div>
  );
}

export default App;
