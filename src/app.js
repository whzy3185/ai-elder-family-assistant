import { createStore } from './state/store.js';
import { renderReleaseApp } from './release-views.js';
import { FIXED_INPUT } from './state/initial-state.js';
import { screenDefinitions, screenSnapshot } from './screen-catalog.js';

const root = document.querySelector('#app');
const store = createStore();
const surface = location.pathname.startsWith('/review') ? 'review' : location.pathname.startsWith('/family') ? 'family' : 'elder';
if (surface !== 'review') {
  const role = surface === 'family' ? 'FAMILY' : 'ELDER';
  if (store.getState().currentRole !== role || ['DEMO','RESET_CONFIRM','RESET_RESULT'].includes(store.getState().currentView)) store.dispatch({type:'SET_ROLE',role});
}


function render(state = store.getState()) {
  root.innerHTML = renderReleaseApp(state, screenDefinitions, {surface});
  root.querySelector('h1')?.focus({ preventScroll: true });
}

root.addEventListener('input', event => {
  if (event.target.id === 'task-input') store.dispatch({ type: 'UPDATE_RAW_INPUT', value: event.target.value, silent: true });
  if (event.target.dataset.field) store.dispatch({ type: 'UPDATE_MANUAL_FIELD', field: event.target.dataset.field, value: event.target.value, silent: true });
});

