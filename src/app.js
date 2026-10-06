import { createStore } from './state/store.js';
import { renderApp } from './views.js';

const root = document.querySelector('#app');
const store = createStore();

function render(state = store.getState()) {
  root.innerHTML = renderApp(state);
}

root.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const action = control.dataset.action;
  if (action === 'task-input') store.dispatch({ type: 'NAVIGATE', view: 'TASK_INPUT' });
  if (action === 'elder-home') store.dispatch({ type: 'SET_ROLE', role: 'ELDER' });
  if (action === 'role-elder') store.dispatch({ type: 'SET_ROLE', role: 'ELDER' });
  if (action === 'role-family') store.dispatch({ type: 'SET_ROLE', role: 'FAMILY' });
  if (action === 'relationship') store.dispatch({ type: 'NAVIGATE', view: 'RELATIONSHIP' });
  if (action === 'demo') store.dispatch({ type: 'NAVIGATE', view: 'DEMO' });
  if (action === 'establish-relationship') store.dispatch({ type: 'ESTABLISH_RELATIONSHIP' });
  if (action === 'submit-task') {
    const input = document.querySelector('#task-input');
    store.dispatch({ type: 'START_TASK', rawInput: input.value.trim() });
    window.setTimeout(() => {
      if (store.getState().currentView === 'TASK_PROCESSING') store.dispatch({ type: 'PARSE_TASK_SUCCESS' });
    }, 450);
  }
  if (action === 'finish-parsing') store.dispatch({ type: 'PARSE_TASK_SUCCESS' });
  if (action === 'confirm-task') store.dispatch({ type: 'CONFIRM_TASK' });
  if (action === 'reset') store.dispatch({ type: 'RESET' });
});

store.subscribe(render);
render();
