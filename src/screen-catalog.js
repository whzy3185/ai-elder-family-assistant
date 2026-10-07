import { createInitialState, createDemoSnapshot, FIXED_INPUT } from './state/initial-state.js';
import { reduce } from './state/model.js';

const actions = (s,...list) => list.reduce((v,a)=>reduce(v,a),s);
const at = (s,view,role='ELDER') => ({...s,currentView:view,currentRole:role});
export function screenSnapshot(id) {
  const initial=createInitialState(),saved=createDemoSnapshot('MAIN_FLOW');
  const error=createDemoSnapshot('RECOGNITION_ERROR');
  const corrected=actions(error,{type:'UPDATE_TASK_TIME',time:'09:00'});
  const pending=at(createDemoSnapshot('PENDING_FAMILY'),'REQUEST_SENT');
  const accepted=createDemoSnapshot('ACCEPTED'),declined=createDemoSnapshot('DECLINED');
  const proposed=createDemoSnapshot('CHANGE_PROPOSED');
  const changed=actions(accepted,{type:'START_POST_ACCEPT_EDIT'},{type:'CONFIRM_POST_ACCEPT_CHANGE'});
  const completed=actions(accepted,{type:'COMPLETE_TASK'});
  const relationship=status=>({...initial,relationship:{...initial.relationship,status,consentedAt:status==='ACTIVE'?initial.demoClock:null},currentView:'RELATIONSHIP'});
  const snapshots={
    'EL-TASK-00':initial,'EL-TASK-01':at(initial,'TASK_INPUT'),
    'EL-TASK-02':actions(initial,{type:'START_TASK',rawInput:FIXED_INPUT}),
    'EL-TASK-03A':at(corrected,'TASK_UNDERSTOOD'),'EL-TASK-03B':error,'EL-TASK-04':at(error,'TASK_EDIT_TIME'),
    'EL-TASK-05':corrected,'EL-TASK-06':saved,'EL-TASK-07':createDemoSnapshot('REMINDER_TRIGGER'),
    'EL-TASK-08':actions(accepted,{type:'START_POST_ACCEPT_EDIT'}),'EL-TASK-09A':at(accepted,'TASK_COMPLETE_CONFIRM'),
    'EL-TASK-09B':completed,'EL-TASK-10':at(completed,'ELDER_HOME'),
    'EL-EX-01':createDemoSnapshot('MISSING_INFORMATION'),'EL-EX-02A':createDemoSnapshot('AI_FAILURE'),
    'EL-EX-02B':at(createDemoSnapshot('AI_FAILURE'),'TASK_MANUAL_FORM'),
    'EL-SHARE-01':at(saved,'SHARE_DECISION'),'EL-SHARE-01B':at(saved,'PRIVATE_ONLY'),
    'EL-SHARE-02':at(saved,'SHARE_REVIEW'),
    'EL-SHARE-03':actions(saved,{type:'START_SHARE'},{type:'BEGIN_SEND'}),
    'EL-SHARE-04A':pending,'EL-SHARE-04B':at(pending,'REQUEST_WAITING'),
    'EL-SHARE-05':accepted,'EL-SHARE-06':declined,'EL-SHARE-07':proposed,
    'EL-SHARE-08':actions(proposed,{type:'ACCEPT_PROPOSED_CHANGE'}),
    'EL-SHARE-09':actions(proposed,{type:'REJECT_PROPOSED_CHANGE'}),
    'EL-EX-03':createDemoSnapshot('SEND_FAILURE'),'EL-EX-04':actions(pending,{type:'MARK_NO_RESPONSE'}),
    'EL-EX-05A':at(pending,'REQUEST_WITHDRAW_CONFIRM'),'EL-EX-05B':createDemoSnapshot('WITHDRAWN'),
    'EL-EX-06A':at(pending,'TASK_CANCEL_CONFIRM'),'EL-EX-06B':createDemoSnapshot('CANCELLED'),
    'EL-EX-07A':at(actions(accepted,{type:'START_POST_ACCEPT_EDIT'}),'POST_ACCEPT_EDIT'),'EL-EX-07B':changed,'EL-SET-01':at(saved,'SETTINGS'),
    'EL-REL-01':relationship('UNLINKED'),'EL-REL-01A':relationship('QR_READY'),'FM-REL-01A':at(relationship('PENDING_ELDER'),'RELATIONSHIP','FAMILY'),'FM-REL-04A':at(accepted,'RELATIONSHIP_END_CONFIRM','FAMILY'),'FM-REL-01':at(relationship('QR_READY'),'RELATIONSHIP','FAMILY'),
    'EL-REL-02':relationship('PENDING_ELDER'),'EL-REL-02A':at(relationship('PENDING_ELDER'),'RELATIONSHIP_CONFIRM'),
    'EL-REL-03':at(relationship('DECLINED'),'RELATIONSHIP_DECLINED'),
    'FM-REL-03':at(relationship('DECLINED'),'RELATIONSHIP','FAMILY'),
    'EL-REL-06':relationship('ACTIVE'),'FM-REL-02':at(relationship('ACTIVE'),'RELATIONSHIP','FAMILY'),
    'EL-REL-07':{...at(saved,'PERMISSIONS'),returnView:'TASK_SAVED'},
    'EL-REL-04A':at(accepted,'RELATIONSHIP_END_CONFIRM'),
    'EL-REL-05':actions(accepted,{type:'END_RELATIONSHIP'}),
    'FM-REL-04':at(actions(accepted,{type:'END_RELATIONSHIP'}),'RELATIONSHIP_ENDED','FAMILY'),
    'FM-REQ-00':at(saved,'FAMILY_HOME','FAMILY'),'FM-REQ-01':at(pending,'FAMILY_HOME','FAMILY'),
    'FM-REQ-02':at(pending,'FAMILY_REQUEST','FAMILY'),
    'FM-REQ-03A':at(pending,'FAMILY_ACCEPT_CONFIRM','FAMILY'),'FM-REQ-03B':at(accepted,'FAMILY_ACCEPTED','FAMILY'),
    'FM-REQ-04A':at(pending,'FAMILY_DECLINE_CONFIRM','FAMILY'),'FM-REQ-04B':at(declined,'FAMILY_DECLINED','FAMILY'),
    'FM-REQ-05A':at(pending,'FAMILY_PROPOSE_CONFIRM','FAMILY'),'FM-REQ-05B':at(proposed,'FAMILY_CHANGE_PROPOSED','FAMILY'),
    'FM-EX-01':at(createDemoSnapshot('WITHDRAWN'),'FAMILY_REQUEST','FAMILY'),
    'FM-EX-02':at(createDemoSnapshot('CANCELLED'),'FAMILY_REQUEST','FAMILY'),
    'FM-EX-03':at(changed,'FAMILY_REQUEST','FAMILY'),
    'DM-01':initial,'DM-02':at(initial,'DEMO'),'DM-03':at(initial,'DEMO'),
    'DM-04A':at(accepted,'RESET_CONFIRM'),'DM-04B':at(initial,'RESET_RESULT'),
  };
  if(!snapshots[id]) throw new Error(`Unknown screen: ${id}`);
  return {...structuredClone(snapshots[id]),catalogScreenId:id,demoScenario:`SCREEN:${id}`};
}

