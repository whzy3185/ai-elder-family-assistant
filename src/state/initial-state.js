export const FIXED_INPUT = '明天上午九点去社区服务中心办理公交卡年审，提前半小时提醒我，再问问小梅能不能陪我去。';

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
    demoClock: '2026-10-06T20:00:00+08:00',
    demoScenario: 'NORMAL',
  };
}
