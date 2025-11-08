import { createCanvas, loadImage } from "canvas";

export async function addTextBelowImage(imageBuffer: Buffer, text: string) {
  if (text.length >= 16) return imageBuffer;

  const width = 512;
  const height = 512;
  const canvas = createCanvas(width, height + 80);
  const ctx = canvas.getContext("2d");

  const img = await loadImage(imageBuffer);
  ctx.drawImage(img, 0, 0, width, height);

  ctx.font = "bold 60px Sans";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 6;
  ctx.strokeText(text, width / 2, height + 60);
  ctx.fillText(text, width / 2, height + 60);

  return canvas.toBuffer("image/png");
}