root.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  const action = control.dataset.action;
  const reviewOnly = new Set(['load-screen','load-demo-scenario','role-elder','role-family','demo','ask-reset','reset','finish-parsing','finish-sending','review-reminder','review-no-response','simulate-missing','simulate-parse-failure','simulate-send-failure','mark-no-response','trigger-reminder']);
  if (reviewOnly.has(action) && (surface !== 'review' || !control.closest('.review-tools'))) return;
  if (action === 'review-reminder') {store.dispatch({type:'SET_ROLE',role:'ELDER'});store.dispatch({type:'TRIGGER_REMINDER'});}
  if (action === 'review-no-response') {store.dispatch({type:'SET_ROLE',role:'ELDER'});store.dispatch({type:'MARK_NO_RESPONSE'});}

  if (action === 'load-screen') store.dispatch({type:'LOAD_SCREEN',id:control.dataset.screen,snapshot:screenSnapshot(control.dataset.screen)});
  if (action === 'continue-post-edit') store.dispatch({type:'NAVIGATE',view:'POST_ACCEPT_EDIT'});
  if (action === 'ask-share') store.dispatch({type:'NAVIGATE',view:'SHARE_DECISION'});
  if (action === 'wait-request') store.dispatch({type:'NAVIGATE',view:'REQUEST_WAITING'});
  if (action === 'task-input') store.dispatch({ type: 'ENTER_TASK_INPUT' });
  if (action === 'use-voice-example') store.dispatch({ type: 'UPDATE_RAW_INPUT', value: FIXED_INPUT });
  if (action === 'view-permissions') store.dispatch({ type: 'VIEW_PERMISSIONS' });
  if (action === 'return-view') store.dispatch({ type: 'RETURN_VIEW' });
  if (action === 'ask-establish-relationship') store.dispatch({ type: 'ASK_ESTABLISH_RELATIONSHIP' });
  if (action === 'cancel-qr') store.dispatch({ type: 'CANCEL_RELATIONSHIP_QR' });
  if (action === 'ask-end-relationship') store.dispatch({ type: 'ASK_END_RELATIONSHIP' });
  if (action === 'end-relationship') store.dispatch({ type: 'END_RELATIONSHIP' });
  const extraViews = { 'ask-accept-request':'FAMILY_ACCEPT_CONFIRM', 'ask-decline-request':'FAMILY_DECLINE_CONFIRM', 'ask-propose-change':'FAMILY_PROPOSE_CONFIRM', 'ask-reset':'RESET_CONFIRM', settings:'SETTINGS' };
  if (extraViews[action]) store.dispatch({ type: 'NAVIGATE', view: extraViews[action] });
  if (action === 'large-text') store.dispatch({ type: 'SET_DISPLAY_MODE', key: 'largeText', value: true });
  if (action === 'high-contrast') store.dispatch({ type: 'SET_DISPLAY_MODE', key: 'highContrast', value: true });
  if (action === 'standard-display') { store.dispatch({ type: 'SET_DISPLAY_MODE', key: 'largeText', value: false }); store.dispatch({ type: 'SET_DISPLAY_MODE', key: 'highContrast', value: false }); }
  if (action === 'view-request-result') {
    const views = { ACCEPTED:'ELDER_ACCEPTED', DECLINED:'ELDER_DECLINED', CHANGE_PROPOSED:'ELDER_CHANGE_PROPOSED', PENDING:'REQUEST_SENT', NO_RESPONSE:'REQUEST_NO_RESPONSE', WITHDRAWN:'REQUEST_WITHDRAWN' };
    store.dispatch({ type: 'NAVIGATE', view: views[store.getState().collaborationRequest.status] || 'TASK_SAVED' });
  }
  if (action === 'elder-home') store.dispatch({ type: 'SET_ROLE', role: 'ELDER' });
  if (action === 'role-elder') store.dispatch({ type: 'SET_ROLE', role: 'ELDER' });
  if (action === 'role-family') store.dispatch({ type: 'SET_ROLE', role: 'FAMILY' });
  if (action === 'relationship') store.dispatch({ type: 'NAVIGATE', view: 'RELATIONSHIP' });
  if (action === 'demo') store.dispatch({ type: 'NAVIGATE', view: 'DEMO' });
  if (action === 'load-demo-scenario') {store.dispatch({ type: 'LOAD_DEMO_SCENARIO', scenario: control.dataset.scenario });if(control.dataset.scenario==='PENDING_FAMILY'){store.dispatch({type:'SET_ROLE',role:'ELDER'});store.dispatch({type:'MARK_NO_RESPONSE'});}}
  if (action === 'establish-relationship') store.dispatch({ type: 'ESTABLISH_RELATIONSHIP' });
  if (action === 'decline-relationship') store.dispatch({ type: 'DECLINE_RELATIONSHIP' });
  if (action === 'show-qr') store.dispatch({ type: 'SHOW_RELATIONSHIP_QR' });
  if (action === 'family-relationship') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'RELATIONSHIP' });
  if (action === 'elder-relationship') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'RELATIONSHIP' });
  if (action === 'family-scan') store.dispatch({ type: 'FAMILY_SCAN_RELATIONSHIP' });
  if (action === 'submit-task') {
    const input = document.querySelector('#task-input');
    const parseToken = crypto.randomUUID();
    store.dispatch({ type: 'START_TASK', rawInput: input.value.trim(), parseToken });
    window.setTimeout(() => {
      if (store.getState().currentView === 'TASK_PROCESSING') store.dispatch({ type: 'PARSE_TASK_SUCCESS', parseToken });
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
  if (action === 'manual-fill-task') {
    for (const field of root.querySelectorAll('[data-field]')) store.dispatch({ type: 'UPDATE_MANUAL_FIELD', field: field.dataset.field, value: field.value, silent: true });
    store.dispatch({ type: 'MANUAL_FILL_TASK' });
  }
  if (action === 'edit-time') store.dispatch({ type: 'EDIT_TASK_TIME' });
  if (action === 'back-confirm') store.dispatch({ type: 'NAVIGATE', view: 'TASK_CONFIRM' });
  if (action === 'set-time-nine') store.dispatch({ type: 'UPDATE_TASK_TIME', time: '09:00' });
  if (action === 'confirm-task') store.dispatch({ type: 'CONFIRM_TASK' });
  if (action === 'saved-task') store.dispatch({ type: 'NAVIGATE', view: 'TASK_SAVED' });
  if (action === 'start-share') store.dispatch({ type: 'START_SHARE' });
  if (action === 'keep-private') store.dispatch({ type: 'KEEP_PRIVATE' });
  if (action === 'send-request') {
    const version = store.getState().task.version;
    store.dispatch({ type: 'BEGIN_SEND' });
    const token = store.getState().collaborationRequest.sendingToken;
    window.setTimeout(() => {
      if (store.getState().currentView === 'REQUEST_SENDING' && store.getState().task.version === version && store.getState().collaborationRequest.sendingToken === token) store.dispatch({ type: 'SEND_REQUEST' });
    }, 350);
  }
  if (action === 'finish-sending') store.dispatch({type:'SEND_REQUEST'});
  if (action === 'simulate-send-failure') store.dispatch({ type: 'SIMULATE_SEND_FAILURE' });
  if (action === 'mark-no-response') store.dispatch({ type: 'MARK_NO_RESPONSE' });
  if (action === 'continue-waiting') store.dispatch({ type: 'CONTINUE_WAITING' });
  if (action === 'withdraw-request') store.dispatch({ type: 'ASK_WITHDRAW_REQUEST' });
  if (action === 'confirm-withdraw-request') store.dispatch({ type: 'WITHDRAW_REQUEST' });
  if (action === 'family-request') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_HOME' });
  if (action === 'family-home') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_HOME' });
  if (action === 'open-family-request') store.dispatch({ type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' });
  if (action === 'accept-request') store.dispatch({ type: 'ACCEPT_REQUEST', requestId: control.dataset.requestId });
  if (action === 'decline-request') store.dispatch({ type: 'DECLINE_REQUEST', requestId: control.dataset.requestId });
  if (action === 'propose-change') store.dispatch({ type: 'PROPOSE_CHANGE', requestId: control.dataset.requestId });
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
  if (action === 'reset') { store.dispatch({ type: 'RESET' }); store.dispatch({ type: 'NAVIGATE', view: 'RESET_RESULT' }); }
  if (action === 'retry-parse') {
    const rawInput = store.getState().task.rawInput;
    const parseToken = crypto.randomUUID();
    store.dispatch({ type: 'START_TASK', rawInput, parseToken });
    window.setTimeout(() => store.dispatch({ type: 'PARSE_TASK_SUCCESS', parseToken }), 450);
  }
});

store.subscribe(render);
render();
