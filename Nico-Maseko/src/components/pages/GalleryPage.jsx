import GalleryCard from "../shared/GalleryCard";
import AlbumCard from "../shared/AlbumCard";

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
      <section className="hero-panel">
        <div className="hero-intro">
          <p className="eyebrow">
            <span>01</span> The digital art collection
          </p>
          <h5>
            Art that lives
            <br />
            <span>beyond the frame.</span>
          </h5>
          <p className="hero-description">
            A considered collection of digital works, where imagination meets
            the infinite.
          </p>
        </div>
        <div className="hero-card">
          <div className="section-kicker">
            <span>Selected work</span>
            <span className="section-rule" />
            <span>DAT / 001</span>
          </div>
          {currentSlide ? (
            <div className="hero-slide">
              <img
                src={`data:${currentSlide.mimeType};base64,${currentSlide.imageData}`}
                alt={currentSlide.title}
              />
              <div className="hero-copy">
                <div>
                  <p className="hero-copy-label">Featured artwork</p>
                  <strong>{currentSlide.title}</strong>
                </div>
                <p>{currentSlide.description}</p>
                <span className="slide-note">
                  No. {String(slideIndex + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ) : (
            <div className="hero-empty">
              <span
                className="empty-orbit"
                aria-hidden="true"
              />
              <p>Your next favorite artwork is on its way.</p>
            </div>
          )}
        </div>
      </section>

      <section className="gallery-section artwork-section">
        <div className="gallery-header">
          <div>
            <p className="eyebrow">
              <span>02</span> The archive
            </p>
            <h2>Works in focus</h2>
          </div>
          <p>
            Explore a growing archive of digital pieces, made to be seen a
            little closer.
          </p>
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
            <p className="empty-list">
              The archive is taking shape. Check back soon.
            </p>
          )}
        </div>
      </section>

      <section className="gallery-section album-section">
        <div className="gallery-header">
          <div>
            <p className="eyebrow">
              <span>03</span> Collected worlds
            </p>
            <h2>Explore by collection</h2>
          </div>
          <p>
            Step into a series and discover the ideas behind each collection.
          </p>
        </div>
        <div className="gallery-grid">
          {albums.length ? (
            albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onOpenAlbum={onOpenAlbum}
              />
            ))
          ) : (
            <p className="empty-list">New collections are being assembled.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default GalleryPage;
