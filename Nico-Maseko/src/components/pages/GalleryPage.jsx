import GalleryCard from '../shared/GalleryCard'
import AlbumCard from '../shared/AlbumCard'

function GalleryPage({
  artworks,
  albums,
  currentSlide,
  slideIndex,
  setSlideIndex,
  isAdmin,
  handleDelete,
  handleFeature,
  handlePublish,
  onOpenArtwork,
  onOpenAlbum,
}) {
  return (
    <>
          <section className="gallery-section">
        <div className="gallery-header">
          <h2>Albums</h2>
          <p>Browse artist albums and open each one to view the full collection.</p>
        </div>
        <div className="gallery-grid">
          {albums.length ? (
            albums.map((album) => (
              <AlbumCard key={album.id} album={album} onOpenAlbum={onOpenAlbum} />
            ))
          ) : (
            <p className="empty-list">No albums have been published yet.</p>
          )}
        </div>
      </section>
      <section className="hero-panel">
        <div className="hero-card">
          <h2>Featured artwork</h2>
          {currentSlide ? (
            <div className="hero-slide">
              <img
                src={`data:${currentSlide.mimeType};base64,${currentSlide.imageData}`}
                alt={currentSlide.title}
              />
              <div className="hero-copy">
                <strong>{currentSlide.title}</strong>
                <p>{currentSlide.description}</p>
                <p className="slide-note">
                  Slide {slideIndex + 1} of {artworks.length}
                </p>
              </div>
            </div>
          ) : (
            <div className="hero-empty">No artworks available yet.</div>
          )}
        </div>
      </section>

      <section className="gallery-section">
        <div className="gallery-header">
          <h2>Gallery</h2>
          <p>Click an image to open in the slide preview. Admins can remove or toggle featured status.</p>
        </div>
        <div className="gallery-grid">
          {artworks.length ? (
            artworks.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                onOpenArtwork={onOpenArtwork}
                setSlideIndex={setSlideIndex}
                isAdmin={isAdmin}
                handleDelete={handleDelete}
                handleFeature={handleFeature}
                handlePublish={handlePublish}
              />
            ))
          ) : (
            <p className="empty-list">No artwork has been uploaded yet.</p>
          )}
        </div>
      </section>


    </>
  )
}

export default GalleryPage
