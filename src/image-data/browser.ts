export const getImageDataForBrowser = async (path: string) => {
  const image = new Image()
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  await new Promise(resolve => {
    image.onload = resolve
    image.src = path
  })

  canvas.width = image.width
  canvas.height = image.height

  ctx.drawImage(image, 0, 0)

  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}
