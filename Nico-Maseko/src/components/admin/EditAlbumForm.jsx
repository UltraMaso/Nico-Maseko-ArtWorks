function EditAlbumForm({
  editingAlbum,
  editAlbumTitle,
  editAlbumDescription,
  editAlbumFiles,
  setEditAlbumTitle,
  setEditAlbumDescription,
  setEditAlbumFiles,
  handleUpdateAlbum,
  setEditingAlbum,
}) {
  return (
    <form onSubmit={handleUpdateAlbum} className="form-grid album-form edit-album-form">
      <h3>Edit album: {editingAlbum.title}</h3>
      <label>
        Album title
        <input
          value={editAlbumTitle}
          onChange={(event) => setEditAlbumTitle(event.target.value)}
        />
      </label>
      <label>
        Album description
        <textarea
          value={editAlbumDescription}
          onChange={(event) => setEditAlbumDescription(event.target.value)}
        />
      </label>
      <label>
        Add more images/videos
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(event) => setEditAlbumFiles(Array.from(event.target.files || []))}
        />
      </label>
      {editAlbumFiles.length > 0 && (
        <p className="info-text">{editAlbumFiles.length} new file(s) selected</p>
      )}
      <div className="admin-actions">
        <button type="submit">Save album</button>
        <button
          type="button"
          className="feature-button"
          onClick={() => setEditingAlbum(null)}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default EditAlbumForm
