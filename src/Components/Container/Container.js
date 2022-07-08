import React, { useMemo } from "react";
import "./Container.css";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableItem from "../SortableItem/SortableItem";

function Container({ id, items, handleDelete, setModalOpen, setModalItem }) {
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <SortableContext
      id={id}
      items={itemIds}
      strategy={verticalListSortingStrategy}
    >
      <div className="todos__list">
        <h1 className="title">{id}</h1>
        <div ref={setNodeRef} className="todo__container">
          {items.map((item, index) => (
            <SortableItem
              key={index}
              item={item}
              handleDelete={handleDelete}
              setModalOpen={setModalOpen}
              setModalItem={setModalItem}
            />
          ))}
        </div>
      </div>
    </SortableContext>
  );
}

export default Container;
