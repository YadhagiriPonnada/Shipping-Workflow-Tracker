import React from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Card from "./Card";
import './Swimlane.css';

function Swimlane({ column, cards, dragHandleProps, onRemoveColumn, onRenameColumn, children, user, onEdit }) {
  return (
    <div className="swimlane" style={{
      background: column.color,
      padding: "1rem",
      borderRadius: "8px",
      minHeight: "100%"
    }}>
      <div className="swimlane-header" {...dragHandleProps} style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        fontWeight: "bold",
        marginBottom: "1rem"
      }}>
        <span style={{ fontSize: "1.2rem" }}>{column.title}</span>
        <span>
          <button onClick={onRenameColumn} title="Rename" style={{ marginRight: 4 }}>✏️</button>
          <button onClick={onRemoveColumn} title="Remove">🗑️</button>
        </span>
      </div>
      {children}
      <Droppable droppableId={column.id} type="card">
        {(provided, snapshot) => (
          <div
            className="swimlane-cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{
              background: "transparent",
              minHeight: "100%",
              padding: "0.5rem",
              borderRadius: "8px",
              transition: "background 0.2s"
            }}
          >
            {cards.map((card, index) => (
              <Draggable draggableId={card.id} index={index} key={card.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      ...provided.draggableProps.style,
                      marginBottom: 8,
                    }}
                  >
                    <Card card={card} user={user} onEdit={onEdit} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default Swimlane;
