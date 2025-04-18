# solid-raylib

A SolidJS renderer for RayLib

This package provides the functionality for rendering SolidJS components with RayLib.

## Installation

```bash
npm install solid-raylib
```

## Usage

```jsx
import { initSolidRaylib } from "solid-raylib";
import App from "./App";

initSolidRaylib(App);
```

## API

- `initSolidRaylib(App)` - Initialize the SolidJS renderer with RayLib
- `onFrame(callback)` - Register a callback to be called on each frame
- `createRayElement(type, props)` - Create a RayLib element
- `render(jsx, container)` - Render JSX to a container

See the demo app for more examples.
