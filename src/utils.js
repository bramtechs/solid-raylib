import raylib from "raylib/index.js";

/**
 * Parses a color string into a raylib color object
 * @param {string} color
 * @returns {raylib.Color}
 */
export function parseColor(color) {
  if (color.startsWith("#")) {
    return {
      r: parseInt(color.slice(1, 3), 16),
      g: parseInt(color.slice(3, 5), 16),
      b: parseInt(color.slice(5, 7), 16),
    };
  }
  return raylib[color.toUpperCase()] ?? raylib.WHITE;
}

export function parseNumber(it) {
  if (typeof it === "function") {
    return it();
  }
  return it;
}

/**
 * Parses a boolean value or function
 * @param {boolean|function} value - Boolean value or function that returns a boolean
 * @param {boolean} defaultValue - Default value if undefined
 * @returns {boolean}
 */
export function parseBoolean(value, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }
  if (typeof value === "function") {
    return value();
  }
  return !!value;
}
