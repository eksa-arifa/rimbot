import sharp from "sharp";


export async function addTextBelowImage(imageBuffer: Buffer, text: string) {
    if (text.length >= 16) {
        return imageBuffer
    }

    const width = 512;
    const height = 512;
    const fontSize = 60;

    const svg = `
    <svg width="${width}" height="${height}">
      <style>
        .title {
          fill: white;
          font-size: ${fontSize}px;
          font-weight: bold;
          text-anchor: middle;
          stroke: black;
          stroke-width: 3px;
          paint-order: stroke;
        }
      </style>
      <text x="50%" y="${height - 20}" class="title">${text}</text>
    </svg>
  `;

    const result = await sharp(imageBuffer)
        .resize(width, height, { fit: "cover" })
        .composite([{ input: Buffer.from(svg), gravity: "south" }])
        .toBuffer();

    return result;
}
