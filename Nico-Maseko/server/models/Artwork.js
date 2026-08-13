import mongoose from 'mongoose'

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  filename: String,
  mimeType: String,
  imageData: Buffer,
  thumbnailData: Buffer,
  contentHash: { type: String, required: true, unique: true, index: true },
  featured: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Artwork', artworkSchema)
