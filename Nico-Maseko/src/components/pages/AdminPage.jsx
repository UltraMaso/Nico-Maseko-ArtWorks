import AdminArtworksList from '../admin/AdminArtworksList'
import AdminAlbumsList from '../admin/AdminAlbumsList'
import UploadArtworkForm from '../admin/UploadArtworkForm'
import CreateAlbumForm from '../admin/CreateAlbumForm'
import EditAlbumForm from '../admin/EditAlbumForm'
import BackgroundForm from '../admin/BackgroundForm'

function AdminPage({
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
  backgroundColor,
  setBackgroundColor,
  backgroundMessage,
  handleBackground,
  adminArtworks,
  handleDelete,
  handleFeature,
  handlePublish,
  albumTitle,
  albumDescription,
  albumFiles,
  setAlbumTitle,
  setAlbumDescription,
  setAlbumFiles,
  handleCreateAlbum,
  adminAlbums,
  handleDeleteAlbum,
  editingAlbum,
  setEditingAlbum,
  editAlbumTitle,
  setEditAlbumTitle,
  editAlbumDescription,
  setEditAlbumDescription,
  editAlbumFiles,
  setEditAlbumFiles,
  handleUpdateAlbum,
}) {
  return (
    <div className="panel admin-panel">
      <UploadArtworkForm
        title={title}
        description={description}
        imageFile={imageFile}
        featured={featured}
        setTitle={setTitle}
        setDescription={setDescription}
        setImageFile={setImageFile}
        setFeatured={setFeatured}
        fileInputRef={fileInputRef}
        handleUpload={handleUpload}
      />

      <CreateAlbumForm
        albumTitle={albumTitle}
        albumDescription={albumDescription}
        albumFiles={albumFiles}
        setAlbumTitle={setAlbumTitle}
        setAlbumDescription={setAlbumDescription}
        setAlbumFiles={setAlbumFiles}
        handleCreateAlbum={handleCreateAlbum}
      />

      {editingAlbum && (
        <EditAlbumForm
          editingAlbum={editingAlbum}
          editAlbumTitle={editAlbumTitle}
          editAlbumDescription={editAlbumDescription}
          editAlbumFiles={editAlbumFiles}
          setEditAlbumTitle={setEditAlbumTitle}
          setEditAlbumDescription={setEditAlbumDescription}
          setEditAlbumFiles={setEditAlbumFiles}
          handleUpdateAlbum={handleUpdateAlbum}
          setEditingAlbum={setEditingAlbum}
        />
      )}

      <BackgroundForm
        backgroundColor={backgroundColor}
        setBackgroundColor={setBackgroundColor}
        backgroundMessage={backgroundMessage}
        handleBackground={handleBackground}
      />

      <AdminArtworksList
        adminArtworks={adminArtworks}
        handleDelete={handleDelete}
        handleFeature={handleFeature}
        handlePublish={handlePublish}
      />

      <AdminAlbumsList
        adminAlbums={adminAlbums}
        handleDeleteAlbum={handleDeleteAlbum}
        setEditingAlbum={setEditingAlbum}
        setEditAlbumTitle={setEditAlbumTitle}
        setEditAlbumDescription={setEditAlbumDescription}
        setEditAlbumFiles={setEditAlbumFiles}
      />
    </div>
  )
}

export default AdminPage
