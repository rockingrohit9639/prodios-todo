import { useSortable } from "@dnd-kit/sortable";
import React from "react";
import "./SortableItem.css";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({ item }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="item">{item.title}</div>
    </div>
  );
}

export default SortableItem;
