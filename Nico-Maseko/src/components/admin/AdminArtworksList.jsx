function AdminArtworksList({
  adminArtworks,
  handleDelete,
  handleFeature,
  handlePublish,
}) {
  return (
    <div className="admin-list">
      <h3>Manage uploaded artworks</h3>
      {adminArtworks.length ? (
        adminArtworks.map((item) => (
          <div key={item.id} className="admin-item">
            <div>
              <strong>{item.title}</strong>
              <p>{item.description}</p>
              <p className="admin-meta">
                Published: {item.published ? 'Yes' : 'No'} • Featured:{' '}
                {item.featured ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="admin-actions">
              <button
                className="remove-button"
                onClick={() => handleDelete(item.id)}
              >
                Remove
              </button>
              <button
                className="feature-button"
                onClick={() => handleFeature(item.id, item.featured)}
              >
                {item.featured ? 'Unfeature' : 'Feature'}
              </button>
              <button
                className="feature-button"
                onClick={() => handlePublish(item.id, item.published)}
              >
                {item.published ? 'Unpublish' : 'Publish'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="empty-list">No artworks are available for management.</p>
      )}
    </div>
  )
}

export default AdminArtworksList
