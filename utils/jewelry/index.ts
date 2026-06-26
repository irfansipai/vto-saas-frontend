// frontend/utils/jewelry/index.ts
import { renderForehead } from "./forehead";
import { renderNosepin } from "./nosepin";
import { renderEarrings } from "./earring";
import { renderNecklace } from "./necklace";
import { drawDebug3D, drawPoseDebug3D } from "./debug";

export const JewelryModules = {
  renderForehead,
  renderNosepin,
  renderEarrings,
  renderNecklace,
  drawDebug3D,
  drawPoseDebug3D
};