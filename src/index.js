import App from "./App.js";
import { VElement } from "./node.js";
import { render } from "./renderer.js";

const tree = new VElement("root");
render(App, tree);
console.log("tree", tree);

/*
const screenWidth = 800;
const screenHeight = 450;
r.InitWindow(screenWidth, screenHeight, "raylib [core] example - basic window");
r.SetTargetFPS(60);

while (!r.WindowShouldClose()) {
  r.BeginDrawing();
  r.ClearBackground(r.RAYWHITE);
  r.DrawText("Congrats! You created your first node-raylib window!", 120, 200, 20, r.LIGHTGRAY);
  r.EndDrawing();
}
r.CloseWindow();
*/
