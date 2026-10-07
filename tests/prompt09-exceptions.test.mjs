import test from 'node:test';
import assert from 'node:assert/strict';
import { FIXED_INPUT, createInitialState } from '../src/state/initial-state.js';
import { reduce, validateState } from '../src/state/model.js';

const dispatch = (state, ...actions) => actions.reduce((value, action) => validateState(reduce(value, action)), state);

function activeRelationship(state = createInitialState()) {
  return dispatch(
    state,
    { type: 'SHOW_RELATIONSHIP_QR' },
    { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'RELATIONSHIP' },
    { type: 'FAMILY_SCAN_RELATIONSHIP' },
    { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'RELATIONSHIP' },
    { type: 'ESTABLISH_RELATIONSHIP' },
  );
}

function confirmedTask(state = createInitialState()) {
  return dispatch(
    state,
    { type: 'START_TASK', rawInput: FIXED_INPUT },
    { type: 'PARSE_TASK_SUCCESS' },
    { type: 'UPDATE_TASK_TIME', time: '09:00' },
    { type: 'CONFIRM_TASK' },
  );
}

function pendingRequest() {
  return dispatch(activeRelationship(),
    { type: 'START_TASK', rawInput: FIXED_INPUT },
    { type: 'PARSE_TASK_SUCCESS' },
    { type: 'UPDATE_TASK_TIME', time: '09:00' },
    { type: 'CONFIRM_TASK' },
    { type: 'START_SHARE' },
    { type: 'SEND_REQUEST' },
  );
}

test('Scenario A: declining relationship still permits a private reminder', () => {
  let state = dispatch(createInitialState(),
    { type: 'SHOW_RELATIONSHIP_QR' },
    { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'RELATIONSHIP' },
    { type: 'FAMILY_SCAN_RELATIONSHIP' },
    { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'RELATIONSHIP' },
    { type: 'DECLINE_RELATIONSHIP' },
  );
  state = confirmedTask(state);
  assert.equal(state.relationship.status, 'DECLINED');
  assert.equal(state.task.status, 'CONFIRMED');
  assert.equal(state.task.reminderAt, '2026-10-07T08:30:00+08:00');
});

test('Scenario B: private-only choice creates no family request', () => {
  const state = dispatch(confirmedTask(activeRelationship()), { type: 'KEEP_PRIVATE' });
  assert.equal(state.collaborationRequest.status, 'NONE');
  assert.equal(state.task.status, 'CONFIRMED');
  assert.equal(state.currentView, 'PRIVATE_ONLY');
});

test('Scenarios C and D: missing and failed parsing both recover without losing the raw input', () => {
  let missing = dispatch(createInitialState(),
    { type: 'START_TASK', rawInput: FIXED_INPUT },
    { type: 'PARSE_TASK_MISSING' },
  );
  assert.equal(missing.task.details.time, null);
  missing = dispatch(missing, { type: 'FILL_MISSING_FIELDS' }, { type: 'CONFIRM_TASK' });
  assert.equal(missing.task.status, 'CONFIRMED');

  let failed = dispatch(createInitialState(),
    { type: 'START_TASK', rawInput: FIXED_INPUT },
    { type: 'PARSE_TASK_FAILURE' },
  );
  assert.equal(failed.task.rawInput, FIXED_INPUT);
  failed = dispatch(failed, { type: 'SHOW_MANUAL_FORM' }, { type: 'MANUAL_FILL_TASK' }, { type: 'CONFIRM_TASK' });
  assert.equal(failed.task.status, 'CONFIRMED');
  assert.equal(failed.task.rawInput, FIXED_INPUT);
});

test('Scenario E: send failure keeps reminder and retry creates exactly one request', () => {
  let state = dispatch(confirmedTask(activeRelationship()), { type: 'START_SHARE' }, { type: 'SIMULATE_SEND_FAILURE' });
  assert.equal(state.collaborationRequest.status, 'NONE');
  assert.equal(state.collaborationRequest.sendAttempts, 1);
  assert.equal(state.task.reminderAt, '2026-10-07T08:30:00+08:00');
  state = dispatch(state, { type: 'SEND_REQUEST' });
  assert.equal(state.collaborationRequest.status, 'PENDING');
  assert.equal(state.collaborationRequest.sendAttempts, 2);
  assert.equal(state.requestHistory.length, 0);
});

