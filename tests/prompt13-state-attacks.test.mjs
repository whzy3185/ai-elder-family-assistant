import test from 'node:test';
import assert from 'node:assert/strict';
import { reduce, validateState, STORAGE_KEY } from '../src/state/model.js';
import { createStore } from '../src/state/store.js';
import { createInitialState, createDemoSnapshot, DEMO_SCENARIOS, FIXED_INPUT } from '../src/state/initial-state.js';
import { renderReleaseApp } from '../src/release-views.js';
const dispatch = (s, ...actions) => actions.reduce((v,a)=>validateState(reduce(v,a)),s);
const elder = s => dispatch(s,{type:'SET_ROLE',role:'ELDER'});
const family = s => dispatch(s,{type:'SET_ROLE',role:'FAMILY'});
const pending = () => elder(createDemoSnapshot('PENDING_FAMILY'));
const modify = s => dispatch(s,{type:'START_POST_ACCEPT_EDIT'},{type:'CONFIRM_POST_ACCEPT_CHANGE'});
const send = s => dispatch(s,{type:'START_SHARE'},{type:'BEGIN_SEND'},{type:'SEND_REQUEST'});
const save = s => dispatch(s,{type:'START_TASK',rawInput:FIXED_INPUT},{type:'PARSE_TASK_SUCCESS'},{type:'UPDATE_TASK_TIME',time:'09:00'},{type:'CONFIRM_TASK'});

