export const getMediaDataUrl = (item) => {
  if (!item) return ''
  if (item.dataUrl) return item.dataUrl
  if (item.type === 'video' && item.videoData) return `data:${item.mimeType};base64,${item.videoData}`
  if (item.imageData) return `data:${item.mimeType};base64,${item.imageData}`
  return ''
}
