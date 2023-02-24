import { ImageDataLike } from '..'
import { getGrayscaleValue } from '../utils/pixcel'
import { resize } from '../utils/resize'

const size = 8

export const dhashFromImageData = (imageData: ImageDataLike) => {
  const resizedImageData = resize(imageData, size + 1, size)

  const list = Array(size * size)

  // ハッシュ情報の取得
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const left = getGrayscaleValue(resizedImageData, col, row)
      const right = getGrayscaleValue(resizedImageData, col + 1, row)

      list[row * (size + 1) + col] = left < right ? 1 : 0
    }
  }

  return list.join('')
}
