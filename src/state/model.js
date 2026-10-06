import { createInitialState } from './initial-state.js';

export const STORAGE_KEY = 'elder-family-assistant/state/v1';

export function reduce(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentView: action.view };
    case 'SET_ROLE':
      return { ...state, currentRole: action.role, currentView: action.role === 'FAMILY' ? 'FAMILY_HOME' : 'ELDER_HOME' };
    case 'START_TASK':
      return {
        ...state,
        task: { ...state.task, status: 'DRAFT', parsingStatus: 'IDLE', rawInput: action.rawInput },
        currentView: 'TASK_PROCESSING',
      };
    case 'PARSE_TASK_SUCCESS':
      return {
        ...state,
        task: {
          ...state.task,
          status: 'NEEDS_CONFIRMATION',
          parsingStatus: 'SUCCEEDED',
          details: {
            title: '办理公交卡年审',
            date: '2026-10-07',
            time: '09:00',
            location: '社区服务中心',
            familyIntent: '希望小梅陪同',
          },
          reminderAt: '2026-10-07T08:30:00+08:00',
        },
        currentView: 'TASK_CONFIRM',
      };
    case 'CONFIRM_TASK':
      if (state.task.status !== 'NEEDS_CONFIRMATION') return state;
      return {
        ...state,
        task: { ...state.task, status: 'CONFIRMED', version: state.task.version + 1 },
        currentView: 'TASK_SAVED',
      };
    case 'ESTABLISH_RELATIONSHIP':
      return {
        ...state,
        relationship: { ...state.relationship, status: 'ACTIVE', consentedAt: state.demoClock },
        currentView: 'RELATIONSHIP',
      };
    case 'SET_SCENARIO':
      return { ...state, demoScenario: action.scenario };
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

export function validateState(state) {
  const required = ['relationship', 'task', 'collaborationRequest', 'currentRole', 'demoClock', 'demoScenario'];
  const missing = required.filter(key => !(key in state));
  if (missing.length) throw new Error(`State is missing: ${missing.join(', ')}`);
  if (state.task.status === 'CONFIRMED' && (!state.task.details || !state.task.reminderAt)) throw new Error('Confirmed task must include details and reminder');
  return state;
}
