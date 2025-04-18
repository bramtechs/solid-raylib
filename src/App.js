import { mainLoop } from "./ray.js";

export default function App() {
  mainLoop().then(() => {
    console.log("window closed");
  });
  return <window width={1280} height={720} title="Raylib App"></window>;
}
