import { createRenderer } from "solid-js/universal";
import { createRayElement, elementAttributeUpdated } from "./ray.js";

/**
 * @typedef {import("./node").VElement} VElement
 */

/**
 * Solid-js renderer implementation for Raylib
 * @type {Object} Renderer functions for Solid-js
 */
export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insert,
  insertNode,
  spread,
  setProp,
  mergeProps,
} = createRenderer({
  /**
   * Creates a Raylib element of the specified type
   * @param {string} type - Element type
   * @returns {VElement} Virtual Raylib element
   */
  createElement(type) {
    return createRayElement(type);
  },

  /**
   * Creates a Raylib text node
   * @param {string} value - Text value
   * @returns {VElement} Virtual Raylib text node
   */
  createTextNode(value) {
    return createRayElement("text", value);
  },

  /**
   * Updates text content of a text node
   * @param {VElement} textNode - Text node to update
   * @param {string} value - New text value
   */
  replaceText(textNode, value) {
    textNode.content = value;
  },

  /**
   * Sets a property/attribute on a node
   * @param {VElement} node - Target node
   * @param {string} name - Attribute name
   * @param {any} value - Attribute value
   */
  setProperty(node, name, value) {
    node.setAttribute(name, value);
    elementAttributeUpdated(node, name, value);
  },

  /**
   * Inserts a node into the DOM at a specific position
   * @param {VElement} parent - Parent element
   * @param {VElement} node - Node to insert
   * @param {VElement|null} anchor - Reference node for insertion position
   */
  insertNode(parent, node, anchor) {
    //console.log("render", parent, node, node.childNodes[0], node.content);
    if (!parent) {
      console.log("no parent found!", node, node.content, node.childNodes);
    }
    //console.log("inserting node", node);
    parent.insertBefore(node, anchor);
  },

  /**
   * Checks if a node is a text node
   * @param {VElement} node - Node to check
   * @returns {boolean} True if node is a text node
   */
  isTextNode(node) {
    return node.type === "text";
  },

  /**
   * Removes a node from its parent
   * @param {VElement} parent - Parent element
   * @param {VElement} node - Node to remove
   */
  removeNode(parent, node) {
    parent.removeChild(node);
  },

  /**
   * Gets the parent node of an element
   * @param {VElement} node - Child node
   * @returns {VElement|null} Parent node
   */
  getParentNode(node) {
    return node.parentNode;
  },

  /**
   * Gets the first child of a node
   * @param {VElement} node - Parent node
   * @returns {VElement|null} First child
   */
  getFirstChild(node) {
    return node.firstChild;
  },

  /**
   * Gets the next sibling of a node
   * @param {VElement} node - Reference node
   * @returns {VElement|null} Next sibling
   */
  getNextSibling(node) {
    return node.nextSibling;
  },

  /**
   * Updates the next sibling of a node
   * @param {VElement} node - Reference node
   * @param {VElement} nextSibling - Next sibling
   */
  updateNextSibling(node, nextSibling) {
    node.nextSibling = nextSibling;
  },

  /**
   * Updates the previous sibling of a node
   * @param {VElement} node - Reference node
   * @param {VElement} previousSibling - Previous sibling
   */
  updatePreviousSibling(node, previousSibling) {
    node.prevSibling = previousSibling;
  },
});

/**
 * Re-export built-in Solid.js components
 */
export { For, Show, Suspense, SuspenseList, Switch, Match, Index, ErrorBoundary } from "solid-js";
