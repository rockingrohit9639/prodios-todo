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
  updateTodoInLocalStorage,
} from "./utils";
import { Modal } from "@mui/material";

function App() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [pending, setPending] = useState([]);
  const [completed, setCompleted] = useState([]);

  const [ModalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState({});

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isEdit, setIsEdit] = useState(false);

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

  const toggleEdit = (item) => {
    if (isEdit) {
      setIsEdit(false);
    } else {
      setNewTitle(item.title);
      setNewDesc(item.desc);
      setIsEdit(true);
    }
  };

  const handleEdit = () => {
    if (!newTitle) {
      window.alert("Please enter a title");
      return;
    }

    if (!newDesc) {
      window.alert("Please enter a description");
      return;
    }

    const item = findItem(modalItem.id, modalItem.status);
    item.title = newTitle;
    item.desc = newDesc;

    if (item.status === "pending") {
      setPending(pending.filter((todo) => (todo.id === item.id ? item : todo)));
    } else if (item.status === "completed") {
      setCompleted(
        completed.filter((todo) => (todo.id === item.id ? item : todo))
      );
    }

    updateTodoInLocalStorage(item.id, item);
    setModalOpen(false);
    setIsEdit(false);
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
              setModalOpen={setModalOpen}
              setModalItem={setModalItem}
            />
            <Container
              id="completed"
              handleDelete={handleDelete}
              items={completed}
              setModalOpen={setModalOpen}
              setModalItem={setModalItem}
            />
          </DndContext>
        </div>
      </main>

      <Modal
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={ModalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className="item__modalContainer">
          <div className="modal__actions">
            <button className="button" onClick={() => toggleEdit(modalItem)}>
              <ion-icon name="create"></ion-icon>
            </button>

            <button className="button">
              <ion-icon
                name="close-outline"
                onClick={() => setModalOpen(false)}
              ></ion-icon>
            </button>
          </div>

          {isEdit && (
            <input
              type="text"
              className="input inputForm__title"
              placeholder="Todo Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          )}

          {isEdit && (
            <textarea
              rows="4"
              className="input inputForm__desc"
              placeholder="Todo Description"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            ></textarea>
          )}
      
          {isEdit && (
            <button className="button editButton" onClick={handleEdit}>
              Save Todo
            </button>
          )}

          {!isEdit && <h2 className="item__modalTitle">{modalItem.title}</h2>}

          {!isEdit && <p className="item__modalDesc">{modalItem.desc}</p>}

          <p className="item__status">
            Status:{" "}
            <span
              style={{
                color: modalItem.status === "pending" ? "yellow" : "green",
              }}
            >
              {modalItem?.status?.toUpperCase()}
            </span>
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default App;
