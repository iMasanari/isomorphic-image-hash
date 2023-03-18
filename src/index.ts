import { dhashFromImageData } from './hash/dhash'
import { getImageDataForBrowser } from './image-data/browser'
import { getImageDataForNode } from './image-data/node'

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

  return getImageDataForNode(path)
}

export const dhash = async (image: string | ImageDataLike) => {
  const imageData = typeof image === 'string' ? await getImageData(image) : image

  return dhashFromImageData(imageData)
}
