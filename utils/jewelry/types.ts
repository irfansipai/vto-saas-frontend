// frontend/utils/jewelry/types.ts
export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export const toPixels = (landmark: Landmark, canvas: HTMLCanvasElement) => ({
  x: landmark.x * canvas.width,
  y: landmark.y * canvas.height,
  z: landmark.z
});