import sharp from "sharp"

export async function makeSticker(buffer: Buffer) {

    const webpBuffer = await sharp(buffer)
        .resize(512, 512, { fit: "cover" })
        .webp({ quality: 100 })
        .toBuffer();


    return webpBuffer
}
