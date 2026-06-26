import { toPixels } from "./types";

export const renderForehead = (
  faceLandmarks: any[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imgElement: HTMLImageElement | null
) => {
  if (!faceLandmarks || faceLandmarks.length === 0 || !imgElement || !imgElement.complete) return;

  // 1. EXTRACT CENTER HEIGHT ANCHORS
  const hairline = toPixels(faceLandmarks[10], canvas);
  const glabella = toPixels(faceLandmarks[9], canvas);
  const leftEar = toPixels(faceLandmarks[234], canvas);
  const rightEar = toPixels(faceLandmarks[454], canvas);
  const noseTip = toPixels(faceLandmarks[1], canvas);

  // 2. DETECT MOTION METRICS
  const deltaX = rightEar.x - leftEar.x;
  const deltaY = rightEar.y - leftEar.y;
  const rollAngle = Math.atan2(deltaY, deltaX);

  // Compute local height directly from hairline-to-brow span (Handles Pitch free)
  const foreheadHeight = Math.sqrt(
    Math.pow(glabella.x - hairline.x, 2) + Math.pow(glabella.y - hairline.y, 2)
  );

  const baseHeight = foreheadHeight * 1.1; // Proportional pendant scaling
  const baseWidth = baseHeight * (imgElement.width / imgElement.height);

  // Compute Yaw Factor for horizontal compression
  const earMidpointX = (leftEar.x + rightEar.x) / 2;
  const maxShift = Math.sqrt(deltaX * deltaX + deltaY * deltaY) / 2;
  const yawFactor = (noseTip.x - earMidpointX) / maxShift;

  const compressionX = Math.max(0.35, 1 - Math.abs(yawFactor) * 0.8);

  ctx.save();
  
  // 3. APPLY ROTATIONAL MATRIX ON HAIRLINE ORIGIN
  ctx.translate(hairline.x, hairline.y);
  ctx.rotate(rollAngle);

  // Apply 3D compression transform tracking
  ctx.scale(baseWidth * compressionX, baseHeight);

  // 4. DRAW GRAPHIC
  // Anchor horizontally center (-0.5), let the asset drape downwards from hairline (0)
  ctx.drawImage(imgElement, -0.5, 0, 1, 1);
  ctx.restore();
};