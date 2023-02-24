import { createReadStream } from 'fs'
import { PNG } from 'pngjs'

export const getPngImageData = async (path: string) => {
  return new Promise<PNG>(resolve =>
    createReadStream(path)
      .pipe(new PNG({ colorType: 6 }))
      .on('parsed', function () { resolve(this) })
  )
}
