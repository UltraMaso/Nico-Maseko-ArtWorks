import { getMediaDataUrl } from '../../utils/mediaUtils'

function AlbumModal({ album, onClose }) {
  if (!album) return null

  return (
    <div className="image-modal-backdrop" onClick={onClose}>
      <div className="image-modal album-modal" onClick={(event) => event.stopPropagation()}>
        <button className="close-modal-button" onClick={onClose}>
          Close
        </button>
        <div className="modal-copy">
          <h3>{album.title}</h3>
          <p>{album.description || 'No description provided.'}</p>
          <div className="modal-meta">
            <span className="badge-featured">{album.mediaCount} media</span>
          </div>
        </div>
        <div className="album-grid">
          {album.items.map((item) => (
            <div key={item.id} className="album-media-item">
              {item.type === 'video' ? (
                <video controls src={getMediaDataUrl(item)} />
              ) : (
                <img src={getMediaDataUrl(item)} alt={item.title} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AlbumModal
