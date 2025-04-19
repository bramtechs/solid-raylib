import { createSignal, createEffect, onCleanup } from "solid-js";

export default function App() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => (c + 1) % 10);
    }, 500);

    onCleanup(() => clearInterval(timer));
  });

  return (
    <window width={1280} height={720} title="Raylib App">
      <rectangle x={count() * 100} y={200} width={300} height={100} color="blue"></rectangle>
    </window>
  );
}
