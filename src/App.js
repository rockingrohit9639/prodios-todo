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
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";

const defaultAnnouncements = {
  onDragStart(id) {
    console.log(`Picked up draggable item ${id}.`);
  },
  onDragOver(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was moved over droppable area ${overId}.`
      );
      return;
    }

    console.log(`Draggable item ${id} is no longer over a droppable area.`);
  },
  onDragEnd(id, overId) {
    if (overId) {
      console.log(
        `Draggable item ${id} was dropped over droppable area ${overId}`
      );
      return;
    }

    console.log(`Draggable item ${id} was dropped.`);
  },
  onDragCancel(id) {
    console.log(`Dragging was cancelled. Draggable item ${id} was dropped.`);
  },
};

function App() {
  const [pending, setPending] = useState([
    {
      id: 1,
      title: "Todo 1",
      description: "Todo 1 description",
      status: "pending",
    },
    {
      id: 2,
      title: "Todo 2",
      description: "Todo 2 description",
      status: "pending",
    },
  ]);

  const [completed, setCompleted] = useState([
    {
      id: 3,
      title: "Todo 3",
      description: "Todo 3 description",
      status: "completed",
    },
    {
      id: 4,
      title: "Todo 4",
      description: "Todo 4 description",
      status: "completed",
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (e) => {
    console.log("Drag start");
  };

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

  const handleDragOver = (e) => {
    const { active, over } = e;
    const { id } = active;
    const { id: overId } = over;

    // Find the containers
    const activeContainer = findContainer(id);
    const overContainer = findContainer(overId);

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
    } else if (overContainer === "pending") {
      setCompleted(completed.filter((item) => item.id !== id));
      let item = findItem(id, activeContainer);
      item.status = "pending";
      setPending([item, ...pending]);
    }
  };

  function handleDragEnd(event) {
    console.log("Drag end");
  }

  return (
    <div className="App">
      <main className="home">
        <div className="home__bg">
          <div className="overlay"></div>
          <img src="/assets/bg.jpg" alt="bg" className="bg__img" />
        </div>

        <div className="home__content">
          <h1 className="heading">prodios todo</h1>

          <form className="inputForm">
            <input
              type="text"
              className="input inputForm__title"
              placeholder="Todo Title"
            />

            <textarea
              rows="4"
              className="input inputForm__desc"
              placeholder="Todo Description"
            ></textarea>

            <button className="inputForm__button">Add</button>
          </form>
        </div>

        <div className="todos">
          <DndContext
            announcements={defaultAnnouncements}
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Container id="pending" items={pending} />
            <Container id="completed" items={completed} />
          </DndContext>
        </div>
      </main>
    </div>
  );
}

export default App;
