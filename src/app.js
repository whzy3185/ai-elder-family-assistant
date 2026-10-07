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
  if (action === 'show-qr') store.dispatch({ type: 'SHOW_RELATIONSHIP_QR' });
  if (action === 'family-relationship') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'RELATIONSHIP' });
  if (action === 'elder-relationship') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'RELATIONSHIP' });
  if (action === 'family-scan') store.dispatch({ type: 'FAMILY_SCAN_RELATIONSHIP' });
  if (action === 'submit-task') {
    const input = document.querySelector('#task-input');
    store.dispatch({ type: 'START_TASK', rawInput: input.value.trim() });
    window.setTimeout(() => {
      if (store.getState().currentView === 'TASK_PROCESSING') store.dispatch({ type: 'PARSE_TASK_SUCCESS' });
    }, 450);
  }
  if (action === 'finish-parsing') store.dispatch({ type: 'PARSE_TASK_SUCCESS' });
  if (action === 'edit-time') store.dispatch({ type: 'EDIT_TASK_TIME' });
  if (action === 'back-confirm') store.dispatch({ type: 'NAVIGATE', view: 'TASK_CONFIRM' });
  if (action === 'set-time-nine') store.dispatch({ type: 'UPDATE_TASK_TIME', time: '09:00' });
  if (action === 'confirm-task') store.dispatch({ type: 'CONFIRM_TASK' });
  if (action === 'saved-task') store.dispatch({ type: 'NAVIGATE', view: 'TASK_SAVED' });
  if (action === 'start-share') store.dispatch({ type: 'START_SHARE' });
  if (action === 'send-request') store.dispatch({ type: 'SEND_REQUEST' });
  if (action === 'family-request') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_HOME' });
  if (action === 'family-home') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_HOME' });
  if (action === 'open-family-request') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' });
  if (action === 'accept-request') store.dispatch({ type: 'ACCEPT_REQUEST' });
  if (action === 'elder-result') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_ACCEPTED' });
  if (action === 'trigger-reminder') store.dispatch({ type: 'TRIGGER_REMINDER' });
  if (action === 'ask-complete') store.dispatch({ type: 'ASK_COMPLETE_TASK' });
  if (action === 'reminder-view') store.dispatch({ type: 'NAVIGATE', view: 'TASK_REMINDER' });
  if (action === 'complete-task') store.dispatch({ type: 'COMPLETE_TASK' });
  if (action === 'reset') store.dispatch({ type: 'RESET' });
});

store.subscribe(render);
render();
