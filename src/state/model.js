import { createDemoSnapshot, createInitialState } from './initial-state.js';

export const STORAGE_KEY = 'elder-family-assistant/state/v1';

export function reduce(state, action) {
  if (action.type === 'LOAD_SCREEN') return action.snapshot;
  if (state.catalogScreenId) state = { ...state, catalogScreenId: null };
  if (state.collaborationRequest.status === 'SENDING' && ['NAVIGATE','SET_ROLE','SET_ROLE_VIEW','START_SHARE'].includes(action.type)) {
    state = { ...state, collaborationRequest: { ...state.collaborationRequest, status: state.collaborationRequest.sendingFrom || 'NONE', sendingToken: null } };
  }
  const elderOnly = new Set(['START_TASK','PARSE_TASK_SUCCESS','PARSE_TASK_MISSING','PARSE_TASK_FAILURE','FILL_MISSING_FIELDS','SHOW_MANUAL_FORM','MANUAL_FILL_TASK','EDIT_TASK_TIME','UPDATE_TASK_TIME','CONFIRM_TASK','UPDATE_RAW_INPUT','UPDATE_MANUAL_FIELD','TRIGGER_REMINDER','ASK_COMPLETE_TASK','COMPLETE_TASK']);
  if (elderOnly.has(action.type) && state.currentRole !== 'ELDER') return state;
  const canRespond = state.currentRole === 'FAMILY' && state.relationship.status === 'ACTIVE' && state.task.status === 'CONFIRMED' && ['PENDING','NO_RESPONSE'].includes(state.collaborationRequest.status) && state.collaborationRequest.taskVersion === state.task.version && (!action.requestId || action.requestId === state.collaborationRequest.id);
  switch (action.type) {
    case 'ENTER_TASK_INPUT':
      if (state.currentRole !== 'ELDER') return state;
      if (state.task.status === 'CONFIRMED') return { ...state, currentView: 'TASK_SAVED' };
      return ['CANCELLED','COMPLETED'].includes(state.task.status) ? { ...state, task: { ...createInitialState().task, version: state.task.version }, manualDraft: null, formError: null, collaborationRequest: createInitialState().collaborationRequest, requestHistory: [], currentView: 'TASK_INPUT' } : { ...state, currentView: 'TASK_INPUT' };
    case 'NAVIGATE':
      return { ...state, currentView: action.view };
    case 'SET_ROLE':
      return { ...state, currentRole: action.role, currentView: action.role === 'FAMILY' ? 'FAMILY_HOME' : 'ELDER_HOME' };
    case 'SET_ROLE_VIEW':
      return { ...state, currentRole: action.role, currentView: action.view };
    case 'SHOW_RELATIONSHIP_QR':
      if (state.currentRole !== 'ELDER' || state.relationship.status === 'ACTIVE') return state;
      return { ...state, relationship: { ...state.relationship, status: 'QR_READY' }, currentView: 'RELATIONSHIP' };
    case 'FAMILY_SCAN_RELATIONSHIP':
      if (state.currentRole !== 'FAMILY' || state.relationship.status !== 'QR_READY') return state;
      return { ...state, relationship: { ...state.relationship, status: 'PENDING_ELDER' }, currentView: 'RELATIONSHIP' };
    case 'CANCEL_RELATIONSHIP_QR':
      if (!['QR_READY','PENDING_ELDER'].includes(state.relationship.status)) return state;
      return { ...state, relationship: { ...state.relationship, status: 'UNLINKED' }, currentView: state.currentRole === 'FAMILY' ? 'FAMILY_HOME' : 'ELDER_HOME' };
    case 'ASK_ESTABLISH_RELATIONSHIP':
      return { ...state, currentView: 'RELATIONSHIP_CONFIRM' };
    case 'VIEW_PERMISSIONS':
      return { ...state, returnView: state.currentView, currentView: 'PERMISSIONS' };
    case 'RETURN_VIEW':
      return { ...state, currentView: state.returnView || 'ELDER_HOME' };
    case 'ASK_END_RELATIONSHIP':
      return state.relationship.status === 'ACTIVE' ? { ...state, currentView: 'RELATIONSHIP_END_CONFIRM' } : state;
    case 'END_RELATIONSHIP':
      if (state.relationship.status !== 'ACTIVE') return state;
      return { ...state, relationship: { ...state.relationship, status: 'ENDED', consentedAt: null }, collaborationRequest: { ...state.collaborationRequest, status: state.collaborationRequest.status === 'NONE' ? 'NONE' : 'INVALIDATED', response: null }, currentView: 'RELATIONSHIP_ENDED' };
    case 'UPDATE_RAW_INPUT':
      if (['CONFIRMED','CANCELLED','COMPLETED'].includes(state.task.status)) return state;
      return { ...state, task: { ...state.task, status: state.task.status === 'EMPTY' ? 'DRAFT' : state.task.status, rawInput: action.value } };
    case 'UPDATE_MANUAL_FIELD':
      return { ...state, manualDraft: { ...state.manualDraft, [action.field]: action.value } };
    case 'SET_DISPLAY_MODE':
      return { ...state, settings: { ...state.settings, [action.key]: action.value } };
    case 'START_TASK':
      if (state.task.status === 'CONFIRMED') return { ...state, currentView: 'TASK_SAVED' };
      return {
        ...state,
        task: { ...createInitialState().task, status: 'DRAFT', parsingStatus: 'PARSING', rawInput: action.rawInput, version: state.task.version, parseToken: action.parseToken },
        collaborationRequest: createInitialState().collaborationRequest,
        requestHistory: [],
        currentView: 'TASK_PROCESSING',
      };
    case 'PARSE_TASK_SUCCESS':
      if (state.task.status !== 'DRAFT' || state.currentView !== 'TASK_PROCESSING') return state;
      if (action.parseToken && action.parseToken !== state.task.parseToken) return state;
      if (!state.task.rawInput.trim()) return reduce(state, { type: 'PARSE_TASK_MISSING' });
      if (!state.task.rawInput.includes('公交卡') || !state.task.rawInput.includes('九点')) return reduce(state, { type: 'PARSE_TASK_FAILURE' });
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
    case 'PARSE_TASK_MISSING':
      if (!['EMPTY','DRAFT'].includes(state.task.status)) return state;
      return {
        ...state,
        task: {
          ...state.task,
          status: 'MISSING_REQUIRED',
          parsingStatus: 'SUCCEEDED',
          details: state.task.rawInput.trim() ? { title: '办理公交卡年审', date: '2026-10-07', time: null, location: null, familyIntent: '希望小梅陪同' } : { title: null, date: null, time: null, location: null, familyIntent: null },
          reminderAt: null,
        },
        currentView: 'TASK_MISSING',
      };
    case 'FILL_MISSING_FIELDS':
      if (state.task.status !== 'MISSING_REQUIRED') return state;
      return {
        ...state,
        task: {
          ...state.task,
          status: 'NEEDS_CONFIRMATION',
          details: { ...state.task.details, time: '09:00', location: '社区服务中心' },
          reminderAt: '2026-10-07T08:30:00+08:00',
          wasCorrected: true,
        },
        currentView: 'TASK_CONFIRM',
      };
    case 'PARSE_TASK_FAILURE':
      if (!['EMPTY','DRAFT'].includes(state.task.status)) return state;
      return {
        ...state,
        task: { ...state.task, status: 'PARSE_FAILED', parsingStatus: 'FAILED', details: null, reminderAt: null },
        currentView: 'TASK_PARSE_FAILED',
      };
    case 'SHOW_MANUAL_FORM':
      return { ...state, task: { ...state.task, status: state.task.status === 'EMPTY' ? 'DRAFT' : state.task.status }, currentView: 'TASK_MANUAL_FORM' };
    case 'MANUAL_FILL_TASK':
      if (!['PARSE_FAILED','MISSING_REQUIRED','DRAFT','NEEDS_CONFIRMATION'].includes(state.task.status)) return state;
      if (state.manualDraft && (!state.manualDraft.title?.trim() || !state.manualDraft.location?.trim() || !['09:00','14:00'].includes(state.manualDraft.time))) return { ...state, formError: '请填写事情、时间和地点，再继续。' };
      return {
        ...state,
        formError: null,
        task: {
          ...state.task,
          status: 'NEEDS_CONFIRMATION',
          parsingStatus: 'MANUAL',
          details: { title: '办理公交卡年审', date: '2026-10-07', time: '09:00', location: '社区服务中心', familyIntent: '希望小梅陪同', ...state.manualDraft },
          reminderAt: `2026-10-07T${state.manualDraft?.time === '14:00' ? '13:30' : '08:30'}:00+08:00`,
          wasCorrected: true,
        },
        currentView: 'TASK_CONFIRM',
      };
    case 'EDIT_TASK_TIME':
      return { ...state, currentView: 'TASK_EDIT_TIME' };
    case 'UPDATE_TASK_TIME': {
      if (!state.task.details || state.task.status !== 'NEEDS_CONFIRMATION' || !['08:00','09:00','14:00'].includes(action.time)) return state;
      const time = action.time;
      const reminderTime = time === '09:00' ? '08:30:00' : time === '14:00' ? '13:30:00' : '07:30:00';
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
      if (state.task.status !== 'NEEDS_CONFIRMATION' || !state.task.wasCorrected || !state.task.details?.title?.trim() || !state.task.details?.location?.trim() || !['09:00','14:00'].includes(state.task.details?.time)) return { ...state, formError: '请补齐事情、时间和地点，再确认。' };
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
    case 'DECLINE_RELATIONSHIP':
      if (state.currentRole !== 'ELDER' || state.relationship.status !== 'PENDING_ELDER') return state;
      return {
        ...state,
        relationship: { ...state.relationship, status: 'DECLINED', consentedAt: null },
        currentView: 'RELATIONSHIP_DECLINED',
      };
    case 'KEEP_PRIVATE':
      if (state.currentRole !== 'ELDER' || state.task.status !== 'CONFIRMED') return state;
      return { ...state, currentView: 'PRIVATE_ONLY' };
    case 'START_SHARE':
      if (state.currentRole !== 'ELDER' || state.relationship.status !== 'ACTIVE' || state.task.status !== 'CONFIRMED') return state;
      return { ...state, currentView: 'SHARE_REVIEW' };
    case 'SEND_REQUEST': {
      const details = state.task.details;
      if (state.currentRole !== 'ELDER' || !details || state.relationship.status !== 'ACTIVE' || state.task.status !== 'CONFIRMED') return state;
      if (['PENDING','NO_RESPONSE','ACCEPTED','DECLINED','CHANGE_PROPOSED'].includes(state.collaborationRequest.status) && state.collaborationRequest.taskVersion === state.task.version) return state;
      return {
        ...state,
        collaborationRequest: {
          id: `request-${state.task.version}-${state.collaborationRequest.sendAttempts + 1}`,
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
          sendAttempts: state.collaborationRequest.sendAttempts + 1,
        },
        currentView: 'REQUEST_SENT',
      };
    }
    case 'BEGIN_SEND':
      if (state.currentRole !== 'ELDER' || state.task.status !== 'CONFIRMED' || state.relationship.status !== 'ACTIVE' || ['PENDING','NO_RESPONSE','ACCEPTED','DECLINED','CHANGE_PROPOSED','SENDING'].includes(state.collaborationRequest.status)) return state;
      return { ...state, sendSequence: (state.sendSequence || 0) + 1, collaborationRequest: { ...state.collaborationRequest, status: 'SENDING', sendingFrom: state.collaborationRequest.status, sendingToken: `send-${state.task.version}-${(state.sendSequence || 0) + 1}` }, currentView: 'REQUEST_SENDING' };
    case 'SIMULATE_SEND_FAILURE':
      if (state.currentRole !== 'ELDER' || state.task.status !== 'CONFIRMED' || state.relationship.status !== 'ACTIVE') return state;
      if (['PENDING','NO_RESPONSE','ACCEPTED','DECLINED','CHANGE_PROPOSED'].includes(state.collaborationRequest.status)) return state;
      return {
        ...state,
        collaborationRequest: { ...state.collaborationRequest, status: 'NONE', sharedFields: null, response: null, sentAt: null, sendAttempts: state.collaborationRequest.sendAttempts + 1 },
        currentView: 'REQUEST_SEND_FAILED',
      };
    case 'MARK_NO_RESPONSE':
      if (state.currentRole !== 'ELDER' || state.collaborationRequest.status !== 'PENDING') return state;
      return { ...state, collaborationRequest: { ...state.collaborationRequest, status: 'NO_RESPONSE' }, currentView: 'REQUEST_NO_RESPONSE' };
    case 'CONTINUE_WAITING':
      if (state.currentRole !== 'ELDER' || !['PENDING', 'NO_RESPONSE'].includes(state.collaborationRequest.status)) return state;
      return { ...state, collaborationRequest: { ...state.collaborationRequest, status: 'PENDING' }, currentView: 'REQUEST_SENT' };
    case 'ASK_WITHDRAW_REQUEST':
      if (state.currentRole !== 'ELDER' || !['PENDING', 'NO_RESPONSE','CHANGE_PROPOSED'].includes(state.collaborationRequest.status)) return state;
      return { ...state, currentView: 'REQUEST_WITHDRAW_CONFIRM' };
    case 'WITHDRAW_REQUEST':
      if (state.currentRole !== 'ELDER' || !['PENDING', 'NO_RESPONSE','CHANGE_PROPOSED'].includes(state.collaborationRequest.status)) return state;
      return { ...state, collaborationRequest: { ...state.collaborationRequest, status: 'WITHDRAWN', response: null }, currentView: 'REQUEST_WITHDRAWN' };
    case 'ACCEPT_REQUEST':
      if (!canRespond) return state;
      return {
        ...state,
        collaborationRequest: { ...state.collaborationRequest, status: 'ACCEPTED', response: { type: 'ACCEPTED', by: 'family-mei', at: state.demoClock } },
        currentView: 'FAMILY_ACCEPTED',
      };
    case 'DECLINE_REQUEST':
      if (!canRespond) return state;
      return {
        ...state,
        collaborationRequest: { ...state.collaborationRequest, status: 'DECLINED', response: { type: 'DECLINED', by: 'family-mei', at: state.demoClock } },
        currentView: 'FAMILY_DECLINED',
      };
    case 'PROPOSE_CHANGE':
      if (!canRespond) return state;
      return {
        ...state,
        collaborationRequest: { ...state.collaborationRequest, status: 'CHANGE_PROPOSED', response: { type: 'CHANGE_PROPOSED', proposedTime: '14:00', by: 'family-mei', at: state.demoClock } },
        currentView: 'FAMILY_CHANGE_PROPOSED',
      };
    case 'ACCEPT_PROPOSED_CHANGE':
      if (state.currentRole !== 'ELDER' || state.collaborationRequest.status !== 'CHANGE_PROPOSED') return state;
      return {
        ...state,
        task: { ...state.task, details: { ...state.task.details, time: '14:00' }, reminderAt: '2026-10-07T13:30:00+08:00', version: state.task.version + 1 },
        requestHistory: [...state.requestHistory, { ...state.collaborationRequest, status: 'INVALIDATED' }],
        collaborationRequest: { ...state.collaborationRequest, status: 'INVALIDATED', response: null },
        currentView: 'CHANGE_ACCEPTED',
      };
    case 'REJECT_PROPOSED_CHANGE':
      if (state.currentRole !== 'ELDER' || state.collaborationRequest.status !== 'CHANGE_PROPOSED') return state;
      return { ...state, collaborationRequest: { ...state.collaborationRequest, status: 'PENDING', response: null }, currentView: 'CHANGE_REJECTED' };
    case 'CANCEL_TASK':
      if (state.currentRole !== 'ELDER' || !['CONFIRMED'].includes(state.task.status)) return state;
      return {
        ...state,
        task: { ...state.task, status: 'CANCELLED', reminderAt: null, pendingChange: null },
        collaborationRequest: state.collaborationRequest.status === 'NONE'
          ? state.collaborationRequest
          : { ...state.collaborationRequest, status: 'INVALIDATED', response: null },
        currentView: 'TASK_CANCELLED',
      };
    case 'ASK_CANCEL_TASK':
      if (state.currentRole !== 'ELDER' || state.task.status !== 'CONFIRMED') return state;
      return { ...state, currentView: 'TASK_CANCEL_CONFIRM' };
    case 'CANCEL_TASK_BACK': {
      const view = state.collaborationRequest.status === 'PENDING'
        ? 'REQUEST_SENT'
        : state.collaborationRequest.status === 'ACCEPTED'
          ? 'ELDER_ACCEPTED'
          : 'TASK_SAVED';
      return { ...state, currentView: view };
    }
    case 'START_POST_ACCEPT_EDIT':
      if (state.currentRole !== 'ELDER' || state.task.status !== 'CONFIRMED') return state;
      return { ...state, task: { ...state.task, pendingChange: { time: '14:00' } }, currentView: 'TASK_EDIT_IMPACT' };
    case 'CONFIRM_POST_ACCEPT_CHANGE': {
      if (state.currentRole !== 'ELDER' || state.task.status !== 'CONFIRMED' || state.task.pendingChange?.time !== '14:00') return state;
      const nextVersion = state.task.version + 1;
      const oldRequest = { ...state.collaborationRequest, status: 'INVALIDATED', invalidatedAt: state.demoClock };
      return {
        ...state,
        task: { ...state.task, details: { ...state.task.details, time: '14:00' }, reminderAt: '2026-10-07T13:30:00+08:00', version: nextVersion, pendingChange: null },
        requestHistory: state.collaborationRequest.status === 'NONE' ? state.requestHistory : [...state.requestHistory, oldRequest],
        collaborationRequest: { ...state.collaborationRequest, status: state.collaborationRequest.status === 'NONE' ? 'NONE' : 'INVALIDATED', response: null },
        currentView: 'POST_ACCEPT_CHANGED',
      };
    }
    case 'TRIGGER_REMINDER':
      if (state.task.status !== 'CONFIRMED') return state;
      return { ...state, demoClock: state.task.reminderAt, currentView: 'TASK_REMINDER' };
    case 'ASK_COMPLETE_TASK':
      return state.task.status === 'CONFIRMED' ? { ...state, currentView: 'TASK_COMPLETE_CONFIRM' } : state;
    case 'COMPLETE_TASK':
      return state.currentRole === 'ELDER' && state.task.status === 'CONFIRMED'
        ? { ...state, task: { ...state.task, status: 'COMPLETED', reminderAt: null }, currentView: 'TASK_COMPLETED' }
        : state;
    case 'SET_SCENARIO':
      return { ...state, demoScenario: action.scenario };
    case 'LOAD_DEMO_SCENARIO':
      return createDemoSnapshot(action.scenario);
    case 'RESET':
      return createInitialState();
    default:
      return state;
  }
}

export function validateState(state) {
  const required = ['relationship', 'task', 'collaborationRequest', 'requestHistory', 'currentRole', 'demoClock', 'demoScenario'];
  const missing = required.filter(key => !(key in state));
  if (missing.length) throw new Error(`State is missing: ${missing.join(', ')}`);
  if (state.task.status === 'CONFIRMED' && (!state.task.details || !state.task.reminderAt)) throw new Error('Confirmed task must include details and reminder');
  if (state.task.status === 'COMPLETED' && !state.task.details) throw new Error('Completed task must retain its details');
  if (state.task.status === 'CANCELLED' && state.task.reminderAt !== null) throw new Error('Cancelled task cannot keep a reminder');
  if (state.collaborationRequest.status === 'PENDING' && state.collaborationRequest.taskVersion !== state.task.version) throw new Error('Pending request must match the current task version');
  return state;
}
