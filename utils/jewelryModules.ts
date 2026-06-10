// utils/jewelryModules.ts

const toPixels = (landmark: { x: number; y: number }, canvas: HTMLCanvasElement) => ({
  x: landmark.x * canvas.width,
  y: landmark.y * canvas.height,
});

export const JewelryModules = {
  // 1. FOREHEAD PENDANT (Maang Tikka)
  renderForehead: (faceLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return;
    const centerForehead = toPixels(faceLandmarks[10], canvas);
    
    ctx.fillStyle = "#3b82f6"; // Blue placeholder
    ctx.beginPath(); 
    ctx.arc(centerForehead.x, centerForehead.y, 8, 0, 2 * Math.PI); 
    ctx.fill();
  },

  // 2. NOSEPIN
  renderNosepin: (faceLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return;
    const leftNostril = toPixels(faceLandmarks[279], canvas);
    
    ctx.fillStyle = "#ef4444"; // Red placeholder
    ctx.beginPath(); 
    ctx.arc(leftNostril.x, leftNostril.y, 5, 0, 2 * Math.PI); 
    ctx.fill();
  },

  // 3. EARRINGS (With Gravity Alignment Alignment Override)
  renderEarrings: (faceLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return;
    const leftEar = toPixels(faceLandmarks[234], canvas);
    const rightEar = toPixels(faceLandmarks[454], canvas);

    const dropLength = 35; // Simulates hanging line
    ctx.strokeStyle = "#eab308"; // Gold placeholder
    ctx.lineWidth = 4;
    
    // Left Ear: Draws perfectly vertical downwards along the canvas Y-axis
    ctx.sidebar = "round";
    ctx.beginPath(); 
    ctx.moveTo(leftEar.x, leftEar.y); 
    ctx.lineTo(leftEar.x, leftEar.y + dropLength); 
    ctx.stroke();

    // Right Ear
    ctx.beginPath(); 
    ctx.moveTo(rightEar.x, rightEar.y); 
    ctx.lineTo(rightEar.x, rightEar.y + dropLength); 
    ctx.stroke();
  },

  // 4. NECKLACE (Using Pose Landmarks to find the center of your collarbones)
  renderNecklace: (poseLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!poseLandmarks || poseLandmarks.length === 0) return;
    
    // Landmark 11 is Left Shoulder, Landmark 12 is Right Shoulder
    const leftShoulder = toPixels(poseLandmarks[11], canvas);
    const rightShoulder = toPixels(poseLandmarks[12], canvas);

    // Dynamic midpoint calculation (Suprasternal Notch)
    const collarboneX = (leftShoulder.x + rightShoulder.x) / 2;
    const collarboneY = (leftShoulder.y + rightShoulder.y) / 2;

    // Draw Necklace Center hanging mass
    ctx.fillStyle = "#a855f7"; // Purple placeholder
    ctx.beginPath(); 
    ctx.arc(collarboneX, collarboneY, 14, 0, 2 * Math.PI); 
    ctx.fill();
    
    // Draw string loops wrapping out to the shoulders
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 3;
    ctx.beginPath(); 
    ctx.moveTo(leftShoulder.x, leftShoulder.y); 
    ctx.lineTo(collarboneX, collarboneY); 
    ctx.lineTo(rightShoulder.x, rightShoulder.y); 
    ctx.stroke();
  }
};