import { getMediaDataUrl } from '../../utils/mediaUtils'

function AlbumCard({ album, onOpenAlbum }) {
  return (
    <article className="art-card album-card" onClick={() => onOpenAlbum(album)}>
      <img src={getMediaDataUrl(album.cover)} alt={album.title} />
      <div className="art-details">
        <strong>{album.title}</strong>
        <p>{album.description}</p>
        <span className="badge-featured">{album.mediaCount} media</span>
      </div>
    </article>
  )
}

export default AlbumCard
