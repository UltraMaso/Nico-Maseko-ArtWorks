import mongoose from 'mongoose'

const albumSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  published: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  cover: { type: mongoose.Schema.Types.Mixed, default: null },
  items: [{ type: mongoose.Schema.Types.Mixed, default: [] }],
})

export default mongoose.model('Album', albumSchema)
