/**
 * Canvas sizing and management
 */

export class CanvasManager {
  static initialize() {
    // Listen for fullscreen changes and resize appropriately
    document.addEventListener("fullscreenchange", () => {
      // Map slider index to actual grid size (matches UI GRID_POWERS)
      const GRID_POWERS = [8, 16, 32, 64, 96, 128, 192, 256];
      const colsIdx =
        parseInt(document.querySelector("#ledColsSelect").value, 10) || 4;
      const rowsIdx =
        parseInt(document.querySelector("#ledRowsSelect").value, 10) || 4;
      const cols = GRID_POWERS[colsIdx] || GRID_POWERS[4];
      const rows = GRID_POWERS[rowsIdx] || GRID_POWERS[4];
      this.resizeCanvas(cols, rows);
    });
  }

  static resizeCanvas(cols, rows) {
    const aspect = cols / rows;

    // Check if in fullscreen
    const isFullscreen = document.fullscreenElement !== null;
    let newW, newH;

    if (isFullscreen) {
      // Calculate based on available screen space
      const availWidth = window.innerWidth;
      const availHeight = window.innerHeight;
      const availAspect = availWidth / availHeight;

      if (aspect > availAspect) {
        // Canvas is wider - fit to width
        newW = availWidth;
        newH = Math.round(availWidth / aspect);
      } else {
        // Canvas is taller - fit to height
        newW = Math.round(availHeight * aspect);
        newH = availHeight;
      }
    } else {
      // Normal windowed mode
      // Scale canvas progressively with LED count
      // 64x64 = 600px, 128x128 = 728px, 256x256 = 984px
      const maxDim = Math.max(cols, rows);
      const baseSize = 600 + (maxDim - 64) * 2;

      newW = baseSize;
      newH = baseSize;

      if (aspect > 1) {
        // wider than tall
        newW = baseSize;
        newH = Math.round(baseSize / aspect);
      } else {
        // taller than wide
        newW = Math.round(baseSize * aspect);
        newH = baseSize;
      }
    }

    resizeCanvas(newW, newH);
    // Reserve wrapper space to avoid layout jump when canvas changes size
    const wrapper = document.querySelector(".canvas-wrapper");
    const container = document.querySelector("#canvas-container");
    if (wrapper) {
      // Set a fixed height to the wrapper to prevent page reflow
      wrapper.style.height = newH + "px";
      wrapper.style.width = newW + "px";
      wrapper.style.display = "flex";
      wrapper.style.justifyContent = "center";
      wrapper.style.alignItems = "center";
    }
    if (container) {
      // Ensure direct container centers the canvas element
      container.style.height = "100%";
      container.style.width = "100%";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";
    }
  }

  static toggleFullscreen() {
    const el = document.querySelector("#canvas-container");
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }
}
