// frontend/utils/jewelry/earring.ts
import { toPixels } from "./types";

export const renderEarrings = (
  faceLandmarks: any[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imgElement: HTMLImageElement | null
) => {
  if (!faceLandmarks || faceLandmarks.length === 0 || !imgElement || !imgElement.complete) return;

  const leftEar = toPixels(faceLandmarks[234], canvas);
  const rightEar = toPixels(faceLandmarks[454], canvas);
  const noseTip = toPixels(faceLandmarks[1], canvas);

  const deltaX = rightEar.x - leftEar.x;
  const deltaY = rightEar.y - leftEar.y;
  const rollAngle = Math.atan2(deltaY, deltaX);

  const faceWidthPixels = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const baseWidth = faceWidthPixels * 0.18;
  const baseHeight = baseWidth * (imgElement.height / imgElement.width);

  const earMidpointX = (leftEar.x + rightEar.x) / 2;
  const maxShift = faceWidthPixels / 2;
  const yawFactor = (noseTip.x - earMidpointX) / maxShift;

  const ears = [
    {
      coords: leftEar,
      isRight: false,
      fudgeScaleX: Math.max(0.35, 1 - Math.abs(yawFactor) * 1.2),
      visible: leftEar.z < rightEar.z + 0.05
    },
    {
      coords: rightEar,
      isRight: true,
      fudgeScaleX: Math.max(0.35, 1 - Math.abs(yawFactor) * 1.2),
      visible: rightEar.z < leftEar.z + 0.05
    }
  ];

  ears.forEach((ear) => {
    if (!ear.visible) return;

    ctx.save();
    ctx.translate(ear.coords.x, ear.coords.y);
    ctx.rotate(rollAngle);

    const horizontalMirror = ear.isRight ? -1 : 1;
    ctx.scale(baseWidth * ear.fudgeScaleX * horizontalMirror, baseHeight);
    ctx.rotate(-rollAngle * 0.4); // Gravity swing simulation

    ctx.drawImage(imgElement, -0.5, 0, 1, 1);
    ctx.restore();
  });
};