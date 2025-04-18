import App from "./App.js";
import { VElement } from "./node.js";
import { render } from "./renderer.js";

const tree = new VElement("root");
render(App, tree);
console.log("tree", tree);
