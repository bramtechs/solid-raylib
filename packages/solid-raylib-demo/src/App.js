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
      <text x={10} y={100} fontSize={20} color="blue">
        Hello world! {count()}
      </text>
    </window>
  );
}
