import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swimlane from "./Swimlane";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const LOCAL_KEY = 'client-board-data';

// Get initial client data
const getClients = () => {
  return [
    ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
    ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
    ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
    ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
    ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
    ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
    ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
    ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
    ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
    ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
    ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
    ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
    ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
    ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
    ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
    ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
    ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
    ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
    ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
    ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
  ].map(([id, name, description, status]) => ({
    id,
    name,
    description,
    status,
  }));
};

// Load initial clients from localStorage or create new ones
const loadInitialClients = () => {
  const fromStorage = localStorage.getItem(LOCAL_KEY);
  if (fromStorage) {
    return JSON.parse(fromStorage);
  } else {
    const initial = getClients();
    localStorage.setItem(LOCAL_KEY, JSON.stringify(initial));
    return initial;
  }
};

// Convert client data to board format
const convertClientsToBoardData = (clients) => {
  const columns = {
    backlog: {
      id: "backlog",
      title: "Backlog",
      cardIds: [],
      color: "#666666"  // Grey color (for white text)
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      cardIds: [],
      color: "#007bff"   // Blue color (for black text)
    },
    complete: {
      id: "complete",
      title: "Complete",
      cardIds: [],
      color: "#28a745"   // Green color (for black text)
    },
  };

  const cards = {};
  clients.forEach(client => {
    const columnId = client.status === 'backlog' ? 'backlog' :
                    client.status === 'in-progress' ? 'inProgress' : 'complete';
    columns[columnId].cardIds.push(client.id);
    cards[client.id] = {
      id: client.id,
      title: client.name,
      description: client.description,
      status: client.status
    };
  });

  return {
    columns,
    cards,
    columnOrder: ["backlog", "inProgress", "complete"]
  };
};

// Initial data with client data
const initialData = convertClientsToBoardData(loadInitialClients());

const LOCAL_STORAGE_KEY = "shipping-workflow-data";



