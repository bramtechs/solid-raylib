import { VElement } from "./node.js";
import raylib from "raylib/index.js";

let window = null;

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
    default:
      throw new Error(`Unsupported element type: ${type}`);
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
  newNode.content.elementType = type;
  newNode.content.init?.();
  console.log("created raylib element", newNode);
  return newNode;
}

export function elementAttributeUpdated(node, name, value) {
  if (node.content.elementType === "window") {
    let sizeUpdated = false;
    if (name === "title") {
      raylib.SetWindowTitle(value);
    } else if (name === "width") {
      node.content.windowWidth = value;
      sizeUpdated = true;
    } else if (name === "height") {
      node.content.windowHeight = value;
      sizeUpdated = true;
    }
    if (sizeUpdated) {
      raylib.SetWindowSize(node.content.windowWidth ?? 1280, node.content.windowHeight ?? 720);
    }
  }
}

export function mainLoop() {
  return new Promise(async (resolve) => {
    await new Promise((r) => setTimeout(r, 1000));
    while (!raylib.WindowShouldClose()) {
      raylib.BeginDrawing();
      raylib.ClearBackground(raylib.RAYWHITE);
      raylib.DrawText("Hello, World!", 20, 20, 20, raylib.BLACK);
      raylib.EndDrawing();
    }
    resolve();
  });
}
