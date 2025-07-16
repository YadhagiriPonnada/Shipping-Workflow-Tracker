import React, { useState } from "react";
import "./Card.css";

const getCardClass = (status) => {
  switch (status) {
    case 'backlog':
      return 'Card-grey';
    case 'in-progress':
      return 'Card-blue';
    case 'complete':
      return 'Card-green';
    default:
      return '';
  }
};

function Card({ card, user, onEdit }) {
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState(card.title);
  const [editCustomer, setEditCustomer] = useState(card.customer);

  const isAdmin = user && user.role === "admin";

  const handleSave = () => {
    if (onEdit) onEdit(card.id, { title: editTitle, customer: editCustomer });
    setShowModal(false);
  };

  return (
    <>
      <div className={`Card ${getCardClass(card.status)}`} onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        <div className="card-title">{card.title}</div>
        <div className="card-customer">{card.customer}</div>
      </div>
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ background: "var(--card-bg)", color: "var(--text)", borderRadius: 8, padding: 24, minWidth: 320, maxWidth: 400, margin: "10vh auto", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            <h3>Shipment Details</h3>
            {isAdmin ? (
              <>
                <div style={{ marginBottom: 12 }}>
                  <label>Title:<br />
                    <input value={editTitle} onChange={e => setEditTitle(e.target.value)} />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Customer:<br />
                    <input value={editCustomer} onChange={e => setEditCustomer(e.target.value)} />
                  </label>
                </div>
                <button onClick={handleSave}>Save</button>
                <button onClick={() => setShowModal(false)} style={{ marginLeft: 8 }}>Close</button>
              </>
            ) : (
              <>
                <div><b>Title:</b> {card.title}</div>
                <div><b>Customer:</b> {card.customer}</div>
                <button onClick={() => setShowModal(false)} style={{ marginTop: 16 }}>Close</button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Card;