import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import "./SortableItem.css";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ item, handleDelete, setModalOpen, setModalItem }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div
        className="item"
        onClick={() => {
          setModalItem(item);
          setModalOpen(true);
        }}
      >
        <div className="item__content" {...attributes} {...listeners}>
          <p className="item__title">{item.title}</p>
        </div>

        <div
          className="item__delete"
          onClick={() => handleDelete(item.id, item.status)}
        >
          <ion-icon name="trash-outline"></ion-icon>
        </div>
      </div>
    </div>
  );
}

export default SortableItem;
