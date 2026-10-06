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
  assert.equal(state.task.details.time, '09:00');
  assert.equal(state.task.reminderAt, '2026-10-07T08:30:00+08:00');
  state = validateState(reduce(state, { type: 'CONFIRM_TASK' }));
  assert.equal(state.task.status, 'CONFIRMED');
  assert.equal(state.task.version, 1);
  assert.equal(state.currentView, 'TASK_SAVED');
});

test('family and elder roles read the same task and relationship state', () => {
  let state = reduce(createInitialState(), { type: 'ESTABLISH_RELATIONSHIP' });
  const taskBefore = state.task;
  state = reduce(state, { type: 'SET_ROLE', role: 'FAMILY' });
  assert.equal(state.relationship.status, 'ACTIVE');
  assert.strictEqual(state.task, taskBefore);
  assert.equal(state.currentRole, 'FAMILY');
});

test('reset restores deterministic demo state', () => {
  let state = reduce(createInitialState(), { type: 'ESTABLISH_RELATIONSHIP' });
  state = reduce(state, { type: 'RESET' });
  assert.deepEqual(state, createInitialState());
});
