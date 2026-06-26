// utils/jewelry/debug.ts
import { toPixels } from "./types";

export const drawDebug3D = (
  faceLandmarks: any[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  category: string,
  hasAsset: boolean
) => {
  if (!faceLandmarks || faceLandmarks.length === 0) return;

  // 1. COMPUTE UNIVERSIAL TELEMETRY MATH FOR THE HUD
  const leftEar = toPixels(faceLandmarks[234], canvas);
  const rightEar = toPixels(faceLandmarks[454], canvas);
  const noseTip = toPixels(faceLandmarks[1], canvas);

  const deltaX = rightEar.x - leftEar.x;
  const deltaY = rightEar.y - leftEar.y;
  const rollAngle = Math.atan2(deltaY, deltaX);

  const faceWidthPixels = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const earMidpointX = (leftEar.x + rightEar.x) / 2;
  const maxShift = faceWidthPixels / 2;
  const yawFactor = (noseTip.x - earMidpointX) / maxShift;

  ctx.save();

  // --- PASS A: DRAW THE REAL-TIME 3D HUD (COUNTER-FLIPPED FOR CSS) ---
  ctx.setTransform(1, 0, 0, 1, 0, 0); 
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1); // Cancels out Tailwind's scale-x-[-1] mirroring
  
  ctx.fillStyle = "rgba(9, 9, 11, 0.9)"; // Dark zinc background
  ctx.strokeStyle = "rgba(63, 63, 70, 0.4)";
  ctx.lineWidth = 1;
  ctx.fillRect(20, 20, 260, 110);
  ctx.strokeRect(20, 20, 260, 110);

  ctx.fillStyle = "#00ffcc"; // Neon Cyan telemetry fonts
  ctx.font = "bold 12px monospace";
  ctx.fillText(`[SYSTEM TELEMETRY HUD]`, 35, 42);
  
  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Active Mode:  ${category.toUpperCase()}`, 35, 62);
  ctx.fillText(`Yaw (Rotate): ${yawFactor.toFixed(3)}`, 35, 80);
  ctx.fillText(`Roll (Tilt):  ${rollAngle.toFixed(3)}`, 35, 98);
  ctx.fillText(`Asset Cached: ${hasAsset ? "TRUE" : "FALSE"}`, 35, 116);
  
  // Restore default matrix positions for drawing overlay dots on structural coordinates
  ctx.setTransform(1, 0, 0, 1, 0, 0); 

  // --- PASS B: DRAW THE 468 NEURAL SKELETON POINTS ---
  faceLandmarks.forEach((lm, index) => {
    const pt = toPixels(lm, canvas);
    
    // Depth Visualizer: Points closer to camera (negative Z) are brighter and larger
    // Points further back (positive Z) fade away
    const depthRadius = Math.max(1, 3 - pt.z * 10);
    const depthAlpha = Math.max(0.2, 1 - pt.z * 3);

    // Highlight only our critical jewelry anchor indices in bright neon neon red
    const isAnchor = [1, 9, 10, 44, 49, 234, 279, 454].includes(index);

    ctx.beginPath();
    ctx.arc(pt.x, pt.y, isAnchor ? 4 : depthRadius, 0, 2 * Math.PI);
    ctx.fillStyle = isAnchor ? "#ff0055" : `rgba(0, 255, 204, ${depthAlpha})`;
    ctx.fill();

    // Label key indices for easier adjustment mapping
    if (isAnchor) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "9px monospace";
      ctx.fillText(index.toString(), pt.x + 6, pt.y - 4);
    }
  });

  // --- PASS C: DRAW VECTOR CONNECTIVITY PLANES ---
  ctx.lineWidth = 1.5;
  if (category === "nosepin") {
    const leftNostril = toPixels(faceLandmarks[279], canvas);
    const rightNostril = toPixels(faceLandmarks[44], canvas);
    const noseTip = toPixels(faceLandmarks[1], canvas);

    // Draw the 3D triangular nose plate vector group
    ctx.strokeStyle = "rgba(255, 255, 0, 0.6)"; // Yellow tracking plane
    ctx.beginPath();
    ctx.moveTo(leftNostril.x, leftNostril.y);
    ctx.lineTo(rightNostril.x, rightNostril.y);
    ctx.lineTo(noseTip.x, noseTip.y);
    ctx.closePath();
    ctx.stroke();
  }

  if (category === "forehead") {
    const hairline = toPixels(faceLandmarks[10], canvas);
    const glabella = toPixels(faceLandmarks[9], canvas);
    const leftEar = toPixels(faceLandmarks[234], canvas);
    const rightEar = toPixels(faceLandmarks[454], canvas);

    // Draw a diamond tracking grid across the forehead skull structure
    ctx.strokeStyle = "rgba(255, 0, 255, 0.6)"; // Magenta plane
    ctx.beginPath();
    ctx.moveTo(hairline.x, hairline.y);
    ctx.lineTo(leftEar.x, leftEar.y);
    ctx.lineTo(glabella.x, glabella.y);
    ctx.lineTo(rightEar.x, rightEar.y);
    ctx.closePath();
    ctx.stroke();
  }

  ctx.restore();
};

// Add this new function to the bottom of frontend/utils/jewelry/debug.ts

export const drawPoseDebug3D = (
  poseLandmarks: any[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  hasAsset: boolean
) => {
  if (!poseLandmarks || poseLandmarks.length === 0) return;

  const leftShoulder = { x: poseLandmarks[11].x * canvas.width, y: poseLandmarks[11].y * canvas.height, z: poseLandmarks[11].z };
  const rightShoulder = { x: poseLandmarks[12].x * canvas.width, y: poseLandmarks[12].y * canvas.height, z: poseLandmarks[12].z };

  const deltaX = rightShoulder.x - leftShoulder.x;
  const deltaY = rightShoulder.y - leftShoulder.y;
  const rollAngle = Math.atan2(deltaY, deltaX);
  const shoulderDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const depthDiff = leftShoulder.z - rightShoulder.z;

  ctx.save();

  // --- PASS A: BODY TELEMETRY HUD (COUNTER-FLIPPED) ---
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  ctx.fillStyle = "rgba(9, 9, 11, 0.95)";
  ctx.strokeStyle = "rgba(63, 63, 70, 0.5)";
  ctx.fillRect(20, 20, 260, 110);
  ctx.strokeRect(20, 20, 260, 110);

  ctx.fillStyle = "#00ffcc";
  ctx.font = "bold 12px monospace";
  ctx.fillText(`[BODY TELEMETRY HUD]`, 35, 42);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`Active Mode:  NECKLACE`, 35, 62);
  ctx.fillText(`Shoulder Span: ${shoulderDistance.toFixed(1)}px`, 35, 80);
  ctx.fillText(`Torso Roll:   ${rollAngle.toFixed(3)} rad`, 35, 98);
  ctx.fillText(`Torso Depth:  ${depthDiff.toFixed(3)}`, 35, 116);

  ctx.setTransform(1, 0, 0, 1, 0, 0);

  // --- PASS B: SKELETON WIREFRAME TRACKS ---
  // Draw points 0 through 12 to capture head, neck, and shoulder baselines
  poseLandmarks.forEach((lm, index) => {
    if (index > 12) return; // Prevent lower leg landmarks from cluttering screen frame
    const x = lm.x * canvas.width;
    const y = lm.y * canvas.height;
    const isAnchor = [11, 12].includes(index);

    ctx.beginPath();
    ctx.arc(x, y, isAnchor ? 5 : 2.5, 0, 2 * Math.PI);
    ctx.fillStyle = isAnchor ? "#ff0055" : "rgba(0, 255, 204, 0.7)";
    ctx.fill();

    if (isAnchor) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "10px monospace";
      ctx.fillText(index === 11 ? "L_SHOULDER [11]" : "R_SHOULDER [12]", x + 8, y - 4);
    }
  });

  // Draw vector bridge connecting across shoulder blades
  ctx.strokeStyle = "rgba(255, 255, 0, 0.6)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftShoulder.x, leftShoulder.y);
  ctx.lineTo(rightShoulder.x, rightShoulder.y);
  ctx.stroke();

  ctx.restore();
};