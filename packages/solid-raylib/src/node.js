/**
 * Types of Virtual Nodes
 * Generic types to describe the different content types inside nodes
 * Based off DOM Node.nodeType
 * @see: https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 * @readonly
 * @enum {string}
 */
const VNodeTypes = [
  /**
   * Any element (mesh, group, etc)
   */
  "ELEMENT",
  /**
   * Attribute of elements (not sure if we'll need this)
   */
  "ATTRIBUTE",
  /**
   * Text node (separated so we can accomodate rendering - text is always special)
   */
  "TEXT",
  /**
   * Comments inside code (separated so we don't render)
   */
  "COMMENT",
];

/**
 * Virtual node based on DOM Node
 */
export class VElement {
  // Node properties
  /**
   * Reference to the content (e.g. Mesh class in ThreeJS)
   * @type {any}
   */
  content;

  /**
   * @type {VElement|null}
   */
  parentNode;

  /**
   * @type {VElement}
   */
  nextSibling;

  /**
   * @type {VElement}
   */
  prevSibling;

  /**
   * @type {VElement[]}
   */
  childNodes;

  /**
   * @type {VElement}
   */
  firstChild;

  // Convenience type to know what underlying content is
  // So renderer can detect things like text and handle accordingly
  /**
   * @type {VNodeTypes}
   */
  type;

  // ThreeJS specific
  // We keep track of the parent element (scene, group, mesh, etc)
  // so we can add object to ThreeJS Scene (or nest it appropriately)
  /**
   * @type {ThreeParents}
   */
  parentElement;

  /** @type {Object.<string, string>} */
  attributes = {};

  /**
   * @param {string} name
   * @param {string} value
   */
  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  /**
   * @param {string} name
   * @returns {string}
   */
  getAttribute(name) {
    if (!this.attributes[name]) {
      throw new Error(`Required attribute ${name} not found on node ${this.type}`);
    }
    return this.attributes[name];
  }

  /**
   * @param {any} content
   * @param {VElement|null} parent
   * @param {VNodeTypes} type
   * @param {ThreeParents} [parentElement]
   */
  constructor(content, parent = null, type = VNodeTypes.ELEMENT, parentElement) {
    // super();
    this.content = content;
    this.childNodes = [];
    this.type = type;
    if (parent) this.parentNode = parent;
    if (parentElement) this.parentElement = parentElement;
  }

  /**
   * @param {VElement} node
   */
  updateNextSibling(node) {
    this.nextSibling = node;
  }

  /**
   * @param {VElement} node
   */
  updatePreviousSibling(node) {
    this.prevSibling = node;
  }

  /**
   * Inserts node before the anchor node
   * If no node is provided, node is inserted as last child
   * @param {VElement} node
   * @param {VElement|null} anchor
   * @returns {VElement}
   */
  insertBefore(node, anchor) {
    // Set this node as the parent to the incoming node
    //console.log("inserting before", node.setParentNode, node.content);
    node.parentNode = this;
    node.parentElement = this.parentElement;
    // ThreeJS: Set the scene from parent node

    // Find anchor and insert node using anchor index
    // (aka before, since it will push anchor index forward)
    if (anchor) {
      const anchorIndex = this.childNodes.findIndex((childNode) => childNode === anchor);

      if (anchorIndex >= 0) {
        this.childNodes = [...this.childNodes.slice(0, anchorIndex), node, ...this.childNodes.slice(anchorIndex)];

        // Update neighbors and inform them of their new sibling
        // Left side
        if (anchorIndex > 0) {
          const previousSibling = this.childNodes[anchorIndex - 1];
          previousSibling.updateNextSibling(node);
          node.updatePreviousSibling(previousSibling);
        }
        // Right side
        const nextSibling = this.childNodes[anchorIndex + 1];
        if (nextSibling) {
          node.updateNextSibling(nextSibling);
          nextSibling.updatePreviousSibling(node);
        }

        // If the index is 0, we need to also update firstChild property
        if (anchorIndex === 0) {
          this.firstChild = node;
        }
        return this;
      }
    }

    this.childNodes = [...this.childNodes, node];
    return this;
  }

  /**
   * @param {VElement} node
   * @returns {VElement}
   */
  removeChild(node) {
    this.childNodes = this.childNodes.filter((childNode) => node != childNode);
    node.content.deinit?.();
    return this;
  }

  // Maybe not necessary
  hasChildNodes() {
    return this.childNodes.length > 0;
  }
}
