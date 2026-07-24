import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { searchByImage } from "../api/imageSearchApi";

const ImageSearchModal = ({ onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState(null);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResults(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    handleFile(dropped);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSearch = async () => {
    if (!file) return;
    setSearching(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await searchByImage(formData);
      setResults(res.data.products || []);
    } catch (error) {
      // Backend endpoint not implemented yet — surface this honestly instead of showing fake matches
      toast.error("Image search isn't available yet. This feature is coming soon.");
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box modal-box-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📷 Search by Image</h3>
          <button className="quickview-close" onClick={onClose}>✕</button>
        </div>

        {!preview ? (
          <div
            className={`image-search-dropzone ${dragging ? "image-search-dropzone-active" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
          >
            <div className="image-search-icon">🖼️</div>
            <p className="image-search-title">Drag & drop an image here</p>
            <p className="image-search-subtitle">or click to browse — JPG, PNG, WEBP</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>
        ) : (
          <div className="image-search-preview-wrap">
            <img src={preview} alt="Uploaded preview" className="image-search-preview" />
            <button className="btn-danger image-search-remove-btn" onClick={handleRemove}>Remove Image</button>

            {!results && (
              <button className="btn btn-primary" style={{ width: "100%", marginTop: "12px" }} onClick={handleSearch} disabled={searching}>
                {searching ? "Searching..." : "🔍 Find Similar Products"}
              </button>
            )}

            {searching && (
              <div className="image-search-loading">
                <div className="spinner"></div>
                <p>Analyzing image...</p>
              </div>
            )}

            {results && results.length === 0 && !searching && (
              <div className="empty-state" style={{ padding: "30px 10px" }}>
                <div className="empty-state-icon">🚧</div>
                <h3 style={{ margin: 0 }}>Image search coming soon</h3>
                <p style={{ fontSize: "13px" }}>This feature requires backend image recognition, which isn't set up yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchModal;