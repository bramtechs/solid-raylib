import { createSignal, createEffect, onCleanup } from "solid-raylib";

export default function App() {
  const [count, setCount] = createSignal(0);

  createEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => c + 0.01);
    }, 10);

    onCleanup(() => {
      clearInterval(timer);
    });
  });

  return (
    <window width={1280} height={720} title="Raylib App">
      <fps x={10} y={10} />
      <rectangle x={count() * 100} y={200} width={300} height={100} color="blue"></rectangle>
    </window>
  );
}
