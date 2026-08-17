function UploadArtworkForm({
  title,
  description,
  imageFile,
  featured,
  setTitle,
  setDescription,
  setImageFile,
  setFeatured,
  fileInputRef,
  handleUpload,
}) {
  return (
    <form onSubmit={handleUpload} className="form-grid">
      <label>
        Title
        <input value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <label>
        Description
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <label>
        Upload image
        <input
          id="image-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
        />
      </label>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={featured}
          onChange={(event) => setFeatured(event.target.checked)}
        />
        Mark as featured
      </label>
      <button type="submit">Upload Artwork</button>
    </form>
  )
}

export default UploadArtworkForm
