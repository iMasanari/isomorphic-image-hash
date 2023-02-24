import { readFile } from 'fs/promises'
import { GifReader } from 'omggif'

export const getGifImageData = async (path: string) => {
  const data = await readFile(path)
  const image = new GifReader(data)
  const gifData = new Uint8ClampedArray(image.width * image.height * 4)

  image.decodeAndBlitFrameRGBA(0, gifData)

  return {
    width: image.width,
    height: image.height,
    data: gifData,
  }
}
