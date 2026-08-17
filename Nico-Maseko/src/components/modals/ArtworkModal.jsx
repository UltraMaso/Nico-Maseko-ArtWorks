function ArtworkModal({ artwork, onClose }) {
  if (!artwork) return null

  return (
    <div className="image-modal-backdrop" onClick={onClose}>
      <div className="image-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-modal-button" onClick={onClose}>
          Close
        </button>
        <img
          src={`data:${artwork.mimeType};base64,${artwork.imageData}`}
          alt={artwork.title}
          className="modal-image"
        />
        <div className="modal-copy">
          <h3>{artwork.title}</h3>
          <p>{artwork.description || 'No description provided.'}</p>
          <div className="modal-meta">
            {artwork.featured && <span className="badge-featured">Featured</span>}
            {artwork.published ? (
              <span className="badge-featured">Published</span>
            ) : (
              <span className="badge-featured">Draft</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtworkModal
