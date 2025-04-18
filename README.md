# Solid Raylib - Monorepo

This project demonstrates a custom renderer for SolidJS that integrates with the Raylib graphics library.<br/>
It is being built as an experimental GUI solution for [Doomhowl Interactive](https://doomhowl-interactive.com).

Very work in progress.

## Project Structure

This is a monorepo containing:

- `packages/solid-raylib` - The core renderer library
- `packages/solid-raylib-demo` - A demo application showcasing the renderer

## Getting Started

### Install Dependencies

```bash
npm install
```

### Build the Core Library

```bash
npm run build:core
```

### Run the Demo

```bash
npm run start:demo
```

## Example Code

```jsx
import { createSignal } from "solid-js";
import { onFrame } from "solid-raylib";

export default function App() {
  const [count, setCount] = createSignal(0);

  onFrame((delta) => {
    setCount(count() + delta);
  });

  return (
    <window width={1280} height={720} title="Raylib App">
      <fps x={10} y={10} />
      <rectangle x={() => 490 - 100 * Math.cos(count())} y={100} width={300} height={100} color="red"></rectangle>
      <rectangle x={() => 490 - 200 * Math.cos(count())} y={200} width={300} height={100} color="blue"></rectangle>
      <rectangle x={() => 490 - 300 * Math.cos(count())} y={300} width={300} height={100} color="green"></rectangle>
      <rectangle x={() => 490 - 400 * Math.cos(count())} y={400} width={300} height={100} color="yellow"></rectangle>
    </window>
  );
}
```

![](./misc/image.png)

## References

https://youtu.be/Yi_MJ8cVCCs

https://github.com/RobLoach/node-raylib

https://github.com/whoisryosuke/solid-three-renderer
