function GalleryCard({ item, index, onOpenArtwork, setSlideIndex, isAdmin, handleDelete, handleFeature, handlePublish }) {
  return (
    <article
      className="art-card"
      onClick={() => {
        setSlideIndex(index)
        onOpenArtwork(item)
      }}
    >
      <img
        src={`data:${item.mimeType};base64,${item.thumbnailData || item.imageData}`}
        alt={item.title}
        onClick={(event) => {
          event.stopPropagation()
          setSlideIndex(index)
          onOpenArtwork(item)
        }}
      />
      <div className="art-details">
        <strong>{item.title}</strong>
        <p>{item.description}</p>
        {item.featured && <span className="badge-featured">Featured</span>}
        {isAdmin && (
          <div className="admin-actions">
            <button
              className="remove-button"
              onClick={(event) => {
                event.stopPropagation()
                handleDelete(item.id)
              }}
            >
              Remove
            </button>
            <button
              className="feature-button"
              onClick={(event) => {
                event.stopPropagation()
                handleFeature(item.id, item.featured)
              }}
            >
              {item.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              className="feature-button"
              onClick={(event) => {
                event.stopPropagation()
                handlePublish(item.id, item.published)
              }}
            >
              {item.published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        )}
      </div>
    </article>
  )
}

export default GalleryCard
