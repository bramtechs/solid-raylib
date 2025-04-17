import { createRenderer } from "solid-js/universal";

export const {
  render,
  effect,
  memo,
  createComponent,
  createElement,
  createTextNode,
  insert,
  spread,
  setProp,
  mergeProps,
} = createRenderer({
  createElement(type) {
    console.debug("createElement", type);
    throw new Error("createElement not implemented");
  },
  replaceText(textNode, value) {
    textNode.content = value;
  },
  setProperty(node, name, value) {
    node.setAttribute(name, value);
  },
  insertNode(parent, node, anchor) {
    console.log("render", parent, node, node.childNodes[0], node.content);
    if (!parent) {
      console.log("no parent found!", node, node.content, node.childNodes);
    }
    console.log("inserting node", node);
    parent.insertBefore(node, anchor);
  },
  isTextNode(node) {
    return node.type === 3;
  },
  removeNode(parent, node) {
    parent.removeChild(node);
  },
  getParentNode(node) {
    return node.parentNode;
  },
  getFirstChild(node) {
    return node.firstChild;
  },
  getNextSibling(node) {
    return node.nextSibling;
  },
});

export { For, Show, Suspense, SuspenseList, Switch, Match, Index, ErrorBoundary } from "solid-js";