test('A01 changing time invalidates old visible request, new request has final time',()=>{
  const changed=modify(pending());
  assert.equal(changed.collaborationRequest.status,'INVALIDATED');
  assert.match(renderReleaseApp(family(changed)),/已结束/);
  assert.equal(send(changed).collaborationRequest.sharedFields.time,'14:00');
});
test('A02 cancelled task cannot be accepted from a stale family page',()=>{
  const cancelled=dispatch(pending(),{type:'CANCEL_TASK'});
  const attempt=dispatch(family(cancelled),{type:'ACCEPT_REQUEST',requestId:'request-1-1'});
  assert.equal(attempt.collaborationRequest.status,'INVALIDATED');
  assert.equal(attempt.task.reminderAt,null);
});
test('A03 accepted request is shown as accepted to elder and never completes task',()=>{
  const accepted=dispatch(family(pending()),{type:'ACCEPT_REQUEST',requestId:'request-1-1'});
  const detail=dispatch(elder(accepted),{type:'NAVIGATE',view:'TASK_SAVED'});
  assert.match(renderReleaseApp(detail),/小梅答应陪同/);
  assert.equal(detail.task.status,'CONFIRMED');
});
test('A04 withdrawing preserves personal task and reminder',()=>{
  const before=pending(),after=dispatch(before,{type:'WITHDRAW_REQUEST'});
  assert.deepEqual(after.task,before.task);
  assert.equal(after.collaborationRequest.status,'WITHDRAWN');
});
test('A05 choosing private never exposes details to family',()=>{
  const s=dispatch(createDemoSnapshot('MAIN_FLOW'),{type:'KEEP_PRIVATE'});
  const html=renderReleaseApp(family(s));
  assert.equal(s.collaborationRequest.sharedFields,null);
  assert.doesNotMatch(html,/公交卡年审|上午 9:00|上午 8:30/);
});
test('A06 failed send creates no family request',()=>{
  const s=dispatch(createDemoSnapshot('MAIN_FLOW'),{type:'START_SHARE'},{type:'SIMULATE_SEND_FAILURE'});
  assert.equal(s.collaborationRequest.status,'NONE');
  assert.doesNotMatch(renderReleaseApp(family(s)),/公交卡年审/);
});
test('A07 repeated sends keep a single request and never overwrite a response',()=>{
  const first=send(createDemoSnapshot('MAIN_FLOW'));
  const repeated=dispatch(first,{type:'BEGIN_SEND'},{type:'SEND_REQUEST'},{type:'SEND_REQUEST'});
  assert.deepEqual(repeated.collaborationRequest,first.collaborationRequest);
  const accepted=dispatch(family(first),{type:'ACCEPT_REQUEST'});
  assert.deepEqual(dispatch(elder(accepted),{type:'SEND_REQUEST'}).collaborationRequest,accepted.collaborationRequest);
});
test('A08 repeated acceptance cannot change the accepted request',()=>{
  const first=dispatch(family(pending()),{type:'ACCEPT_REQUEST'});
  assert.deepEqual(dispatch(first,{type:'ACCEPT_REQUEST'},{type:'DECLINE_REQUEST'}).collaborationRequest,first.collaborationRequest);
});
test('A09 old request id cannot answer a new task version',()=>{
  const first=pending(),fresh=family(send(modify(first)));
  const attempt=dispatch(fresh,{type:'ACCEPT_REQUEST',requestId:first.collaborationRequest.id});
  assert.equal(attempt.collaborationRequest.status,'PENDING');
  assert.equal(attempt.collaborationRequest.response,null);
  assert.notEqual(fresh.collaborationRequest.id,first.collaborationRequest.id);
});
test('A10 family proposal leaves elder task untouched until elder confirms',()=>{
  const before=family(pending()),proposed=dispatch(before,{type:'PROPOSE_CHANGE'});
  assert.deepEqual(proposed.task,before.task);
  const accepted=dispatch(elder(proposed),{type:'ACCEPT_PROPOSED_CHANGE'});
  assert.equal(accepted.task.details.time,'14:00');
  assert.equal(accepted.collaborationRequest.status,'INVALIDATED');
});
test('A11 AI failure preserves original expression',()=>{
  const s=dispatch(createInitialState(),{type:'START_TASK',rawInput:FIXED_INPUT},{type:'PARSE_TASK_FAILURE'});
  assert.equal(s.task.rawInput,FIXED_INPUT);
  assert.match(renderReleaseApp(s),/你的原话/);
});
test('A12 back and re-entry preserve typed and cleared drafts',()=>{
  let s=dispatch(createInitialState(),{type:'ENTER_TASK_INPUT'},{type:'UPDATE_RAW_INPUT',value:'自填草稿'},{type:'SET_ROLE',role:'ELDER'},{type:'ENTER_TASK_INPUT'});
  assert.equal(s.task.rawInput,'自填草稿');
  assert.match(renderReleaseApp(s),/自填草稿/);
  s=dispatch(s,{type:'UPDATE_RAW_INPUT',value:''},{type:'SET_ROLE',role:'ELDER'},{type:'ENTER_TASK_INPUT'});
  assert.match(renderReleaseApp(s),/<textarea id="task-input"><\/textarea>/);
});
test('A13 active relationship alone does not share a saved task',()=>{
  const s=createDemoSnapshot('MAIN_FLOW');
  assert.equal(s.relationship.status,'ACTIVE');
  assert.equal(s.collaborationRequest.status,'NONE');
  assert.doesNotMatch(renderReleaseApp(family(s)),/公交卡年审/);
});
test('A14 declining relationship still permits personal task',()=>{
  const initial=createInitialState(); initial.relationship.status='PENDING_ELDER';
  const s=save(dispatch(initial,{type:'DECLINE_RELATIONSHIP'}));
  assert.equal(s.task.status,'CONFIRMED');
  assert.equal(s.collaborationRequest.status,'NONE');
});
test('A15 family cannot edit, cancel, parse or save an elder task',()=>{
  const before=family(pending());
  for(const type of ['START_POST_ACCEPT_EDIT','CONFIRM_POST_ACCEPT_CHANGE','UPDATE_TASK_TIME','MANUAL_FILL_TASK','CANCEL_TASK','PARSE_TASK_MISSING','PARSE_TASK_FAILURE','UPDATE_RAW_INPUT','CONFIRM_TASK']) {
    const after=dispatch(before,{type,time:'14:00',rawInput:'overwrite',value:'overwrite'});
    assert.deepEqual(after.task,before.task,type);
  }
});
test('A16 family cannot mark a task completed',()=>{
  const s=family(createDemoSnapshot('ACCEPTED'));
  assert.deepEqual(dispatch(s,{type:'COMPLETE_TASK'}).task,s.task);
});
test('A17 refresh preserves saved state and recovers interrupted sends',()=>{
  const memory=new Map();
  globalThis.localStorage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
  memory.set(STORAGE_KEY,JSON.stringify(createDemoSnapshot('ACCEPTED')));
  assert.deepEqual(createStore().getState(),createDemoSnapshot('ACCEPTED'));
  const sending=dispatch(createDemoSnapshot('MAIN_FLOW'),{type:'START_SHARE'},{type:'BEGIN_SEND'});
  memory.set(STORAGE_KEY,JSON.stringify(sending));
  const restored=createStore().getState();
  assert.equal(restored.currentView,'REQUEST_SEND_FAILED');
  assert.equal(restored.collaborationRequest.status,'NONE');
  assert.equal(restored.task.reminderAt,sending.task.reminderAt);
  assert.equal(JSON.parse(memory.get(STORAGE_KEY)).collaborationRequest.status,'NONE');
});
test('A18 each demo scenario replaces all prior state, including draft and settings',()=>{
  const dirty={...pending(),manualDraft:{title:'dirty'},settings:{largeText:true},formError:'old',requestHistory:[{status:'ACCEPTED'}]};
  for(const [scenario] of DEMO_SCENARIOS) assert.deepEqual(dispatch(dirty,{type:'LOAD_DEMO_SCENARIO',scenario}),createDemoSnapshot(scenario));
});
test('Additional: stale parser completion cannot overwrite a newer draft',()=>{
  let s=dispatch(createInitialState(),{type:'START_TASK',rawInput:FIXED_INPUT,parseToken:'first'});
  s=dispatch(s,{type:'ENTER_TASK_INPUT'},{type:'START_TASK',rawInput:'新版文字',parseToken:'second'});
  const stale=dispatch(s,{type:'PARSE_TASK_SUCCESS',parseToken:'first'});
  assert.deepEqual(stale,s);
});
test('Additional: new task after completion has a new version and request identity',()=>{
  const first=pending();
  const next=send(save(dispatch(first,{type:'COMPLETE_TASK'},{type:'ENTER_TASK_INPUT'})));
  assert.notEqual(next.collaborationRequest.id,first.collaborationRequest.id);
});
test('Additional: unknown input fails safely; invalid manual fields cannot save',()=>{
  const empty=dispatch(createInitialState(),{type:'START_TASK',rawInput:''},{type:'PARSE_TASK_SUCCESS'});
  assert.equal(empty.task.details.title,null);
  assert.match(renderReleaseApp(empty),/输入为空/);
  assert.doesNotMatch(renderReleaseApp(empty),/已经听清/);
  const failed=dispatch(createInitialState(),{type:'START_TASK',rawInput:'别的事情'},{type:'PARSE_TASK_SUCCESS'});
  assert.equal(failed.task.status,'PARSE_FAILED');
  const blank=dispatch(failed,{type:'SHOW_MANUAL_FORM'},{type:'UPDATE_MANUAL_FIELD',field:'title',value:''},{type:'MANUAL_FILL_TASK'});
  assert.equal(blank.currentView,'TASK_MANUAL_FORM');
  assert.match(blank.formError,/请填写/);
});
test('Additional: user input is escaped in confirmation, even after manual editing',()=>{
  const s=dispatch(createDemoSnapshot('AI_FAILURE'),{type:'SHOW_MANUAL_FORM'},{type:'UPDATE_MANUAL_FIELD',field:'title',value:'<img src=x onerror=alert(1)>'},{type:'UPDATE_MANUAL_FIELD',field:'time',value:'09:00'},{type:'UPDATE_MANUAL_FIELD',field:'location',value:'<script>bad</script>'},{type:'MANUAL_FILL_TASK'});
  const html=renderReleaseApp(s);
  assert.doesNotMatch(html,/<img src=x|<script>bad/);
  assert.match(html,/&lt;img/);
});

