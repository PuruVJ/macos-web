import { writable } from 'svelte/store';

export function spring(value: number, { stiffness = 0.15, damping = 0.8, precision = 0.01 }) {
  let inner_value = $state(value);

  let last_time: number;

  let last_value = value;
  let current_value = value;
  let target_value = value;

  let running = false;

  function set(newValue: number) {
    target_value = newValue;
    if (!running) {
      running = true;
      last_time = performance.now();
      requestAnimationFrame(loop);
    }
  }

  function loop() {
    const currentTime = performance.now();
    const deltaTime = Math.min(currentTime - last_time, 42) * 0.06;

    const delta = target_value - current_value;
    const velocity = (current_value - last_value) / deltaTime;
    const spring = stiffness * delta;
    const damper = damping * velocity;
    const acceleration = spring - damper;
    const d = (velocity + acceleration) * deltaTime;

    last_value = current_value;

    if (Math.abs(d) < precision && Math.abs(delta) < precision) {
      inner_value = current_value = target_value;
      running = false;
    } else {
      inner_value = current_value = current_value + d;
      last_time = currentTime;
      requestAnimationFrame(loop);
    }
  }

  return {
    get value() {
      return inner_value;
    },
    set value(newValue: number) {
      set(newValue);
    },
  };
}
