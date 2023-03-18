import 'vi-fetch/setup'
import { readFile } from 'fs/promises'
import Jimp from 'jimp'
import { mockFetch, mockGet } from 'vi-fetch'
import { beforeEach, describe, expect, it } from 'vitest'
import { dhash, dhashFromImageData, distance } from '../src'

const MANDRILL_JPEG_HASH = '0001111110101011111010100110100001101000001110000101001001101000'

beforeEach(() => {
  mockFetch.clearAll()
})

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

  it('fetch jpeg', async () => {
    const data = await readFile(`${__dirname}/images/mandrill.jpg`)

    const mock = mockGet('http://localhost/images/mandrill.jpg')
    mock.withHeaders([['Content-Type', 'image/jpeg']])
    mock.willResolve(data.buffer)

    const hash = await dhash('http://localhost/images/mandrill.jpg')

    expect(hash).toBe(MANDRILL_JPEG_HASH)
  })
  it('fetch png', async () => {
    const data = await readFile(`${__dirname}/images/mandrill.png`)

    const mock = mockGet('http://localhost/images/mandrill.png')
    mock.withHeaders([['Content-Type', 'image/png']])
    mock.willResolve(data.buffer)

    const hash = await dhash('http://localhost/images/mandrill.png')
    const diff = distance(hash, MANDRILL_JPEG_HASH)

    expect(diff).toBeLessThanOrEqual(10)
    expect(hash).matchSnapshot()
  })

  it('fetch gif', async () => {
    const data = await readFile(`${__dirname}/images/mandrill.gif`)

    const mock = mockGet('http://localhost/images/mandrill.gif')
    mock.withHeaders([['Content-Type', 'image/gif']])
    mock.willResolve(data.buffer)

    const hash = await dhash('http://localhost/images/mandrill.gif')
    const diff = distance(hash, MANDRILL_JPEG_HASH)

    expect(diff).toBeLessThanOrEqual(10)
    expect(hash).matchSnapshot()
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
