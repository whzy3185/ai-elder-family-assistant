export const FIXED_INPUT = '明天上午九点去社区服务中心办理公交卡年审，提前半小时提醒我，再问问小梅能不能陪我去。';
export const FIXED_CLOCK = '2026-10-06T20:00:00+08:00';
export const REMINDER_CLOCK = '2026-10-07T08:30:00+08:00';

const finalDetails = (time = '09:00') => ({
  title: '办理公交卡年审',
  date: '2026-10-07',
  time,
  location: '社区服务中心',
  familyIntent: '希望小梅陪同',
});

export function createInitialState() {
  return {
    schemaVersion: 1,
    relationship: {
      status: 'UNLINKED',
      elder: { id: 'elder-zhang', name: '张阿姨' },
      family: { id: 'family-mei', name: '小梅', relation: '女儿' },
      consentedAt: null,
    },
    task: {
      status: 'EMPTY',
      parsingStatus: 'IDLE',
      rawInput: '',
      details: null,
      reminderAt: null,
      version: 0,
      wasCorrected: false,
      pendingChange: null,
    },
    collaborationRequest: {
      status: 'NONE',
      taskVersion: null,
      sharedFields: null,
      response: null,
      sentAt: null,
      sendAttempts: 0,
    },
    requestHistory: [],
    currentRole: 'ELDER',
    currentView: 'ELDER_HOME',
    demoClock: FIXED_CLOCK,
    demoScenario: 'NORMAL',
  };
}

function withActiveRelationship(state) {
  return { ...state, relationship: { ...state.relationship, status: 'ACTIVE', consentedAt: FIXED_CLOCK } };
}

function withConfirmedTask(state, time = '09:00') {
  return {
    ...state,
    task: {
      ...state.task,
      status: 'CONFIRMED',
      parsingStatus: 'SUCCEEDED',
      rawInput: FIXED_INPUT,
      details: finalDetails(time),
      reminderAt: time === '14:00' ? '2026-10-07T13:30:00+08:00' : '2026-10-07T08:30:00+08:00',
      version: 1,
      wasCorrected: true,
    },
  };
}

function request(status, response = null) {
  return {
    id: 'request-1-1',
    status,
    taskVersion: 1,
    sharedFields: { title: '办理公交卡年审', date: '2026-10-07', time: '09:00', location: '社区服务中心', help: '希望小梅陪同' },
    response,
    sentAt: FIXED_CLOCK,
    sendAttempts: 1,
  };
}

export const DEMO_SCENARIOS = [
  ['INITIAL', 'Initial'],
  ['MAIN_FLOW', 'Main Flow'],
  ['RECOGNITION_ERROR', 'Recognition Error'],
  ['MISSING_INFORMATION', 'Missing Information'],
  ['AI_FAILURE', 'AI Failure'],
  ['SEND_FAILURE', 'Send Failure'],
  ['PENDING_FAMILY', 'Pending Family'],
  ['ACCEPTED', 'Accepted'],
  ['DECLINED', 'Declined'],
  ['CHANGE_PROPOSED', 'Change Proposed'],
  ['WITHDRAWN', 'Withdrawn'],
  ['CANCELLED', 'Cancelled'],
  ['REMINDER_TRIGGER', 'Reminder Trigger'],
];

export function createDemoSnapshot(scenario) {
  const base = { ...createInitialState(), demoScenario: scenario };
  if (scenario === 'INITIAL') return base;
  if (scenario === 'MAIN_FLOW') return { ...withConfirmedTask(withActiveRelationship(base)), currentView: 'TASK_SAVED' };
  if (scenario === 'RECOGNITION_ERROR') return {
    ...withActiveRelationship(base),
    task: { ...base.task, status: 'NEEDS_CONFIRMATION', parsingStatus: 'SUCCEEDED', rawInput: FIXED_INPUT, details: finalDetails('08:00'), reminderAt: '2026-10-07T07:30:00+08:00' },
    currentView: 'TASK_CONFIRM',
  };
  if (scenario === 'MISSING_INFORMATION') return {
    ...base,
    task: { ...base.task, status: 'MISSING_REQUIRED', parsingStatus: 'SUCCEEDED', rawInput: FIXED_INPUT, details: { ...finalDetails(), time: null, location: null } },
    currentView: 'TASK_MISSING',
  };
  if (scenario === 'AI_FAILURE') return { ...base, task: { ...base.task, status: 'PARSE_FAILED', parsingStatus: 'FAILED', rawInput: FIXED_INPUT }, currentView: 'TASK_PARSE_FAILED' };
  if (scenario === 'SEND_FAILURE') return {
    ...withConfirmedTask(withActiveRelationship(base)),
    collaborationRequest: { ...base.collaborationRequest, sendAttempts: 1 },
    currentView: 'REQUEST_SEND_FAILED',
  };
  if (scenario === 'PENDING_FAMILY') return { ...withConfirmedTask(withActiveRelationship(base)), collaborationRequest: request('PENDING'), currentRole: 'FAMILY', currentView: 'FAMILY_REQUEST' };
  if (scenario === 'ACCEPTED') return { ...withConfirmedTask(withActiveRelationship(base)), collaborationRequest: request('ACCEPTED', { type: 'ACCEPTED', by: 'family-mei', at: FIXED_CLOCK }), currentView: 'ELDER_ACCEPTED' };
  if (scenario === 'DECLINED') return { ...withConfirmedTask(withActiveRelationship(base)), collaborationRequest: request('DECLINED', { type: 'DECLINED', by: 'family-mei', at: FIXED_CLOCK }), currentView: 'ELDER_DECLINED' };
  if (scenario === 'CHANGE_PROPOSED') return { ...withConfirmedTask(withActiveRelationship(base)), collaborationRequest: request('CHANGE_PROPOSED', { type: 'CHANGE_PROPOSED', proposedTime: '14:00', by: 'family-mei', at: FIXED_CLOCK }), currentView: 'ELDER_CHANGE_PROPOSED' };
  if (scenario === 'WITHDRAWN') return { ...withConfirmedTask(withActiveRelationship(base)), collaborationRequest: request('WITHDRAWN'), currentView: 'REQUEST_WITHDRAWN' };
  if (scenario === 'CANCELLED') {
    const state = withConfirmedTask(withActiveRelationship(base));
    return { ...state, task: { ...state.task, status: 'CANCELLED', reminderAt: null }, collaborationRequest: request('INVALIDATED'), currentView: 'TASK_CANCELLED' };
  }
  if (scenario === 'REMINDER_TRIGGER') return { ...withConfirmedTask(withActiveRelationship(base)), collaborationRequest: request('ACCEPTED', { type: 'ACCEPTED', by: 'family-mei', at: FIXED_CLOCK }), demoClock: REMINDER_CLOCK, currentView: 'TASK_REMINDER' };
  throw new Error(`Unknown demo scenario: ${scenario}`);
}
