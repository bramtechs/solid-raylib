import { VElement } from "./node.js";
import { parseColor, parseNumber, parseBoolean, parseString } from "./utils.js";
import { render } from "./renderer.js";
import r from "raylib/index.js";

/**
 * @type {VElement|null}
 */
let window = null;

/**
 * @enum {string}
 * @readonly
 */
const RayElementTypes = ["rectangle", "text"];

/**
 * Creates a Raylib element and attaches to virtual node/element system
 * This doesn't add to the node tree, or any scenes
 * @param {RayElementTypes} type
 * @param {any[]} props
 * @returns {VElement}
 */
export function createRayElement(type, ...props) {
  // Create Raylib element
  let content = {};

  switch (type) {
    case "innerText":
      content.text = props[0];
      break;
    case "window":
      content.init = () => {
        const screenWidth = 800;
        const screenHeight = 450;
        r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
        console.log("initialized window");
      };
      content.deinit = () => {
        r.CloseWindow();
        console.log("closed window");
      };
      break;
  }

  const newNode = new VElement(content);

  // If this is a window object, we set the window property in our node
  // This assures when we add children, they can check the parent for window to add
  if (type === "window") {
    newNode.parentElement = content;
    window = newNode;
  }

  newNode.content ??= {};
  newNode.content.elementType = type;
  newNode.content.init?.();
  console.debug(`created raylib element ${type}`);
  return newNode;
}

export function elementAttributeUpdated(node, name, value) {
  if (node.content.elementType === "window") {
    if (name === "title") {
      r.SetWindowTitle(value);
    }
    r.SetWindowSize(parseNumber(node.attributes.width) ?? 1280, parseNumber(node.attributes.height) ?? 720);
  }
  //console.debug(`updated raylib element ${node.content.elementType} attribute ${name} to ${value}`);
}

export async function initSolidRaylib(jsx) {
  const tree = new VElement("root");
  const dispose = render(jsx, tree);

  /**
   * Draws a node and all its children
   * @param {VElement} node
   */
  function drawNode(node) {
    if (node.content.elementType === "sr-show") {
      if (!parseBoolean(node.attributes.when)) {
        return;
      }
    }

    switch (node.content.elementType) {
      case "rectangle":
        if (parseBoolean(node.attributes.lines)) {
          // Draw rectangle lines/outline
          if (node.attributes.borderRadius === undefined) {
            const lineThickness = parseNumber(node.attributes.lineThickness ?? 1);
            if (lineThickness === 1) {
              // Use the simple API for 1px lines
              r.DrawRectangleLines(
                parseNumber(node.attributes.x),
                parseNumber(node.attributes.y),
                parseNumber(node.attributes.width),
                parseNumber(node.attributes.height),
                parseColor(node.attributes.color),
              );
            } else {
              // Use the advanced API for custom thickness
              r.DrawRectangleLinesEx(
                r.Rectangle(
                  parseNumber(node.attributes.x),
                  parseNumber(node.attributes.y),
                  parseNumber(node.attributes.width),
                  parseNumber(node.attributes.height),
                ),
                lineThickness,
                parseColor(node.attributes.color),
              );
            }
          } else {
            r.DrawRectangleRoundedLines(
              r.Rectangle(
                parseNumber(node.attributes.x),
                parseNumber(node.attributes.y),
                parseNumber(node.attributes.width),
                parseNumber(node.attributes.height),
              ),
              parseNumber(node.attributes.borderRadius),
              parseNumber(node.attributes.segments ?? 5),
              parseNumber(node.attributes.lineThickness ?? 1),
              parseColor(node.attributes.color),
            );
          }
        } else {
          if (node.attributes.borderRadius === undefined) {
            r.DrawRectangle(
              parseNumber(node.attributes.x),
              parseNumber(node.attributes.y),
              parseNumber(node.attributes.width),
              parseNumber(node.attributes.height),
              parseColor(node.attributes.color),
            );
          } else {
            r.DrawRectangleRounded(
              r.Rectangle(
                parseNumber(node.attributes.x),
                parseNumber(node.attributes.y),
                parseNumber(node.attributes.width),
                parseNumber(node.attributes.height),
              ),
              parseNumber(node.attributes.borderRadius),
              parseNumber(node.attributes.segments ?? 5),
              parseColor(node.attributes.color),
            );
          }
        }
        break;
      case "fps":
        r.DrawFPS(parseNumber(node.attributes.x), parseNumber(node.attributes.y));
        break;
      case "text":
        let innerText = null;
        for (const child of node.childNodes) {
          if (child.content?.elementType === "innerText") {
            if (innerText === null) innerText = "";
            innerText += child.content.text;
          }
        }
        innerText ??= parseString(node.attributes.text);
        r.DrawText(
          innerText,
          parseNumber(node.attributes.x),
          parseNumber(node.attributes.y),
          parseNumber(node.attributes.fontSize),
          parseColor(node.attributes.color),
        );
        break;
    }

    node.childNodes.forEach((child) => {
      drawNode(child);
    });
  }

  (async () => {
    while (!r.WindowShouldClose()) {
      r.BeginDrawing();
      r.ClearBackground(r.RAYWHITE);

      if (window) {
        drawNode(window);
      }

      r.EndDrawing();

      // Do not remove this delay or NodeJS setTimeouts and setIntervals will never run!!!
      await new Promise((resolve) => setTimeout(resolve, 16));
    }

    console.log("closing window");
    dispose();
    console.log("disposed renderer");
  })();
}
