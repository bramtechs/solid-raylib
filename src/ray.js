import { VElement } from "./node.js";
import { InitWindow, SetTargetFPS, CloseWindow } from "raylib";

/**
 * @enum {string}
 * @readonly
 */
const RayElementTypes = ["Rectangle"];

/**
 * Handle special cases for initializing Raylib elements
 * @param {RayElementTypes} type
 * @param {any[]} props
 * @returns {any}
 */
function rayHandler(type, ...props) {
  switch (type) {
    case "window":
      {
        const screenWidth = 800;
        const screenHeight = 450;
        InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
        SetTargetFPS(60);
      }
      return {};
    default:
      throw new Error(`Unsupported element type: ${type}`);
  }
}

/**
 * Creates a ThreeJS element and attaches to virtual node/element system
 * This doesn't add to the node tree, or any scenes
 * @param {RayElementTypes} type
 * @param {any[]} props
 * @returns {VElement}
 */
export function createElement(type, ...props) {
  // Create ThreeJS element
  const newElement = rayHandler(type, ...props);

  // Create Element/Node class and assign Raylib element
  const newNode = new VElement(newElement);
  // If this is a window object, we set the window property in our node
  // This assures when we add children, they can check the parent for window to add
  if (type === "window") {
    newNode.parentElement = newElement;
  }

  console.log("created raylib element", newNode);
  return newNode;
}
