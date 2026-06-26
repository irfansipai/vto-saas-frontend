import { toPixels } from "./types";

export const renderNosepin = (
  faceLandmarks: any[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imgElement: HTMLImageElement | null
) => {
  if (!faceLandmarks || faceLandmarks.length === 0 || !imgElement || !imgElement.complete) return;

  const leftEar = toPixels(faceLandmarks[234], canvas);
  const rightEar = toPixels(faceLandmarks[454], canvas);
  const noseTip = toPixels(faceLandmarks[1], canvas);
  const leftNostril = toPixels(faceLandmarks[279], canvas);
  const rightNostril = toPixels(faceLandmarks[44], canvas);

  const deltaX = rightEar.x - leftEar.x;
  const deltaY = rightEar.y - leftEar.y;
  const rollAngle = Math.atan2(deltaY, deltaX);

  const noseWidthPixels = Math.sqrt(
    Math.pow(rightNostril.x - leftNostril.x, 2) + Math.pow(rightNostril.y - leftNostril.y, 2)
  );
  const baseSize = noseWidthPixels * 0.32;

  const earMidpointX = (leftEar.x + rightEar.x) / 2;
  const maxShift = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2;
  const yawFactor = (noseTip.x - earMidpointX) / maxShift;

  // CULLING MATRIX: Hide left nostril pin if head rotates past threshold LEFT
  if (yawFactor > 0.6) return;

  let compressionX = 1 - yawFactor * 0.6;
  compressionX = Math.max(0.35, Math.min(1.2, compressionX));

  ctx.save();
  ctx.translate(leftNostril.x, leftNostril.y);
  ctx.rotate(rollAngle);
  ctx.scale(baseSize * compressionX, baseSize);

  ctx.drawImage(imgElement, -0.5, -0.5, 1, 1);
  ctx.restore();
};