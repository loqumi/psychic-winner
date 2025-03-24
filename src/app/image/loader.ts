'use client'

export default function imageLoader({
    src,
    width,
    quality = 75,
}: {
    src: string
    width: number
    quality?: number
}) {

    return `${src}/${width}/${Math.round(width * 0.5)}?q=${quality}`
}