export function inferScreenId(s) {
  if(s.catalogScreenId) return s.catalogScreenId;
  const views={ELDER_HOME:['CANCELLED','COMPLETED'].includes(s.task.status)?'EL-TASK-10':'EL-TASK-00',TASK_INPUT:'EL-TASK-01',TASK_PROCESSING:'EL-TASK-02',TASK_UNDERSTOOD:'EL-TASK-03A',TASK_CONFIRM:s.task.wasCorrected?'EL-TASK-05':'EL-TASK-03B',TASK_EDIT_TIME:'EL-TASK-04',TASK_SAVED:'EL-TASK-06',TASK_REMINDER:'EL-TASK-07',TASK_EDIT_IMPACT:'EL-TASK-08',TASK_COMPLETE_CONFIRM:'EL-TASK-09A',TASK_COMPLETED:'EL-TASK-09B',TASK_MISSING:'EL-EX-01',TASK_PARSE_FAILED:'EL-EX-02A',TASK_MANUAL_FORM:'EL-EX-02B',SHARE_DECISION:'EL-SHARE-01',PRIVATE_ONLY:'EL-SHARE-01B',SHARE_REVIEW:'EL-SHARE-02',REQUEST_SENDING:'EL-SHARE-03',REQUEST_SENT:'EL-SHARE-04A',REQUEST_WAITING:'EL-SHARE-04B',ELDER_ACCEPTED:'EL-SHARE-05',ELDER_DECLINED:'EL-SHARE-06',ELDER_CHANGE_PROPOSED:'EL-SHARE-07',CHANGE_ACCEPTED:'EL-SHARE-08',CHANGE_REJECTED:'EL-SHARE-09',REQUEST_SEND_FAILED:'EL-EX-03',REQUEST_NO_RESPONSE:'EL-EX-04',REQUEST_WITHDRAW_CONFIRM:'EL-EX-05A',REQUEST_WITHDRAWN:'EL-EX-05B',TASK_CANCEL_CONFIRM:'EL-EX-06A',TASK_CANCELLED:'EL-EX-06B',POST_ACCEPT_EDIT:'EL-EX-07A',POST_ACCEPT_CHANGED:'EL-EX-07B',SETTINGS:'EL-SET-01',RELATIONSHIP_CONFIRM:'EL-REL-02A',RELATIONSHIP_DECLINED:'EL-REL-03',PERMISSIONS:'EL-REL-07',RELATIONSHIP_END_CONFIRM:s.currentRole==='FAMILY'?'FM-REL-04A':'EL-REL-04A',RELATIONSHIP_ENDED:s.currentRole==='FAMILY'?'FM-REL-04':'EL-REL-05',FAMILY_HOME:s.collaborationRequest.status==='NONE'?'FM-REQ-00':'FM-REQ-01',FAMILY_ACCEPT_CONFIRM:'FM-REQ-03A',FAMILY_ACCEPTED:'FM-REQ-03B',FAMILY_DECLINE_CONFIRM:'FM-REQ-04A',FAMILY_DECLINED:'FM-REQ-04B',FAMILY_PROPOSE_CONFIRM:'FM-REQ-05A',FAMILY_CHANGE_PROPOSED:'FM-REQ-05B',RESET_CONFIRM:'DM-04A',RESET_RESULT:'DM-04B',DEMO:'DM-02'};
  if(s.currentView==='RELATIONSHIP') return s.currentRole==='FAMILY' ? ({PENDING_ELDER:'FM-REL-01A',DECLINED:'FM-REL-03',ENDED:'FM-REL-04',ACTIVE:'FM-REL-02'}[s.relationship.status] || 'FM-REL-01') : ({QR_READY:'EL-REL-01A',PENDING_ELDER:'EL-REL-02',ACTIVE:'EL-REL-06',DECLINED:'EL-REL-03',ENDED:'EL-REL-05'}[s.relationship.status] || 'EL-REL-01');
  if(s.currentView==='FAMILY_REQUEST') return s.task.status==='CANCELLED'?'FM-EX-02':s.collaborationRequest.status==='WITHDRAWN'?'FM-EX-01':s.collaborationRequest.status==='INVALIDATED'?'FM-EX-03':'FM-REQ-02';
  return views[s.currentView] || 'EL-TASK-00';
}

