let current;

export function createSignal(initialValue) {
  let value = initialValue;
  const observers = [];
  const getter = () => {
    if (current && !observers.includes(current)) {
      observers.push(current);
    }
    return value;
  };
  const setter = (newValue) => {
    value = typeof newValue === "function" ? newValue(value) : newValue;
    observers.forEach((fn) => fn());
  };
  return [getter, setter];
}

/**
 * CreateEffect in solid-js server.js is a stub, so we need to implement our own...
 * @param {} fn
 * @returns
 */
export function createEffect(fn, initial = undefined) {
  current = fn;
  fn(initial);
  current = undefined;
}

export const createComputed = createEffect;
export const createRenderEffect = createComputed;
export const effect = createEffect;
