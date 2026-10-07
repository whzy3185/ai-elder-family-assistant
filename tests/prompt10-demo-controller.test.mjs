import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_SCENARIOS, createDemoSnapshot, createInitialState } from '../src/state/initial-state.js';
import { reduce, validateState } from '../src/state/model.js';
import { renderApp } from '../src/views.js';

const expectedIds = [
  'INITIAL', 'MAIN_FLOW', 'RECOGNITION_ERROR', 'MISSING_INFORMATION', 'AI_FAILURE',
  'SEND_FAILURE', 'PENDING_FAMILY', 'ACCEPTED', 'DECLINED', 'CHANGE_PROPOSED',
  'WITHDRAWN', 'CANCELLED', 'REMINDER_TRIGGER',
];

test('Demo Controller exposes every required reproducible scenario', () => {
  assert.deepEqual(DEMO_SCENARIOS.map(([id]) => id), expectedIds);
  const html = renderApp({ ...createInitialState(), currentView: 'DEMO' }, [], {surface:'review'});
  assert.match(html, /不属于正式产品功能/);
  // Full review controls are validated after the review surface is completed.
  assert.doesNotMatch(renderApp(createInitialState()), /评审辅助|Prototype|Demo/);
  assert.match(html, /切换到小梅/);
});

test('every scenario factory returns a complete valid snapshot', () => {
  for (const id of expectedIds) {
    const snapshot = validateState(createDemoSnapshot(id));
    assert.equal(snapshot.demoScenario, id);
    assert.ok(snapshot.relationship);
    assert.ok(snapshot.task);
    assert.ok(snapshot.collaborationRequest);
    assert.ok(snapshot.requestHistory);
    assert.ok(snapshot.currentRole);
    assert.ok(snapshot.currentView);
    assert.ok(snapshot.demoClock);
  }
});

test('loading a scenario replaces all dirty prior data instead of merging', () => {
  const dirty = {
    ...createInitialState(),
    relationship: { ...createInitialState().relationship, status: 'DECLINED' },
    requestHistory: [{ status: 'SHOULD_NOT_SURVIVE' }],
    demoClock: '2099-01-01T00:00:00+08:00',
    currentRole: 'FAMILY',
    currentView: 'FAMILY_ACCEPTED',
  };
  for (const id of expectedIds) {
    assert.deepEqual(reduce(dirty, { type: 'LOAD_DEMO_SCENARIO', scenario: id }), createDemoSnapshot(id));
  }
});

test('required scenario snapshots carry the intended business states', () => {
  assert.equal(createDemoSnapshot('RECOGNITION_ERROR').task.details.time, '08:00');
  assert.equal(createDemoSnapshot('MISSING_INFORMATION').task.status, 'MISSING_REQUIRED');
  assert.equal(createDemoSnapshot('AI_FAILURE').task.rawInput.length > 0, true);
  assert.equal(createDemoSnapshot('SEND_FAILURE').collaborationRequest.status, 'NONE');
  assert.equal(createDemoSnapshot('PENDING_FAMILY').collaborationRequest.status, 'PENDING');
  assert.equal(createDemoSnapshot('ACCEPTED').collaborationRequest.status, 'ACCEPTED');
  assert.equal(createDemoSnapshot('DECLINED').collaborationRequest.status, 'DECLINED');
  assert.equal(createDemoSnapshot('CHANGE_PROPOSED').task.details.time, '09:00');
  assert.equal(createDemoSnapshot('WITHDRAWN').collaborationRequest.status, 'WITHDRAWN');
  assert.equal(createDemoSnapshot('CANCELLED').task.reminderAt, null);
  assert.equal(createDemoSnapshot('REMINDER_TRIGGER').demoClock, '2026-10-07T08:30:00+08:00');
});

test('Reset All Demo Data restores the canonical initial snapshot', () => {
  const accepted = createDemoSnapshot('ACCEPTED');
  assert.deepEqual(reduce(accepted, { type: 'RESET' }), createInitialState());
});