export const screenDefinitions = [
{
  "id": "EL-REL-01A",
  "name": "等小梅打开邀请",
  "role": "老人",
  "entry": "点击邀请小梅后",
  "operations": "取消这次邀请",
  "next": "EL-TASK-00，或小梅申请后EL-REL-02",
  "test": "关系建立主流程"
},
{
  "id": "FM-REL-01A",
  "name": "等妈妈确认",
  "role": "家属",
  "entry": "向妈妈申请后",
  "operations": "回到消息",
  "next": "FM-REQ-00；妈妈确认后FM-REL-02",
  "test": "关系建立主流程"
},
{
  "id": "FM-REL-04A",
  "name": "结束和妈妈的协作？",
  "role": "家属",
  "entry": "家人页面点击结束家庭协作",
  "operations": "确认结束或继续保留",
  "next": "FM-REL-04或FM-REL-02",
  "test": "独立审查复验"
},
  {
    "id": "EL-TASK-00",
    "name": "首页空状态",
    "role": "老人",
    "entry": "已登录 fixture；无事务",
    "operations": "记一件事；查看家庭协作",
    "next": "`EL-TASK-01` 或 `EL-REL-01`",
    "test": "`TC-STATE-001`"
  },
  {
    "id": "EL-TASK-01",
    "name": "输入事务",
    "role": "老人",
    "entry": "点击“记一件事”",
    "operations": "模拟说话；手动输入；返回",
    "next": "`EL-TASK-02` 或首页",
    "test": "`TC-MAIN-001`、`TC-AI-003`"
  },
  {
    "id": "EL-TASK-02",
    "name": "AI 处理中",
    "role": "老人",
    "entry": "提交有效输入",
    "operations": "等待；返回取消解析",
    "next": "`EL-TASK-03A`、`EL-TASK-03B`、`EL-EX-01` 或 `EL-EX-02A`",
    "test": "`TC-MAIN-002`"
  },
  {
    "id": "EL-TASK-03A",
    "name": "AI 理解结果（无已知错误）",
    "role": "老人",
    "entry": "正常解析 fixture 成功",
    "operations": "改字段；确认",
    "next": "`EL-TASK-04` 或 `EL-TASK-05`",
    "test": "`TC-AI-005`"
  },
  {
    "id": "EL-TASK-03B",
    "name": "识别错误状态",
    "role": "老人",
    "entry": "主演示 fixture 解析成功",
    "operations": "改时间；改其他字段；确认",
    "next": "`EL-TASK-04` 或 `EL-TASK-05`",
    "test": "`TC-MAIN-003/004`"
  },
  {
    "id": "EL-TASK-04",
    "name": "修改单字段",
    "role": "老人",
    "entry": "在理解结果点击字段",
    "operations": "选 9:00；取消修改",
    "next": "`EL-TASK-05` 或 `EL-TASK-03B`",
    "test": "`TC-MAIN-004`"
  },
  {
    "id": "EL-TASK-05",
    "name": "确认事务",
    "role": "老人",
    "entry": "字段已修正且齐全",
    "operations": "确认记好；返回修改",
    "next": "`EL-TASK-06` 或 `EL-TASK-03B`",
    "test": "`TC-MAIN-005/006`"
  },
  {
    "id": "EL-TASK-06",
    "name": "保存个人提醒结果/事务详情",
    "role": "老人",
    "entry": "确认保存",
    "operations": "请小梅陪同；只提醒我；修改；取消",
    "next": "`EL-SHARE-01`、`EL-TASK-08` 或 `EL-EX-06A`",
    "test": "`TC-REM-001`"
  },
  {
    "id": "EL-TASK-07",
    "name": "提醒触发",
    "role": "老人",
    "entry": "Demo 时钟到 08:30；事务仍 `SAVED`",
    "operations": "知道了；查看事务",
    "next": "`EL-TASK-06`",
    "test": "`TC-REM-002`"
  },
  {
    "id": "EL-TASK-08",
    "name": "修改已共享事务",
    "role": "老人",
    "entry": "已有请求且点击修改",
    "operations": "继续修改；暂不修改",
    "next": "`EL-EX-07A` 或详情",
    "test": "`TC-VERSION-001`"
  },
  {
    "id": "EL-TASK-09A",
    "name": "确认事务完成",
    "role": "老人",
    "entry": "事务 `SAVED`",
    "operations": "这件事办完了；返回",
    "next": "`EL-TASK-09B` 或详情",
    "test": "`TC-COMPLETE-001`"
  },
  {
    "id": "EL-TASK-09B",
    "name": "事务完成结果",
    "role": "老人",
    "entry": "老人确认完成",
    "operations": "返回首页",
    "next": "`EL-TASK-10`",
    "test": "`TC-COMPLETE-001`"
  },
  {
    "id": "EL-TASK-10",
    "name": "结束结果/首页有完成结果",
    "role": "老人",
    "entry": "事务终结",
    "operations": "记一件新事；查看只读详情",
    "next": "`EL-TASK-01` 或终态详情",
    "test": "`TC-STATE-004`"
  },
  {
    "id": "EL-EX-01",
    "name": "必要信息缺失",
    "role": "老人",
    "entry": "解析缺少必要字段",
    "operations": "补填；返回输入",
    "next": "`EL-EX-02B` 或 `EL-TASK-01`",
    "test": "`TC-AI-001`"
  },
  {
    "id": "EL-EX-02A",
    "name": "AI 解析失败",
    "role": "老人",
    "entry": "失败场景 fixture",
    "operations": "再试一次；手动填写",
    "next": "`EL-TASK-02` 或 `EL-EX-02B`",
    "test": "`TC-AI-002`"
  },
  {
    "id": "EL-EX-02B",
    "name": "手动填写",
    "role": "老人",
    "entry": "选择手动填写或补字段",
    "operations": "保存并检查；返回",
    "next": "`EL-TASK-05` 或来源页",
    "test": "`TC-AI-003`"
  },
  {
    "id": "EL-SHARE-01",
    "name": "是否邀请小梅",
    "role": "老人",
    "entry": "个人事务已保存",
    "operations": "请小梅陪同；只提醒我",
    "next": "`EL-SHARE-02` 或 `EL-SHARE-01B`",
    "test": "`TC-MAIN-007`、`TC-SHARE-001`"
  },
  {
    "id": "EL-SHARE-01B",
    "name": "只提醒自己结果",
    "role": "老人",
    "entry": "选择不共享",
    "operations": "返回事务详情",
    "next": "`EL-TASK-06`",
    "test": "`TC-SHARE-001`"
  },
  {
    "id": "EL-SHARE-02",
    "name": "本次共享预览",
    "role": "老人",
    "entry": "选择请求小梅",
    "operations": "发给小梅；暂不发送；她能看到什么",
    "next": "`EL-SHARE-03`、详情或 `EL-REL-07`",
    "test": "`TC-MAIN-008/009`"
  },
  {
    "id": "EL-SHARE-03",
    "name": "请求发送中",
    "role": "老人",
    "entry": "明确确认发送",
    "operations": "等待",
    "next": "`EL-SHARE-04A` 或 `EL-EX-03`",
    "test": "`TC-STATE-002`"
  },
  {
    "id": "EL-SHARE-04A",
    "name": "请求发送成功",
    "role": "老人",
    "entry": "发送 adapter 成功",
    "operations": "查看等待状态",
    "next": "`EL-SHARE-04B`",
    "test": "`TC-MAIN-009`"
  },
  {
    "id": "EL-SHARE-04B",
    "name": "等待回应",
    "role": "老人",
    "entry": "请求已成功送达且暂无答复",
    "operations": "查看详情；撤回请求",
    "next": "本页或 `EL-EX-05A`",
    "test": "`TC-MAIN-009`"
  },
  {
    "id": "EL-SHARE-05",
    "name": "家属已接受",
    "role": "老人",
    "entry": "小梅接受有效请求",
    "operations": "知道了；查看事务；完成事务",
    "next": "详情或 `EL-TASK-09A`",
    "test": "`TC-MAIN-011`"
  },
  {
    "id": "EL-SHARE-06",
    "name": "家属已拒绝",
    "role": "老人",
    "entry": "小梅拒绝",
    "operations": "自行安排；取消事务",
    "next": "详情或 `EL-EX-06A`",
    "test": "`TC-COLLAB-002`"
  },
  {
    "id": "EL-SHARE-07",
    "name": "改期建议",
    "role": "老人",
    "entry": "小梅建议 14:00",
    "operations": "改成 14:00；还是 9:00；撤回请求",
    "next": "`EL-SHARE-08`、`EL-SHARE-09` 或 `EL-EX-05A`",
    "test": "`TC-COLLAB-003`"
  },
  {
    "id": "EL-SHARE-08",
    "name": "接受改期/新版本待重新分享",
    "role": "老人",
    "entry": "接受建议",
    "operations": "重新发给小梅；只保留事务",
    "next": "`EL-EX-07B` 或详情",
    "test": "`TC-COLLAB-004`"
  },
  {
    "id": "EL-SHARE-09",
    "name": "拒绝改期结果",
    "role": "老人",
    "entry": "坚持 9:00",
    "operations": "继续等待；撤回",
    "next": "`EL-SHARE-04B` 或 `EL-EX-05A`",
    "test": "`TC-COLLAB-005`"
  },
  {
    "id": "EL-EX-03",
    "name": "请求发送失败",
    "role": "老人",
    "entry": "发送 adapter 失败",
    "operations": "重试；暂不发送",
    "next": "`EL-SHARE-03` 或 `EL-SHARE-01B`",
    "test": "`TC-REQ-001`"
  },
  {
    "id": "EL-EX-04",
    "name": "家属未回应",
    "role": "老人",
    "entry": "`PENDING` 超过演示期限",
    "operations": "继续等；撤回；自行安排",
    "next": "本页或 `EL-EX-05A`",
    "test": "`TC-REQ-002`"
  },
  {
    "id": "EL-EX-05A",
    "name": "撤回请求确认",
    "role": "老人",
    "entry": "请求仍可撤回",
    "operations": "确认撤回；返回",
    "next": "`EL-EX-05B` 或来源页",
    "test": "`TC-CANCEL-001`"
  },
  {
    "id": "EL-EX-05B",
    "name": "撤回结果",
    "role": "老人",
    "entry": "确认撤回",
    "operations": "返回事务详情",
    "next": "`EL-TASK-06`",
    "test": "`TC-CANCEL-001`"
  },
  {
    "id": "EL-EX-06A",
    "name": "取消整个事务确认",
    "role": "老人",
    "entry": "事务 `SAVED`",
    "operations": "确认取消；返回",
    "next": "`EL-EX-06B` 或来源页",
    "test": "`TC-CANCEL-002`"
  },
  {
    "id": "EL-EX-06B",
    "name": "取消事务结果",
    "role": "老人",
    "entry": "确认取消",
    "operations": "返回首页",
    "next": "`EL-TASK-10`",
    "test": "`TC-CANCEL-002`"
  },
  {
    "id": "EL-EX-07A",
    "name": "修改共享字段/旧请求将失效",
    "role": "老人",
    "entry": "从 `EL-TASK-08` 继续",
    "operations": "确认新版本；返回",
    "next": "`EL-EX-07B` 或详情",
    "test": "`TC-VERSION-001`"
  },
  {
    "id": "EL-EX-07B",
    "name": "新版本重新分享",
    "role": "老人",
    "entry": "新版本已保存，旧请求 `INVALIDATED`",
    "operations": "查看共享并重新发送；只提醒自己",
    "next": "`EL-SHARE-02` 或 `EL-SHARE-01B`",
    "test": "`TC-VERSION-001/002`"
  },
  {
    "id": "EL-SET-01",
    "name": "显示设置（P1）",
    "role": "老人",
    "entry": "P1 功能已启用",
    "operations": "切换显示模式；恢复默认；返回",
    "next": "返回来源页",
    "test": "`TC-A11Y-004`"
  },
  {
    "id": "EL-REL-01",
    "name": "首次关系介绍",
    "role": "老人",
    "entry": "尚无关系，进入家庭协作",
    "operations": "显示二维码；暂不建立",
    "next": "`FM-REL-01` 或首页",
    "test": "`TC-REL-001`"
  },
  {
    "id": "FM-REL-01",
    "name": "模拟扫码并发起关系",
    "role": "家属",
    "entry": "扫描老人端演示二维码",
    "operations": "申请建立；取消",
    "next": "`EL-REL-02` 或家属空页",
    "test": "`TC-REL-001`"
  },
  {
    "id": "EL-REL-02",
    "name": "查看身份和权限",
    "role": "老人",
    "entry": "小梅已发起申请",
    "operations": "同意建立；暂不同意；她能看到什么",
    "next": "`EL-REL-02A`、`EL-REL-03` 或 `EL-REL-07`",
    "test": "`TC-REL-001/002`"
  },
  {
    "id": "EL-REL-02A",
    "name": "同意建立关系确认",
    "role": "老人",
    "entry": "在身份和权限页点击同意",
    "operations": "确认同意；返回",
    "next": "`EL-REL-06` 或 `EL-REL-02`",
    "test": "`TC-REL-001`"
  },
  {
    "id": "EL-REL-03",
    "name": "拒绝关系结果",
    "role": "老人",
    "entry": "点击暂不同意",
    "operations": "返回首页",
    "next": "`EL-TASK-00`",
    "test": "`TC-REL-002`"
  },
  {
    "id": "FM-REL-03",
    "name": "关系申请被拒绝",
    "role": "家属",
    "entry": "老人拒绝",
    "operations": "返回首页",
    "next": "`FM-REQ-00`",
    "test": "`TC-REL-002`"
  },
  {
    "id": "EL-REL-06",
    "name": "关系建立成功",
    "role": "老人",
    "entry": "老人同意",
    "operations": "返回首页；查看关系",
    "next": "`EL-TASK-00` 或 `EL-REL-04A`",
    "test": "`TC-REL-001`"
  },
  {
    "id": "FM-REL-02",
    "name": "关系建立成功",
    "role": "家属",
    "entry": "老人同意",
    "operations": "查看请求",
    "next": "`FM-REQ-00`",
    "test": "`TC-REL-001`"
  },
  {
    "id": "EL-REL-07",
    "name": "她能看到什么",
    "role": "老人",
    "entry": "关系或共享说明入口",
    "operations": "知道了",
    "next": "返回来源页",
    "test": "`TC-PERM-001`"
  },
  {
    "id": "EL-REL-04A",
    "name": "关系详情/结束确认",
    "role": "老人",
    "entry": "关系 `ACTIVE`",
    "operations": "结束关系；返回",
    "next": "`EL-REL-05` 或来源页",
    "test": "`TC-REL-003`"
  },
  {
    "id": "EL-REL-05",
    "name": "关系已结束",
    "role": "老人",
    "entry": "确认结束",
    "operations": "返回首页",
    "next": "`EL-TASK-00`",
    "test": "`TC-REL-003`"
  },
  {
    "id": "FM-REL-04",
    "name": "关系已结束",
    "role": "家属",
    "entry": "任一方结束关系",
    "operations": "返回首页",
    "next": "`FM-REQ-00`",
    "test": "`TC-REL-003`"
  },
  {
    "id": "FM-REQ-00",
    "name": "请求列表空状态",
    "role": "家属",
    "entry": "关系未建立、刚建立或没有有效请求",
    "operations": "查看关系",
    "next": "关系详情或本页",
    "test": "`TC-STATE-001`"
  },
  {
    "id": "FM-REQ-01",
    "name": "请求列表有数据",
    "role": "家属",
    "entry": "有 `PENDING` 请求",
    "operations": "查看请求",
    "next": "`FM-REQ-02`",
    "test": "`TC-MAIN-010`"
  },
  {
    "id": "FM-REQ-02",
    "name": "请求详情",
    "role": "家属",
    "entry": "打开当前有效请求",
    "operations": "我可以陪；这次不行；建议改期",
    "next": "`FM-REQ-03A`、`04A`、`05A`",
    "test": "`TC-MAIN-010`"
  },
  {
    "id": "FM-REQ-03A",
    "name": "接受确认",
    "role": "家属",
    "entry": "点击接受",
    "operations": "确认可以陪；返回",
    "next": "`FM-REQ-03B` 或详情",
    "test": "`TC-COLLAB-001`"
  },
  {
    "id": "FM-REQ-03B",
    "name": "接受结果",
    "role": "家属",
    "entry": "确认接受",
    "operations": "返回列表",
    "next": "`FM-REQ-01`",
    "test": "`TC-COLLAB-001`"
  },
  {
    "id": "FM-REQ-04A",
    "name": "拒绝确认",
    "role": "家属",
    "entry": "点击拒绝",
    "operations": "确认不能陪；返回",
    "next": "`FM-REQ-04B` 或详情",
    "test": "`TC-COLLAB-002`"
  },
  {
    "id": "FM-REQ-04B",
    "name": "拒绝结果",
    "role": "家属",
    "entry": "确认拒绝",
    "operations": "返回列表",
    "next": "`FM-REQ-01`",
    "test": "`TC-COLLAB-002`"
  },
  {
    "id": "FM-REQ-05A",
    "name": "建议改期",
    "role": "家属",
    "entry": "点击建议改期",
    "operations": "提交建议；返回",
    "next": "`FM-REQ-05B` 或详情",
    "test": "`TC-COLLAB-003`"
  },
  {
    "id": "FM-REQ-05B",
    "name": "建议已发送",
    "role": "家属",
    "entry": "提交建议",
    "operations": "返回列表",
    "next": "`FM-REQ-01`",
    "test": "`TC-COLLAB-003`"
  },
  {
    "id": "FM-EX-01",
    "name": "请求已撤回",
    "role": "家属",
    "entry": "老人撤回",
    "operations": "返回列表",
    "next": "`FM-REQ-00`",
    "test": "`TC-CANCEL-001`"
  },
  {
    "id": "FM-EX-02",
    "name": "事务已取消",
    "role": "家属",
    "entry": "老人取消整个事务",
    "operations": "返回列表",
    "next": "`FM-REQ-00`",
    "test": "`TC-CANCEL-002`"
  },
  {
    "id": "FM-EX-03",
    "name": "旧请求已失效",
    "role": "家属",
    "entry": "事务版本变化或关系结束",
    "operations": "刷新请求列表",
    "next": "`FM-REQ-00/01`",
    "test": "`TC-VERSION-002`"
  },
  {
    "id": "DM-01",
    "name": "角色切换条",
    "role": "演示控制",
    "entry": "任意业务页面",
    "operations": "切换角色",
    "next": "对应角色同一业务状态",
    "test": "`TC-DEMO-001`"
  },
  {
    "id": "DM-02",
    "name": "场景预设面板",
    "role": "演示控制",
    "entry": "展开演示工具",
    "operations": "加载场景",
    "next": "场景起始页面",
    "test": "`TC-DEMO-002`"
  },
  {
    "id": "DM-03",
    "name": "固定演示时间",
    "role": "演示控制",
    "entry": "展开演示工具",
    "operations": "推进时间；恢复时间",
    "next": "相关提醒/未回应页面",
    "test": "`TC-DEMO-003`"
  },
  {
    "id": "DM-04A",
    "name": "Reset 确认",
    "role": "演示控制",
    "entry": "点击重置",
    "operations": "确认重置；返回",
    "next": "`DM-04B` 或原页",
    "test": "`TC-DEMO-004`"
  },
  {
    "id": "DM-04B",
    "name": "Reset 结果",
    "role": "演示控制",
    "entry": "确认重置",
    "operations": "开始演示",
    "next": "`EL-REL-01`",
    "test": "`TC-DEMO-004`"
  }
];
