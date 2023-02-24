import Jimp from 'jimp'
import { describe, expect, it } from 'vitest'
import { dhash, dhashFromImageData, distance } from '../src'

const MANDRILL_JPEG_HASH = '0001111110101011111010100110100001101000001110000101001001101000'

describe('dhash', () => {
  it('read jpeg', async () => {
    const hash = await dhash(`${__dirname}/images/mandrill.jpg`)

    expect(hash).toBe(MANDRILL_JPEG_HASH)
  })

  it('read png', async () => {
    const hash = await dhash(`${__dirname}/images/mandrill.png`)
    const diff = distance(hash, MANDRILL_JPEG_HASH)

    expect(diff).toBeLessThanOrEqual(10)
    expect(hash).matchSnapshot()
  })

  it('read gif', async () => {
    const hash = await dhash(`${__dirname}/images/mandrill.gif`)
    const diff = distance(hash, MANDRILL_JPEG_HASH)

    expect(diff).toBeLessThanOrEqual(10)
    expect(hash).matchSnapshot()
  })

  it('read imageData', async () => {
    const { bitmap } = await Jimp.read(`${__dirname}/images/mandrill.jpg`)

    const hash = await dhash({
      width: bitmap.width,
      height: bitmap.height,
      data: new Uint8ClampedArray(bitmap.data),
    })

    expect(hash).toBe(MANDRILL_JPEG_HASH)
  })
})

describe('dhashFromImageData', () => {
  it('read imageData', async () => {
    const { bitmap } = await Jimp.read(`${__dirname}/images/mandrill.jpg`)

    const hash = dhashFromImageData({
      width: bitmap.width,
      height: bitmap.height,
      data: new Uint8ClampedArray(bitmap.data),
    })

    expect(hash).toBe(MANDRILL_JPEG_HASH)
  })
})