test('Reviewer: a 14:00 request cannot propose or save the same time again',()=>{
  const current=send(modify(pending()));
  const familyState=dispatch(family(current),{type:'NAVIGATE',view:'FAMILY_REQUEST'});
  assert.doesNotMatch(renderReleaseApp(familyState),/data-action="ask-propose-change"/);
  const proposed=dispatch(familyState,{type:'PROPOSE_CHANGE'});
  assert.deepEqual(proposed.collaborationRequest,current.collaborationRequest);
  const edited=dispatch(elder(current),{type:'START_POST_ACCEPT_EDIT'},{type:'CONFIRM_POST_ACCEPT_CHANGE'});
  assert.equal(edited.task.version,current.task.version);
  assert.deepEqual(edited.collaborationRequest,current.collaborationRequest);
});

test('Reviewer: a persisted same-time suggestion retains 14:00 and current reminder',()=>{
  const current=send(modify(pending()));
  const legacy={...elder(current),currentView:'ELDER_CHANGE_PROPOSED',collaborationRequest:{...current.collaborationRequest,status:'CHANGE_PROPOSED',response:{type:'CHANGE_PROPOSED',proposedTime:'14:00'}}};
  assert.match(renderReleaseApp(legacy),/不改，仍是下午 2:00/);
  assert.doesNotMatch(renderReleaseApp(legacy),/不改，仍是上午 9:00|data-action="accept-proposed-change"/);
  const kept=dispatch(legacy,{type:'ACCEPT_PROPOSED_CHANGE'});
  assert.equal(kept.task.version,current.task.version);
  assert.equal(kept.task.reminderAt,current.task.reminderAt);
  assert.equal(kept.collaborationRequest.status,'PENDING');
  assert.match(renderReleaseApp(kept),/保留下午 2:00/);
});
