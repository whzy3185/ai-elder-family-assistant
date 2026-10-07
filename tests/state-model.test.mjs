import test from 'node:test';
import assert from 'node:assert/strict';
import { FIXED_INPUT, createInitialState } from '../src/state/initial-state.js';
import { reduce, validateState } from '../src/state/model.js';

test('initial state contains the six required shared model fields', () => {
  const state = validateState(createInitialState());
  for (const key of ['relationship', 'task', 'collaborationRequest', 'currentRole', 'demoClock', 'demoScenario']) assert.ok(key in state);
});

test('elder can move from input to confirmed task and synchronized reminder', () => {
  let state = createInitialState();
  state = reduce(state, { type: 'START_TASK', rawInput: FIXED_INPUT });
  assert.equal(state.task.status, 'DRAFT');
  state = reduce(state, { type: 'PARSE_TASK_SUCCESS' });
  assert.equal(state.task.details.time, '08:00');
  assert.equal(state.task.reminderAt, '2026-10-07T07:30:00+08:00');
  state = reduce(state, { type: 'EDIT_TASK_TIME' });
  state = reduce(state, { type: 'UPDATE_TASK_TIME', time: '09:00' });
  assert.equal(state.task.details.time, '09:00');
  assert.equal(state.task.reminderAt, '2026-10-07T08:30:00+08:00');
  state = validateState(reduce(state, { type: 'CONFIRM_TASK' }));
  assert.equal(state.task.status, 'CONFIRMED');
  assert.equal(state.task.version, 1);
  assert.equal(state.currentView, 'TASK_SAVED');
});

test('complete main flow keeps accepted request distinct from completed task', () => {
  let state = createInitialState();
  state = reduce(state, { type: 'SHOW_RELATIONSHIP_QR' });
  state = reduce(state, { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'RELATIONSHIP' });
  state = reduce(state, { type: 'FAMILY_SCAN_RELATIONSHIP' });
  state = reduce(state, { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'RELATIONSHIP' });
  state = reduce(state, { type: 'ESTABLISH_RELATIONSHIP' });
  state = reduce(state, { type: 'START_TASK', rawInput: FIXED_INPUT });
  state = reduce(state, { type: 'PARSE_TASK_SUCCESS' });
  state = reduce(state, { type: 'UPDATE_TASK_TIME', time: '09:00' });
  state = reduce(state, { type: 'CONFIRM_TASK' });
  state = reduce(state, { type: 'START_SHARE' });
  state = reduce(state, { type: 'SEND_REQUEST' });
  assert.equal(state.collaborationRequest.sharedFields.time, '09:00');
  state = reduce(state, { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'FAMILY_REQUEST' });
  state = reduce(state, { type: 'ACCEPT_REQUEST' });
  assert.equal(state.collaborationRequest.status, 'ACCEPTED');
  assert.equal(state.task.status, 'CONFIRMED');
  state = reduce(state, { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'ELDER_ACCEPTED' });
  state = reduce(state, { type: 'TRIGGER_REMINDER' });
  state = reduce(state, { type: 'ASK_COMPLETE_TASK' });
  state = reduce(state, { type: 'COMPLETE_TASK' });
  assert.equal(state.task.status, 'COMPLETED');
});

test('family cannot send a request or complete the elder task', () => {
  let state = createInitialState();
  state = {
    ...state,
    currentRole: 'FAMILY',
    relationship: { ...state.relationship, status: 'ACTIVE' },
    task: {
      ...state.task,
      status: 'CONFIRMED',
      version: 1,
      details: {
        title: '办理公交卡年审',
        date: '2026-10-07',
        time: '09:00',
        location: '社区服务中心',
        familyIntent: '希望小梅陪同',
      },
      reminderAt: '2026-10-07T08:30:00+08:00',
    },
  };

  const afterSend = reduce(state, { type: 'SEND_REQUEST' });
  assert.equal(afterSend.collaborationRequest.status, 'NONE');

  const afterComplete = reduce(state, { type: 'COMPLETE_TASK' });
  assert.equal(afterComplete.task.status, 'CONFIRMED');
});

test('family may view an elder-completed task without changing it', () => {
  const state = {
    ...createInitialState(),
    currentRole: 'ELDER',
    task: {
      ...createInitialState().task,
      status: 'COMPLETED',
      details: { title: '办理公交卡年审', date: '2026-10-07', time: '09:00', location: '社区服务中心' },
      reminderAt: '2026-10-07T08:30:00+08:00',
    },
    collaborationRequest: {
      ...createInitialState().collaborationRequest,
      status: 'ACCEPTED',
    },
  };
  const familyView = validateState(reduce(state, { type: 'SET_ROLE', role: 'FAMILY' }));
  assert.equal(familyView.task.status, 'COMPLETED');
  assert.equal(familyView.currentRole, 'FAMILY');
});

test('family and elder roles read the same task and relationship state', () => {
  let state = reduce(createInitialState(), { type: 'SHOW_RELATIONSHIP_QR' });
  state = reduce(state, { type: 'SET_ROLE_VIEW', role: 'FAMILY', view: 'RELATIONSHIP' });
  state = reduce(state, { type: 'FAMILY_SCAN_RELATIONSHIP' });
  state = reduce(state, { type: 'SET_ROLE_VIEW', role: 'ELDER', view: 'RELATIONSHIP' });
  state = reduce(state, { type: 'ESTABLISH_RELATIONSHIP' });
  const taskBefore = state.task;
  state = reduce(state, { type: 'SET_ROLE', role: 'FAMILY' });
  assert.equal(state.relationship.status, 'ACTIVE');
  assert.strictEqual(state.task, taskBefore);
  assert.equal(state.currentRole, 'FAMILY');
});

test('reset restores deterministic demo state', () => {
  let state = reduce(createInitialState(), { type: 'START_TASK', rawInput: FIXED_INPUT });
  state = reduce(state, { type: 'RESET' });
  assert.deepEqual(state, createInitialState());
});
