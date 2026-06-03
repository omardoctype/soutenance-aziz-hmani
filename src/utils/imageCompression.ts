const MAX_IMAGE_WIDTH = 1600
const MAX_IMAGE_HEIGHT = 1600
const JPEG_QUALITY = 0.82
const OUTPUT_TYPE = 'image/jpeg'

type DrawableImage = HTMLImageElement | ImageBitmap

const getJpegFilename = (filename: string) => {
  const baseName = filename.replace(/\.[^/.]+$/, '').trim() || 'photo'
  return `${baseName}.jpg`
}

const getResizeDimensions = (width: number, height: number) => {
  const ratio = Math.min(
    1,
    MAX_IMAGE_WIDTH / width,
    MAX_IMAGE_HEIGHT / height,
  )

  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  }
}

const canvasToBlob = (canvas: HTMLCanvasElement) =>
  new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Impossible d'optimiser la photo."))
          return
        }

        resolve(blob)
      },
      OUTPUT_TYPE,
      JPEG_QUALITY,
    )
  })

const loadImageElement = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    const objectUrl = URL.createObjectURL(file)

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error("Impossible de lire cette photo."))
    }

    image.src = objectUrl
  })

const loadDrawableImage = async (file: File): Promise<DrawableImage> => {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      // Some browsers do not support every camera format through ImageBitmap.
      // The HTMLImageElement fallback still handles regular image uploads.
    }
  }

  return loadImageElement(file)
}

const closeDrawableImage = (source: DrawableImage) => {
  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    source.close()
  }
}

const getSourceDimensions = (source: DrawableImage) => {
  if (source instanceof HTMLImageElement) {
    return {
      width: source.naturalWidth,
      height: source.naturalHeight,
    }
  }

  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
    return {
      width: source.width,
      height: source.height,
    }
  }

  throw new Error("Impossible d'optimiser cette photo.")
}

export const compressImage = async (file: File): Promise<File> => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Seules les photos sont acceptées.')
  }

  const source = await loadDrawableImage(file)

  try {
    const sourceDimensions = getSourceDimensions(source)

    if (sourceDimensions.width <= 0 || sourceDimensions.height <= 0) {
      throw new Error("Impossible d'optimiser cette photo.")
    }

    const dimensions = getResizeDimensions(
      sourceDimensions.width,
      sourceDimensions.height,
    )
    const canvas = document.createElement('canvas')
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error("Impossible d'optimiser la photo.")
    }

    context.drawImage(source, 0, 0, dimensions.width, dimensions.height)

    const blob = await canvasToBlob(canvas)

    return new File([blob], getJpegFilename(file.name), {
      type: OUTPUT_TYPE,
      lastModified: Date.now(),
    })
  } catch (error) {
    if (error instanceof Error && error.message.trim().length > 0) {
      throw error
    }

    throw new Error("Impossible d'optimiser la photo.")
  } finally {
    closeDrawableImage(source)
  }
}
