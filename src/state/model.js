import { createInitialState } from './initial-state.js';

export const STORAGE_KEY = 'elder-family-assistant/state/v1';

export function reduce(state, action) {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, currentView: action.view };
    case 'SET_ROLE':
      return { ...state, currentRole: action.role, currentView: action.role === 'FAMILY' ? 'FAMILY_HOME' : 'ELDER_HOME' };
    case 'SET_ROLE_VIEW':
      return { ...state, currentRole: action.role, currentView: action.view };
    case 'SHOW_RELATIONSHIP_QR':
      return { ...state, relationship: { ...state.relationship, status: 'QR_READY' }, currentView: 'RELATIONSHIP' };
    case 'FAMILY_SCAN_RELATIONSHIP':
      return { ...state, relationship: { ...state.relationship, status: 'PENDING_ELDER' }, currentView: 'RELATIONSHIP' };
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
            time: '08:00',
            location: '社区服务中心',
            familyIntent: '希望小梅陪同',
          },
          reminderAt: '2026-10-07T07:30:00+08:00',
        },
        currentView: 'TASK_CONFIRM',
      };
    case 'EDIT_TASK_TIME':
      return { ...state, currentView: 'TASK_EDIT_TIME' };
    case 'UPDATE_TASK_TIME': {
      if (!state.task.details) return state;
      const time = action.time;
      const reminderTime = time === '09:00' ? '08:30:00' : '07:30:00';
      return {
        ...state,
        task: {
          ...state.task,
          details: { ...state.task.details, time },
          reminderAt: `2026-10-07T${reminderTime}+08:00`,
          wasCorrected: true,
        },
        currentView: 'TASK_CONFIRM',
      };
    }
    case 'CONFIRM_TASK':
      if (state.task.status !== 'NEEDS_CONFIRMATION' || state.task.details?.time !== '09:00') return state;
      return {
        ...state,
        task: { ...state.task, status: 'CONFIRMED', version: state.task.version + 1 },
        currentView: 'TASK_SAVED',
      };
    case 'ESTABLISH_RELATIONSHIP':
      if (state.currentRole !== 'ELDER' || state.relationship.status !== 'PENDING_ELDER') return state;
      return {
        ...state,
        relationship: { ...state.relationship, status: 'ACTIVE', consentedAt: state.demoClock },
        currentView: 'RELATIONSHIP',
      };
    case 'START_SHARE':
      if (state.currentRole !== 'ELDER' || state.relationship.status !== 'ACTIVE' || state.task.status !== 'CONFIRMED') return state;
      return { ...state, currentView: 'SHARE_REVIEW' };
    case 'SEND_REQUEST': {
      const details = state.task.details;
      if (state.currentRole !== 'ELDER' || !details || state.relationship.status !== 'ACTIVE' || state.task.status !== 'CONFIRMED') return state;
      return {
        ...state,
        collaborationRequest: {
          status: 'PENDING',
          taskVersion: state.task.version,
          sharedFields: {
            title: details.title,
            date: details.date,
            time: details.time,
            location: details.location,
            help: '希望小梅陪同',
          },
          response: null,
          sentAt: state.demoClock,
        },
        currentView: 'REQUEST_SENT',
      };
    }
    case 'ACCEPT_REQUEST':
      if (state.currentRole !== 'FAMILY' || state.collaborationRequest.status !== 'PENDING') return state;
      return {
        ...state,
        collaborationRequest: { ...state.collaborationRequest, status: 'ACCEPTED', response: { type: 'ACCEPTED', by: 'family-mei', at: state.demoClock } },
        currentView: 'FAMILY_ACCEPTED',
      };
    case 'TRIGGER_REMINDER':
      if (state.task.status !== 'CONFIRMED') return state;
      return { ...state, demoClock: '2026-10-07T08:30:00+08:00', currentView: 'TASK_REMINDER' };
    case 'ASK_COMPLETE_TASK':
      return state.task.status === 'CONFIRMED' ? { ...state, currentView: 'TASK_COMPLETE_CONFIRM' } : state;
    case 'COMPLETE_TASK':
      return state.currentRole === 'ELDER' && state.task.status === 'CONFIRMED'
        ? { ...state, task: { ...state.task, status: 'COMPLETED' }, currentView: 'TASK_COMPLETED' }
        : state;
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
  if (state.task.status === 'COMPLETED' && !state.task.details) throw new Error('Completed task must retain its details');
  return state;
}
