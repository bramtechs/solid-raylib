import { VElement } from "./node.js";
import { parseColor, parseNumber } from "./utils.js";
import { render } from "./renderer.js";
import raylib from "raylib/index.js";

/**
 * @type {VElement|null}
 */
let window = null;

let frameCallbacks = new Set();

/**
 * @enum {string}
 * @readonly
 */
const RayElementTypes = ["Rectangle"];

/**
 * Handle special cases for initializing Raylib elements
 * @param {RayElementTypes} type
 * @param {any[]} props
 * @returns {any} data
 */
function rayHandler(type, ...props) {
  switch (type) {
    case "window":
      return {
        init: () => {
          const screenWidth = 800;
          const screenHeight = 450;
          raylib.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
          console.log("initialized window");
        },
        deinit: () => {
          raylib.CloseWindow();
          console.log("closed window");
        },
      };
  }
}

/**
 * Creates a Raylib element and attaches to virtual node/element system
 * This doesn't add to the node tree, or any scenes
 * @param {RayElementTypes} type
 * @param {any[]} props
 * @returns {VElement}
 */
export function createRayElement(type, ...props) {
  // Create Raylib element
  const newElement = rayHandler(type, ...props);

  // Create Element/Node class and assign Raylib element
  const newNode = new VElement(newElement);
  // If this is a window object, we set the window property in our node
  // This assures when we add children, they can check the parent for window to add
  if (type === "window") {
    newNode.parentElement = newElement;
    window = newNode;
  }
  newNode.content ??= {};
  newNode.content.elementType = type;
  newNode.content.init?.();
  //console.log("created raylib element", newNode);
  return newNode;
}

export function elementAttributeUpdated(node, name, value) {
  if (node.content.elementType === "window") {
    if (name === "title") {
      raylib.SetWindowTitle(value);
    }
    raylib.SetWindowSize(node.attributes.width ?? 1280, node.attributes.height ?? 720);
  }
}

export async function initSolidRaylib(jsx) {
  const tree = new VElement("root");
  const dispose = render(jsx, tree);

  /**
   * Draws a node and all its children
   * @param {VElement} node
   */
  function drawNode(node) {
    if (node.content.elementType === "rectangle") {
      raylib.DrawRectangle(
        parseNumber(node.attributes.x),
        parseNumber(node.attributes.y),
        parseNumber(node.attributes.width),
        parseNumber(node.attributes.height),
        parseColor(node.attributes.color),
      );
    } else if (node.content.elementType === "fps") {
      raylib.DrawFPS(parseNumber(node.attributes.x), parseNumber(node.attributes.y));
    }
    node.childNodes.forEach((child) => {
      drawNode(child);
    });
  }

  while (!raylib.WindowShouldClose()) {
    raylib.BeginDrawing();
    raylib.ClearBackground(raylib.RAYWHITE);

    let delta = raylib.GetFrameTime();
    frameCallbacks.forEach((fn) => fn(delta));

    if (window) {
      drawNode(window);
    }

    raylib.EndDrawing();
  }

  console.log("closing window");
  dispose();
  console.log("disposed renderer");
}

/**
 * Hook for executing functions on each frame
 * @param {Function} frameFn Function to run every frame
 * @returns {Function} Cleanup function
 */
export function onFrame(frameFn) {
  if (typeof frameFn !== "function") {
    throw new Error("onFrame requires a function parameter");
  }
  frameCallbacks.add(frameFn);
  return () => {
    frameCallbacks.delete(frameFn);
  };
}
