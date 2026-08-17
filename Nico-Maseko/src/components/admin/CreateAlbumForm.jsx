function CreateAlbumForm({
  albumTitle,
  albumDescription,
  albumFiles,
  setAlbumTitle,
  setAlbumDescription,
  setAlbumFiles,
  handleCreateAlbum,
}) {
  return (
    <form onSubmit={handleCreateAlbum} className="form-grid album-form">
      <h3>New album</h3>
      <label>
        Album title
        <input
          value={albumTitle}
          onChange={(event) => setAlbumTitle(event.target.value)}
        />
      </label>
      <label>
        Album description
        <textarea
          value={albumDescription}
          onChange={(event) => setAlbumDescription(event.target.value)}
        />
      </label>
      <label>
        Add images and videos
        <input
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(event) => setAlbumFiles(Array.from(event.target.files || []))}
        />
      </label>
      {albumFiles.length > 0 && <p className="info-text">{albumFiles.length} file(s) selected</p>}
      <button type="submit">Create Album</button>
    </form>
  )
}

export default CreateAlbumForm
