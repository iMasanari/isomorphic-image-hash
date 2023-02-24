// 下記のアルゴリズムを元に実装
// 
// JavaScript Image Resizer (c) 2012 - Grant Galitz (public domain)
// https://github.com/taisel/JS-Image-Resizer

import { ImageDataLike } from '..'

const colorChannels = 4

export const resize = (imageData: ImageDataLike, width: number, height: number) => {
  const resizedWidthData = resizeWidth(imageData.data, imageData.width, imageData.height, width)
  const data = resizeHeight(resizedWidthData, width, imageData.height, height)

  return { width, height, data }
}

const resizeWidth = (buffer: Uint8Array | Uint8ClampedArray, originalWidth: number, originalHeight: number, targetWidth: number) => {
  if (originalWidth === targetWidth) {
    return buffer
  }

  const targetWidthMultipliedByChannels = targetWidth * colorChannels
  const originalWidthMultipliedByChannels = originalWidth * colorChannels
  const originalHeightMultipliedByChannels = originalHeight * colorChannels
  const widthPassResultSize = targetWidthMultipliedByChannels * originalHeight

  const nextLineOffsetOriginalWidth = originalWidthMultipliedByChannels - 3
  const nextLineOffsetTargetWidth = targetWidthMultipliedByChannels - 3

  const ratioWeight = originalWidth / targetWidth
  const ratioWeightDivisor = 1 / ratioWeight

  let weight = 0
  let amountToNext = 0
  let actualPosition = 0
  let currentPosition = 0
  let line = 0
  let pixelOffset = 0
  let outputOffset = 0

  const output = new Float32Array(originalHeightMultipliedByChannels)
  const outputBuffer = new Float32Array(widthPassResultSize)

  do {
    for (line = 0; line < originalHeightMultipliedByChannels;) {
      output[line++] = 0
      output[line++] = 0
      output[line++] = 0
      output[line++] = 0
    }
    weight = ratioWeight
    do {
      amountToNext = 1 + actualPosition - currentPosition
      if (weight >= amountToNext) {
        for (line = 0, pixelOffset = actualPosition; line < originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetOriginalWidth) {
          output[line++] += buffer[pixelOffset++] * amountToNext
          output[line++] += buffer[pixelOffset++] * amountToNext
          output[line++] += buffer[pixelOffset++] * amountToNext
          output[line++] += buffer[pixelOffset] * amountToNext
        }
        currentPosition = actualPosition = actualPosition + 4
        weight -= amountToNext
      }
      else {
        for (line = 0, pixelOffset = actualPosition; line < originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetOriginalWidth) {
          output[line++] += buffer[pixelOffset++] * weight
          output[line++] += buffer[pixelOffset++] * weight
          output[line++] += buffer[pixelOffset++] * weight
          output[line++] += buffer[pixelOffset] * weight
        }
        currentPosition += weight
        break
      }
    } while (weight > 0 && actualPosition < originalWidthMultipliedByChannels)
    for (line = 0, pixelOffset = outputOffset; line < originalHeightMultipliedByChannels; pixelOffset += nextLineOffsetTargetWidth) {
      outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor
      outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor
      outputBuffer[pixelOffset++] = output[line++] * ratioWeightDivisor
      outputBuffer[pixelOffset] = output[line++] * ratioWeightDivisor
    }
    outputOffset += 4
  } while (outputOffset < targetWidthMultipliedByChannels)
  return outputBuffer
}

const resizeHeight = (buffer: Uint8Array | Uint8ClampedArray | Float32Array, originalWidth: number, originalHeight: number, targetHeight: number) => {
  if (originalHeight === targetHeight) {
    return new Uint8ClampedArray(buffer)
  }

  const targetWidthMultipliedByChannels = originalWidth * colorChannels
  const widthPassResultSize = targetWidthMultipliedByChannels * originalHeight
  const finalResultSize = targetWidthMultipliedByChannels * targetHeight

  const ratioWeight = originalHeight / targetHeight
  const ratioWeightDivisor = 1 / ratioWeight

  let weight = 0
  let amountToNext = 0
  let actualPosition = 0
  let currentPosition = 0
  let pixelOffset = 0
  let outputOffset = 0

  const output = new Float32Array(targetWidthMultipliedByChannels)
  const outputBuffer = new Uint8ClampedArray(finalResultSize)

  do {
    for (pixelOffset = 0; pixelOffset < targetWidthMultipliedByChannels;) {
      output[pixelOffset++] = 0
      output[pixelOffset++] = 0
      output[pixelOffset++] = 0
      output[pixelOffset++] = 0
    }
    weight = ratioWeight
    do {
      amountToNext = 1 + actualPosition - currentPosition
      if (weight >= amountToNext) {
        for (pixelOffset = 0; pixelOffset < targetWidthMultipliedByChannels;) {
          output[pixelOffset++] += buffer[actualPosition++] * amountToNext
          output[pixelOffset++] += buffer[actualPosition++] * amountToNext
          output[pixelOffset++] += buffer[actualPosition++] * amountToNext
          output[pixelOffset++] += buffer[actualPosition++] * amountToNext
        }
        currentPosition = actualPosition
        weight -= amountToNext
      }
      else {
        for (pixelOffset = 0, amountToNext = actualPosition; pixelOffset < targetWidthMultipliedByChannels;) {
          output[pixelOffset++] += buffer[amountToNext++] * weight
          output[pixelOffset++] += buffer[amountToNext++] * weight
          output[pixelOffset++] += buffer[amountToNext++] * weight
          output[pixelOffset++] += buffer[amountToNext++] * weight
        }
        currentPosition += weight
        break
      }
    } while (weight > 0 && actualPosition < widthPassResultSize)
    for (pixelOffset = 0; pixelOffset < targetWidthMultipliedByChannels;) {
      outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor)
      outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor)
      outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor)
      outputBuffer[outputOffset++] = Math.round(output[pixelOffset++] * ratioWeightDivisor)
    }
  } while (outputOffset < finalResultSize)

  return outputBuffer
}