function Board() {
  // Initialize state with client data
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialData;
  });

  // Card management functions
  const handleAddCard = (columnId) => {
    const newId = Date.now().toString();
    const newCard = {
      id: newId,
      title: `New Task ${newId}`,
      description: "",
      status: columnId
    };

    const newData = {
      ...data,
      cards: {
        ...data.cards,
        [newId]: newCard
      },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          cardIds: [...data.columns[columnId].cardIds, newId]
        }
      }
    };
    updateData(newData);
  };

  const handleRemoveCard = (columnId, cardId) => {
    const newData = {
      ...data,
      cards: Object.fromEntries(
        Object.entries(data.cards).filter(([id]) => id !== cardId)
      ),
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],
          cardIds: data.columns[columnId].cardIds.filter(id => id !== cardId)
        }
      }
    };
    updateData(newData);
  };

  const handleEditCard = (columnId, cardId) => {
    const newTitle = prompt("Enter new task title:");
    if (newTitle) {
      const newData = {
        ...data,
        cards: {
          ...data.cards,
          [cardId]: {
            ...data.cards[cardId],
            title: newTitle
          }
        }
      };
      updateData(newData);
    }
  };

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Reset function
  const handleReset = () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
    setData(initialData);
  };
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newColumnName, setNewColumnName] = useState("");
  const [renamingColumn, setRenamingColumn] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [sortDir, setSortDir] = useState("asc");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const updateData = (newData) => {
    setData(newData);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  };

  const handleExportCSV = () => {
    const rows = Object.values(data.cards).map((card) => {
      const column = Object.entries(data.columns).find(([colId, col]) => 
        col.cardIds.includes(card.id)
      )?.[1];
      return {
        id: card.id,
        title: card.title,
        description: card.description,
        status: column?.title || "Unknown"
      };
    });
    
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tasks.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as CSV");
  };

  const handleExportExcel = () => {
    const rows = Object.values(data.cards).map((card) => {
      const column = Object.entries(data.columns).find(([colId, col]) => 
        col.cardIds.includes(card.id)
      )?.[1];
      return {
        id: card.id,
        title: card.title,
        description: card.description,
        status: column?.title || "Unknown"
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "tasks.xlsx");
    toast.success("Exported as Excel");
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;

    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      updateData({ ...data, columnOrder: newColumnOrder });
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newCardIds = Array.from(start.cardIds);
      newCardIds.splice(source.index, 1);
      newCardIds.splice(destination.index, 0, draggableId);
      const newColumn = { ...start, cardIds: newCardIds };
      updateData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
    } else {
      const startCardIds = Array.from(start.cardIds);
      startCardIds.splice(source.index, 1);
      const newStart = { ...start, cardIds: startCardIds };

      const finishCardIds = Array.from(finish.cardIds);
      finishCardIds.splice(destination.index, 0, draggableId);
      const newFinish = { ...finish, cardIds: finishCardIds };

      updateData({
        ...data,
        columns: {
          ...data.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      });
    }
  };

  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!newColumnName.trim()) return;
    const id = newColumnName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const newColumn = { id, title: newColumnName, cardIds: [] };
    updateData({
      ...data,
      columns: { ...data.columns, [id]: newColumn },
      columnOrder: [...data.columnOrder, id],
    });
    setNewColumnName("");
  };

  const handleRemoveColumn = (columnId) => {
    const { [columnId]: removed, ...restColumns } = data.columns;
    const cardIdsToRemove = data.columns[columnId].cardIds;
    const restCards = { ...data.cards };
    cardIdsToRemove.forEach((cid) => delete restCards[cid]);
    updateData({
      ...data,
      columns: restColumns,
      cards: restCards,
      columnOrder: data.columnOrder.filter((id) => id !== columnId),
    });
  };

  const handleRenameColumn = (columnId) => {
    setRenamingColumn(columnId);
    setRenameValue(data.columns[columnId].title);
  };

  const handleRenameSubmit = (e, columnId) => {
    e.preventDefault();
    if (!renameValue.trim()) return;
    updateData({
      ...data,
      columns: {
        ...data.columns,
        [columnId]: { ...data.columns[columnId], title: renameValue },
      },
    });
    setRenamingColumn(null);
    setRenameValue("");
  };

  const getFilteredSortedCards = (cardIds) => {
    let cards = cardIds.map((id) => data.cards[id]).filter(Boolean);
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      cards = cards.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.customer && c.customer.toLowerCase().includes(q)) ||
          (c.id && c.id.toLowerCase().includes(q))
      );
    }
    if (statusFilter) {
      cards = cards.filter((c) => {
        return Object.entries(data.columns).some(
          ([colId, col]) => col.cardIds.includes(c.id) && colId === statusFilter
        );
      });
    }
    cards = [...cards].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "title") {
        cmp = a.title.localeCompare(b.title);
      } else if (sortBy === "customer") {
        cmp = (a.customer || "").localeCompare(b.customer || "");
      } else if (sortBy === "id") {
        cmp = a.id.localeCompare(b.id);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return cards;
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;

    const newCardId = Date.now().toString();
    const newCard = {
      id: newCardId,
      title: newTaskTitle,
      description: newTaskDescription,
    };

    // Ensure we have a valid data structure
    const currentColumns = data.columns || initialData.columns;
    const currentBacklog = currentColumns.backlog || initialData.columns.backlog;

    const newData = {
      ...data,
      cards: {
        ...data.cards,
        [newCardId]: newCard,
      },
      columns: {
        ...currentColumns,
        backlog: {
          ...currentBacklog,
          cardIds: [...(currentBacklog.cardIds || []), newCardId],
        },
      },
    };

    updateData(newData);
    setNewTaskTitle("");
    setNewTaskDescription("");
    toast.success("Task added successfully");
  };

  return (
    <div className="board-container">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="board-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2>Shipping Workflow</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleReset}
              style={{ padding: "8px 16px", background: "#ff4444", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="board-controls">
          <div className="task-add-form">
            <input
              type="text"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <textarea
              placeholder="Task description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
          </div>
          <div className="export-buttons">
            <button onClick={handleExportCSV}>Export CSV</button>
            <button onClick={handleExportExcel}>Export Excel</button>
          </div>
        </div>
      </div>
      <div className="board-search">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          {data.columnOrder.map((colId) => (
            <option key={colId} value={colId}>
              {data.columns[colId].title}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="id">Sort by ID</option>
        </select>
        <select
          value={sortDir}
          onChange={(e) => setSortDir(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div className="board">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "flex", gap: "1rem" }}>
                {data.columnOrder.map((columnId, index) => {
                  const column = data.columns[columnId];
                  const cards = getFilteredSortedCards(column.cardIds);
                  return (
                    <Draggable draggableId={column.id} index={index} key={column.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{ ...provided.draggableProps.style, minWidth: 300, marginRight: 16 }}
                        >
                          <Swimlane
                            column={column}
                            cards={cards}
                            dragHandleProps={provided.dragHandleProps}
                            onRemoveColumn={() => handleRemoveColumn(column.id)}
                            onRenameColumn={() => handleRenameColumn(column.id)}
                            onAddCard={() => handleAddCard(column.id)}
                            onRemoveCard={(cardId) => handleRemoveCard(column.id, cardId)}
                            onEditCard={(cardId) => handleEditCard(column.id, cardId)}
                          >
                            {renamingColumn === column.id ? (
                              <form onSubmit={(e) => handleRenameSubmit(e, column.id)} style={{ display: "flex", gap: 4 }}>
                                <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} autoFocus />
                                <>
                                  <button type="submit">Save</button>
                                  <button type="button" onClick={() => setRenamingColumn(null)}>Cancel</button>
                                </>
                              </form>
                            ) : null}
                          </Swimlane>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default Board;
