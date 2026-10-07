import { createInitialState } from './initial-state.js';
import { reduce, STORAGE_KEY, validateState } from './model.js';

function load() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (!value) return createInitialState();
    const restored = validateState(JSON.parse(value));
    if (restored.collaborationRequest.status === 'SENDING') return { ...restored, collaborationRequest: { ...restored.collaborationRequest, status: restored.collaborationRequest.sendingFrom || 'NONE', sendingToken: null }, currentRole: 'ELDER', currentView: 'REQUEST_SEND_FAILED' };
    return restored;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return createInitialState();
  }
}

export function createStore() {
  let state = load();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const listeners = new Set();
  return {
    getState: () => state,
    dispatch(action) {
      state = validateState(reduce(state, action));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      if (!action.silent) listeners.forEach(listener => listener(state));
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
