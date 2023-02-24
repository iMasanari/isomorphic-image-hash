import { ImageDataLike } from '..'

export const getGrayscaleValue = (imageData: ImageDataLike, col: number, row: number) => {
  const base = (row * imageData.width + col) * 4
  const r = imageData.data[base]
  const g = imageData.data[base + 1]
  const b = imageData.data[base + 2]

  return 0.299 * r + 0.587 * g + 0.114 * b
}
