import { createCanvas, loadImage } from "canvas";

export async function addTextBelowImage(imageBuffer: Buffer, text: string) {
  const stickerSize = 512;
  const canvas = createCanvas(stickerSize, stickerSize);
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, stickerSize, stickerSize);

  const img = await loadImage(imageBuffer);

  const imgAspect = img.width / img.height;
  const canvasAspect = 1;

  let sx = 0, sy = 0, sw = img.width, sh = img.height;

  if (imgAspect > canvasAspect) {
    sw = img.height * canvasAspect;
    sx = (img.width - sw) / 2;
  } else if (imgAspect < canvasAspect) {
    sh = img.width / canvasAspect;
    sy = (img.height - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, stickerSize, stickerSize);

  if (text && text.trim().length > 0 && text.length <= 18 ) {
    const imgHeight = 432;
    const textY = imgHeight + 55;

    ctx.clearRect(0, 0, stickerSize, stickerSize);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, stickerSize, imgHeight);

    ctx.font = "bold 50px Sans";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 5;
    ctx.strokeText(text, stickerSize / 2, textY);
    ctx.fillText(text, stickerSize / 2, textY);
  }

  return canvas.toBuffer("image/png");
}
