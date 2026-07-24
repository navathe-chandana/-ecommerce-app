const UserDeleteModal = ({ user, onConfirm, onCancel }) => {
  if (!user) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Delete User?</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>
          Are you sure you want to delete <strong>{user.name}</strong>? This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-danger modal-delete-btn" onClick={() => onConfirm(user._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;