test('Scenario F and I: no response can continue or withdraw, and withdrawn request cannot be answered', () => {
  let state = dispatch(pendingRequest(), { type: 'MARK_NO_RESPONSE' });
  assert.equal(state.collaborationRequest.status, 'NO_RESPONSE');
  state = dispatch(state, { type: 'CONTINUE_WAITING' }, { type: 'MARK_NO_RESPONSE' }, { type: 'WITHDRAW_REQUEST' });
  assert.equal(state.collaborationRequest.status, 'WITHDRAWN');
  assert.equal(state.task.status, 'CONFIRMED');
  assert.equal(state.task.reminderAt, '2026-10-07T08:30:00+08:00');
  const familyAttempt = dispatch(state, { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' }, { type: 'ACCEPT_REQUEST' });
  assert.equal(familyAttempt.collaborationRequest.status, 'WITHDRAWN');
});

test('Scenario G: family decline does not cancel the elder task', () => {
  const state = dispatch(pendingRequest(),
    { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' },
    { type: 'DECLINE_REQUEST' },
  );
  assert.equal(state.collaborationRequest.status, 'DECLINED');
  assert.equal(state.task.status, 'CONFIRMED');
  assert.equal(state.task.reminderAt, '2026-10-07T08:30:00+08:00');
});

test('Scenario H: family proposal changes time only after elder accepts', () => {
  const proposed = dispatch(pendingRequest(),
    { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' },
    { type: 'PROPOSE_CHANGE' },
  );
  assert.equal(proposed.task.details.time, '09:00');
  const rejected = dispatch(proposed,
    { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_CHANGE_PROPOSED' },
    { type: 'REJECT_PROPOSED_CHANGE' },
  );
  assert.equal(rejected.task.details.time, '09:00');

  const accepted = dispatch(proposed,
    { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_CHANGE_PROPOSED' },
    { type: 'ACCEPT_PROPOSED_CHANGE' },
  );
  assert.equal(accepted.task.details.time, '14:00');
  assert.equal(accepted.task.reminderAt, '2026-10-07T13:30:00+08:00');
});

test('Scenario J: cancelling task disables reminder and invalidates family response', () => {
  let state = dispatch(pendingRequest(), { type: 'CANCEL_TASK' });
  assert.equal(state.task.status, 'CANCELLED');
  assert.equal(state.task.reminderAt, null);
  assert.equal(state.collaborationRequest.status, 'INVALIDATED');
  const afterReminderAttempt = dispatch(state, { type: 'TRIGGER_REMINDER' });
  assert.equal(afterReminderAttempt.task.status, 'CANCELLED');
  assert.equal(afterReminderAttempt.currentView, 'TASK_CANCELLED');
  state = dispatch(state, { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' }, { type: 'ACCEPT_REQUEST' });
  assert.equal(state.collaborationRequest.status, 'INVALIDATED');
});

test('Scenario K: modifying an accepted task invalidates old acceptance and creates a new pending version', () => {
  let state = dispatch(pendingRequest(),
    { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' },
    { type: 'ACCEPT_REQUEST' },
    { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_ACCEPTED' },
    { type: 'START_POST_ACCEPT_EDIT' },
    { type: 'CONFIRM_POST_ACCEPT_CHANGE' },
  );
  assert.equal(state.task.version, 2);
  assert.equal(state.task.details.time, '14:00');
  assert.equal(state.collaborationRequest.status, 'PENDING');
  assert.equal(state.collaborationRequest.taskVersion, 2);
  assert.equal(state.collaborationRequest.response, null);
  assert.equal(state.requestHistory.length, 1);
  assert.equal(state.requestHistory[0].status, 'INVALIDATED');
  assert.equal(state.requestHistory[0].response.type, 'ACCEPTED');
});
