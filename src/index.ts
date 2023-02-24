import { dhashFromImageData } from './hash/dhash'
import { getImageDataForBrowser } from './image-data/browser'
import { getGifImageData } from './image-data/gif'
import { getJpegImageData } from './image-data/jpeg'
import { getPngImageData } from './image-data/png'

export { distance } from './utils/distance'
export { dhashFromImageData }

export interface ImageDataLike {
  width: number
  height: number
  data: Uint8Array | Uint8ClampedArray
}

export const getImageData = (path: string): Promise<ImageDataLike> => {
  // for browser
  if (typeof document === 'object') {
    return getImageDataForBrowser(path)
  }

  if (path.endsWith('.png')) {
    return getPngImageData(path)
  }

  if (path.endsWith('.gif')) {
    return getGifImageData(path)
  }

  // JPEG
  return getJpegImageData(path)
}

export const dhash = async (image: string | ImageDataLike) => {
  const imageData = typeof image === 'string' ? await getImageData(image) : image

  return dhashFromImageData(imageData)
}
