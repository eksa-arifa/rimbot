import { createCanvas, loadImage } from "canvas";

export async function addTextBelowImage(imageBuffer: Buffer, text: string) {
  const stickerSize = 512;
  const canvas = createCanvas(stickerSize, stickerSize);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, stickerSize, stickerSize);

  const img = await loadImage(imageBuffer);
  
  if (text.length >= 16 || text.length == 0) {
    ctx.drawImage(img, 0, 0, stickerSize, stickerSize);
  } else {
    const imgHeight = 432;
    ctx.drawImage(img, 0, 0, stickerSize, imgHeight);

    ctx.font = "bold 50px Sans";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeText(text, stickerSize / 2, imgHeight + 55);
    ctx.fillText(text, stickerSize / 2, imgHeight + 55);
  }

  return canvas.toBuffer("image/png");
}