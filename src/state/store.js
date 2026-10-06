import { createInitialState } from './initial-state.js';
import { reduce, STORAGE_KEY, validateState } from './model.js';

function load() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value ? validateState(JSON.parse(value)) : createInitialState();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return createInitialState();
  }
}

export function createStore() {
  let state = load();
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = validateState(reduce(state, action));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      listeners.forEach(listener => listener(state));
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
