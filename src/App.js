import { onCleanup } from "solid-js";

export default function App() {
  onCleanup(() => {
    r.CloseWindow();
  });

  return <window></window>;
}
