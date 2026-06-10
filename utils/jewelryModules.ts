// utils/jewelryModules.ts

const toPixels = (landmark: { x: number; y: number }, canvas: HTMLCanvasElement) => ({
  x: landmark.x * canvas.width,
  y: landmark.y * canvas.height,
});

export const JewelryModules = {
  // MODULE: NOSEPIN (Now accepts a preloaded HTMLImageElement)
  renderNosepin: (
    faceLandmarks: any[], 
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    imgElement: HTMLImageElement | null
  ) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return;
    const leftNostril = toPixels(faceLandmarks[279], canvas);
    
    if (imgElement && imgElement.complete) {
      // Define structural dimensions for the nosepin image
      const size = 20; 
      
      // Center the image over the landmark coordinate
      ctx.drawImage(
        imgElement,
        leftNostril.x - size / 2,
        leftNostril.y - size / 2,
        size,
        size
      );
    } else {
      // Fallback placeholder dot if image asset fails to load
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(leftNostril.x, leftNostril.y, 5, 0, 2 * Math.PI); ctx.fill();
    }
  },

  // MODULE: FOREHEAD PENDANT (Maang Tikka)
  renderForehead: (faceLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imgElement: HTMLImageElement | null) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return;
    const centerForehead = toPixels(faceLandmarks[10], canvas);
    
    if (imgElement && imgElement.complete) {
      const width = 40;
      const height = 80; // Typically vertically elongated
      ctx.drawImage(imgElement, centerForehead.x - width / 2, centerForehead.y, width, height);
    } else {
      ctx.fillStyle = "#3b82f6";
      ctx.beginPath(); ctx.arc(centerForehead.x, centerForehead.y, 8, 0, 2 * Math.PI); ctx.fill();
    }
  },

  // MODULE: EARRINGS
  renderEarrings: (faceLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imgElement: HTMLImageElement | null) => {
    if (!faceLandmarks || faceLandmarks.length === 0) return;
    const leftEar = toPixels(faceLandmarks[234], canvas);
    const rightEar = toPixels(faceLandmarks[454], canvas);

    if (imgElement && imgElement.complete) {
      const width = 30;
      const height = 60;
      
      // Draw left earring hanging straight down
      ctx.drawImage(imgElement, leftEar.x - width / 2, leftEar.y, width, height);
      // Draw right earring hanging straight down
      ctx.drawImage(imgElement, rightEar.x - width / 2, rightEar.y, width, height);
    } else {
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(leftEar.x, leftEar.y); ctx.lineTo(leftEar.x, leftEar.y + 35); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(rightEar.x, rightEar.y); ctx.lineTo(rightEar.x, rightEar.y + 35); ctx.stroke();
    }
  },

  // MODULE: NECKLACE
  renderNecklace: (poseLandmarks: any[], ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, imgElement: HTMLImageElement | null) => {
    if (!poseLandmarks || poseLandmarks.length === 0) return;
    
    const leftShoulder = toPixels(poseLandmarks[11], canvas);
    const rightShoulder = toPixels(poseLandmarks[12], canvas);

    const collarboneX = (leftShoulder.x + rightShoulder.x) / 2;
    const collarboneY = (leftShoulder.y + rightShoulder.y) / 2;

    if (imgElement && imgElement.complete) {
      // Scale necklace width relative to the distance between the user's shoulders
      const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
      const width = shoulderWidth * 0.85; // Cover 85% of chest span
      const height = width * (imgElement.height / imgElement.width); // Maintain image aspect ratio

      ctx.drawImage(imgElement, collarboneX - width / 2, collarboneY - height * 0.2, width, height);
    } else {
      ctx.fillStyle = "#a855f7";
      ctx.beginPath(); ctx.arc(collarboneX, collarboneY, 14, 0, 2 * Math.PI); ctx.fill();
    }
  }
};