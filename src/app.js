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
  if (action === 'decline-relationship') store.dispatch({ type: 'DECLINE_RELATIONSHIP' });
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
  if (action === 'simulate-missing') {
    const input = document.querySelector('#task-input');
    store.dispatch({ type: 'START_TASK', rawInput: input.value.trim() });
    store.dispatch({ type: 'PARSE_TASK_MISSING' });
  }
  if (action === 'simulate-parse-failure') {
    const input = document.querySelector('#task-input');
    store.dispatch({ type: 'START_TASK', rawInput: input.value.trim() });
    store.dispatch({ type: 'PARSE_TASK_FAILURE' });
  }
  if (action === 'finish-parsing') store.dispatch({ type: 'PARSE_TASK_SUCCESS' });
  if (action === 'fill-missing') store.dispatch({ type: 'FILL_MISSING_FIELDS' });
  if (action === 'show-manual-form') store.dispatch({ type: 'SHOW_MANUAL_FORM' });
  if (action === 'parse-failed') store.dispatch({ type: 'NAVIGATE', view: 'TASK_PARSE_FAILED' });
  if (action === 'manual-fill-task') store.dispatch({ type: 'MANUAL_FILL_TASK' });
  if (action === 'edit-time') store.dispatch({ type: 'EDIT_TASK_TIME' });
  if (action === 'back-confirm') store.dispatch({ type: 'NAVIGATE', view: 'TASK_CONFIRM' });
  if (action === 'set-time-nine') store.dispatch({ type: 'UPDATE_TASK_TIME', time: '09:00' });
  if (action === 'confirm-task') store.dispatch({ type: 'CONFIRM_TASK' });
  if (action === 'saved-task') store.dispatch({ type: 'NAVIGATE', view: 'TASK_SAVED' });
  if (action === 'start-share') store.dispatch({ type: 'START_SHARE' });
  if (action === 'keep-private') store.dispatch({ type: 'KEEP_PRIVATE' });
  if (action === 'send-request') store.dispatch({ type: 'SEND_REQUEST' });
  if (action === 'simulate-send-failure') store.dispatch({ type: 'SIMULATE_SEND_FAILURE' });
  if (action === 'mark-no-response') store.dispatch({ type: 'MARK_NO_RESPONSE' });
  if (action === 'continue-waiting') store.dispatch({ type: 'CONTINUE_WAITING' });
  if (action === 'withdraw-request') store.dispatch({ type: 'ASK_WITHDRAW_REQUEST' });
  if (action === 'confirm-withdraw-request') store.dispatch({ type: 'WITHDRAW_REQUEST' });
  if (action === 'family-request') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_HOME' });
  if (action === 'family-home') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_HOME' });
  if (action === 'open-family-request') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' });
  if (action === 'accept-request') store.dispatch({ type: 'ACCEPT_REQUEST' });
  if (action === 'decline-request') store.dispatch({ type: 'DECLINE_REQUEST' });
  if (action === 'propose-change') store.dispatch({ type: 'PROPOSE_CHANGE' });
  if (action === 'elder-result') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_ACCEPTED' });
  if (action === 'elder-declined') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_DECLINED' });
  if (action === 'elder-change-proposed') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_CHANGE_PROPOSED' });
  if (action === 'accept-proposed-change') store.dispatch({ type: 'ACCEPT_PROPOSED_CHANGE' });
  if (action === 'reject-proposed-change') store.dispatch({ type: 'REJECT_PROPOSED_CHANGE' });
  if (action === 'cancel-task') store.dispatch({ type: 'ASK_CANCEL_TASK' });
  if (action === 'confirm-cancel-task') store.dispatch({ type: 'CANCEL_TASK' });
  if (action === 'cancel-task-back') store.dispatch({ type: 'CANCEL_TASK_BACK' });
  if (action === 'start-post-accept-edit') store.dispatch({ type: 'START_POST_ACCEPT_EDIT' });
  if (action === 'confirm-post-accept-change') store.dispatch({ type: 'CONFIRM_POST_ACCEPT_CHANGE' });
  if (action === 'trigger-reminder') store.dispatch({ type: 'TRIGGER_REMINDER' });
  if (action === 'ask-complete') store.dispatch({ type: 'ASK_COMPLETE_TASK' });
  if (action === 'reminder-view') store.dispatch({ type: 'NAVIGATE', view: 'TASK_REMINDER' });
  if (action === 'complete-task') store.dispatch({ type: 'COMPLETE_TASK' });
  if (action === 'reset') store.dispatch({ type: 'RESET' });
});

store.subscribe(render);
render();
