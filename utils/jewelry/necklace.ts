// utils/jewelry/necklace.ts
import { Landmark } from "./types";

export const renderNecklace = (
  poseLandmarks: any[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  imgElement: HTMLImageElement | null
) => {
  if (!poseLandmarks || poseLandmarks.length === 0 || !imgElement || !imgElement.complete) return;

  // 1. EXTRACT ANCHORS
  const leftShoulder = {
    x: poseLandmarks[11].x * canvas.width,
    y: poseLandmarks[11].y * canvas.height,
    z: poseLandmarks[11].z
  };
  const rightShoulder = {
    x: poseLandmarks[12].x * canvas.width,
    y: poseLandmarks[12].y * canvas.height,
    z: poseLandmarks[12].z
  };

  // 2. FIXED MIRROR VECTOR MATH
  // Inverting the subtraction order cancels out the 180-degree upside-down flip 
  // caused by the Tailwind CSS browser reflection mirror layout.
  const deltaX = leftShoulder.x - rightShoulder.x; 
  const deltaY = leftShoulder.y - rightShoulder.y;
  
  const rollAngle = Math.atan2(deltaY, deltaX);
  const shoulderDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  const midX = (leftShoulder.x + rightShoulder.x) / 2;
  const midY = (leftShoulder.y + rightShoulder.y) / 2;

  const baseWidth = shoulderDistance * 0.58; 
  const baseHeight = baseWidth * (imgElement.height / imgElement.width);

  const depthDifference = leftShoulder.z - rightShoulder.z;
  const compressionX = Math.max(0.38, 1 - Math.abs(depthDifference) * 1.6);

  // 3. CAM BOUNDARY FALLBACK (Anti-Face Floating Protection)
  // If your shoulders are cut off at the very bottom edge of your monitor frame,
  // we push the target center downwards so it doesn't clip up onto your chin.
  const isCloseToBottom = midY > canvas.height * 0.85;
  const neckOffsetY = isCloseToBottom ? -shoulderDistance * 0.15 : shoulderDistance * 0.08;

  // 4. TRANSFORM & DRAW
  ctx.save();
  
  // Apply translation path cleanly downwards from the computed spine center
  ctx.translate(midX, midY - neckOffsetY);
  ctx.rotate(rollAngle);
  ctx.scale(baseWidth * compressionX, baseHeight);

  // Draw the asset hanging naturally downwards
  ctx.drawImage(imgElement, -0.5, 0, 1, 1);
  
  ctx.restore();
};