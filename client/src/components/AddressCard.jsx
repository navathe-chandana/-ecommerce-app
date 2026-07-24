const AddressCard = ({ address, selected, onSelect, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`address-card ${selected ? "address-card-selected" : ""}`} onClick={() => onSelect(address.id)}>
      {address.isDefault && <span className="status-badge address-default-badge">Default</span>}
      <p className="address-card-name">{address.fullName}</p>
      <p className="address-card-text">{address.address}, {address.city}, {address.postalCode}</p>
      <p className="address-card-text">{address.country} · {address.phone}</p>

      <div className="address-card-actions" onClick={(e) => e.stopPropagation()}>
        <button className="btn btn-outline address-card-btn" onClick={() => onEdit(address)}>Edit</button>
        <button className="btn-danger" onClick={() => onDelete(address.id)}>Delete</button>
        {!address.isDefault && (
          <button className="btn btn-outline address-card-btn" onClick={() => onSetDefault(address.id)}>Set Default</button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;