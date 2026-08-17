function AdminAlbumsList({
  adminAlbums,
  handleDeleteAlbum,
  setEditingAlbum,
  setEditAlbumTitle,
  setEditAlbumDescription,
  setEditAlbumFiles,
}) {
  const handleEdit = (album) => {
    setEditingAlbum(album)
    setEditAlbumTitle(album.title)
    setEditAlbumDescription(album.description || '')
    setEditAlbumFiles([])
  }

  return (
    <div className="admin-list">
      <h3>Manage albums</h3>
      {adminAlbums.length ? (
        adminAlbums.map((album) => (
          <div key={album.id} className="admin-item">
            <div>
              <strong>{album.title}</strong>
              <p>{album.description}</p>
              <p className="admin-meta">
                {album.mediaCount} item(s) • Published:{' '}
                {album.published ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="admin-actions">
              <button
                className="feature-button"
                onClick={() => handleEdit(album)}
              >
                Edit album
              </button>
              <button
                className="remove-button"
                onClick={() => handleDeleteAlbum(album.id)}
              >
                Remove album
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="empty-list">No albums are available for management.</p>
      )}
    </div>
  )
}

export default AdminAlbumsList
