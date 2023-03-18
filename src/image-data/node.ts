import { readFile } from 'fs/promises'
import { extname } from 'path'
import { decode as decodeJpeg } from 'jpeg-js'
import { GifReader } from 'omggif'
import { PNG } from 'pngjs'

export const getImageDataForNode = async (path: string) => {
  if (path.match(/^(http|ftp)s?:\/\/./)) {
    const res = await fetch(path)
    const body = await res.arrayBuffer()
    const data = Buffer.from(body)

    switch (res.headers.get('Content-Type')) {
      case 'image/gif': return readGif(data)
      case 'image/png': return readPng(data)
      // 'image/jpeg'
      default: return readJpeg(data)
    }
  }

  const data = await readFile(path)

  switch (extname(path)) {
    case '.gif': return readGif(data)
    case '.png': return readPng(data)
    // '.jpg', '.jpeg'
    default: return readJpeg(data)
  }
}


const readGif = (data: Buffer) => {
  const image = new GifReader(data)
  const gifData = new Uint8ClampedArray(image.width * image.height * 4)

  image.decodeAndBlitFrameRGBA(0, gifData)

  return {
    width: image.width,
    height: image.height,
    data: gifData,
  }
}

const readJpeg = (data: Buffer) => {
  return decodeJpeg(data, { useTArray: true })
}

const readPng = (data: Buffer) => {
  return PNG.sync.read(data)
}
