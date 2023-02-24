import { readFile } from 'fs/promises'
import { decode } from 'jpeg-js'

export const getJpegImageData = async (path: string) => {
  const data = await readFile(path)

  return decode(data, { useTArray: true })
}
