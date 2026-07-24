const ProductDeleteModal = ({ product, onConfirm, onCancel }) => {
  if (!product) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Delete Product?</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>
          Are you sure you want to delete <strong>{product.name}</strong>? This cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-danger modal-delete-btn" onClick={() => onConfirm(product._id)}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDeleteModal;