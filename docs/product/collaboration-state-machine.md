# 家庭协作状态机

版本：`COLLABORATION_STATE_MACHINE_VERSION=1.0.0`

冻结日期：2026-10-06（Asia/Shanghai）

## 1. 作用域

协作状态机只描述“一次向小梅提出陪同请求”的状态，不描述公交卡年审事务是否保存、取消或完成。每个请求绑定一个不可变的 `taskVersion`。

## 2. 状态定义

| 状态 | 含义 | 家属是否可见 | 是否可回应 |
|---|---|---:|---:|
| `NOT_SHARED` | 老人尚未共享或明确只提醒自己 | 否 | 否 |
| `SENDING` | 老人已确认，正在模拟发送 | 否 | 否 |
| `PENDING` | 请求发送成功，等待小梅明确回应 | 是 | 是 |
| `ACCEPTED` | 小梅明确答应陪同当前版本事务 | 是 | 否 |
| `DECLINED` | 小梅明确不能陪同 | 是 | 否 |
| `CHANGE_PROPOSED` | 小梅提出新的时间，尚待张阿姨决定 | 是 | 否；等待老人 |
| `WITHDRAWN` | 张阿姨撤回陪同请求，但保留自己的事务 | 是，显示已撤回 | 否 |
| `SEND_FAILED` | 请求未建立，小梅端不存在该请求 | 否 | 否 |
| `INVALIDATED` | 事务取消、版本变化或关系失效使旧请求作废 | 是，若此前已送达 | 否 |

家属未回应不是独立终态，而是 `PENDING` 加派生标记 `isResponseOverdue=true`。这样仍可继续等待，也可由老人撤回。

## 3. 完整状态转换表

| 当前状态 | 用户动作/系统事件 | 前置条件 | 新状态 | 老人看到什么 | 家属看到什么 | 后续动作 |
|---|---|---|---|---|---|---|
| `NOT_SHARED` | 选择只提醒自己 | 事务为 `SAVED` | `NOT_SHARED` | “只提醒你，没有告诉小梅” | 无请求、空列表 | 返回事务详情 |
| `NOT_SHARED` | 打开共享预览 | 关系为 `ACTIVE`，事务为 `SAVED` | `NOT_SHARED` | 接收者和五个共享字段；尚未发送 | 无请求 | 确认或返回 |
| `NOT_SHARED` | 确认“发给小梅” | 关系有效、必要共享字段齐全 | `SENDING` | “正在发给小梅”，不得显示已收到 | 无请求 | 等待发送结果 |
| `SENDING` | 发送成功 | mock adapter 返回成功 | `PENDING` | “已发给小梅，正在等她回复” | 请求出现在列表 | 小梅查看并回应 |
| `SENDING` | 发送失败 | mock adapter 返回失败 | `SEND_FAILED` | “没有发出去”；保留事务，提供重试 | 无请求、无假消息 | 重试或取消发送 |
| `SEND_FAILED` | 用户重试 | 关系仍有效，事务版本未变化 | `SENDING` | 再次显示发送中 | 无请求 | 等待结果 |
| `SEND_FAILED` | 选择暂不发送 | 老人主动选择 | `NOT_SHARED` | “没有告诉小梅；个人提醒仍有效” | 无请求 | 返回事务详情 |
| `PENDING` | 小梅打开详情 | 请求版本仍有效 | `PENDING` | 可显示“已查看”，但不能显示答应 | 当前请求详情与三个回应动作 | 小梅回应 |
| `PENDING` | 小梅接受 | 请求版本等于当前事务版本 | `ACCEPTED` | “小梅答应陪你去”；事务仍未完成 | “已告诉妈妈你可以陪同” | 老人按现实情况办理并最终确认完成 |
| `PENDING` | 小梅拒绝 | 请求版本有效 | `DECLINED` | “小梅这次不能陪同”；事务和提醒仍存在 | “已告诉妈妈你不能陪同” | 老人自行安排或取消事务 |
| `PENDING` | 小梅建议改期 | 新时间合法、请求版本有效 | `CHANGE_PROPOSED` | 建议时间与“接受/还是原时间” | “等待妈妈决定” | 老人接受或拒绝建议 |
| `PENDING` | 超过演示回应期限 | 请求仍有效且无回应 | `PENDING` + `isResponseOverdue=true` | “小梅还没有回复”；继续等、撤回或自行安排 | 请求仍待回应，不显示拒绝 | 老人选择下一步 |
| `PENDING` | 老人继续等待 | `isResponseOverdue=true` | `PENDING` | 保持未回应状态和个人提醒 | 请求仍可回应 | 等待 |
| `PENDING` | 老人撤回请求 | 请求未终结 | `WITHDRAWN` | “已撤回陪同请求；8:30 仍会提醒你” | “妈妈撤回了请求”，按钮禁用 | 返回事务详情 |
| `PENDING` | 老人选择自行安排 | 老人明确不再等待 | `WITHDRAWN` | “已撤回请求；这件事仍由你安排” | 请求已撤回 | 返回事务详情 |
| `PENDING` | 老人取消整个事务 | 事务转为 `CANCELLED` | `INVALIDATED` | “事务、提醒和请求都已取消” | “妈妈取消了这件事”，不可回应 | 只读 |
| `PENDING` | 老人修改共享字段 | 老人确认新版本 | `INVALIDATED` | “旧请求已作废”；询问是否向小梅发送新请求 | “妈妈更新了事情，此请求已失效” | 若需要，创建新请求 |
| `ACCEPTED` | 老人完成现实事务 | 事务转为 `COMPLETED` | `ACCEPTED` | “事情已完成”；保留小梅曾答应的结果 | 只读接受结果 | 无新动作 |
| `ACCEPTED` | 老人取消事务 | 老人明确取消 | `INVALIDATED` | “事务和原陪同安排已取消” | “妈妈取消了这件事”，旧接受不再有效 | 只读 |
| `ACCEPTED` | 老人修改共享字段 | 老人确认新版本 | `INVALIDATED` | 明确小梅原来的答应不能继承 | “妈妈更新了事情，原答复已失效” | 如仍需要，新请求从 `PENDING` 开始 |
| `DECLINED` | 老人继续自己的事务 | 事务仍为 `SAVED` | `DECLINED` | 个人提醒继续，可自行安排 | 已拒绝，只读 | 老人完成或取消事务 |
| `DECLINED` | 老人修改共享字段并重新请求 | 新版本已确认 | `INVALIDATED` | 旧拒绝已失效，需重新发送 | 旧请求显示已更新 | 新请求从 `PENDING` 开始 |
| `CHANGE_PROPOSED` | 老人接受建议 | 老人明确确认新时间 | `INVALIDATED`；事务 `taskVersion+1` | 事务更新；旧请求作废；询问是否按新时间重新请求 | 旧建议显示已由妈妈处理，原请求失效 | 新请求从 `PENDING` 开始，不继承接受 |
| `CHANGE_PROPOSED` | 老人拒绝建议，坚持 9:00 | 老人明确确认 | `PENDING` | “仍按 9:00；等待小梅对原时间回应” | “妈妈仍计划 9:00”，可接受或拒绝 | 小梅重新回应 |
| `CHANGE_PROPOSED` | 老人撤回请求 | 老人明确确认 | `WITHDRAWN` | 提醒仍在，请求已撤回 | 请求已撤回 | 返回事务详情 |
| `WITHDRAWN` | 小梅尝试回应旧页面 | 终态 | `WITHDRAWN` | 无新变化 | “请求已撤回，不能继续处理” | 返回列表 |
| `INVALIDATED` | 小梅尝试提交旧答复 | 版本或事务校验失败 | `INVALIDATED` | 无新变化 | “请求已更新或取消，不能继续处理” | 刷新列表 |

## 4. 发送后修改统一规则

```text
老人修改已经共享的时间、地点或请求内容
→ 老人确认修改
→ 旧协作请求 INVALIDATED
→ 新版本事务生效，taskVersion + 1
→ 如老人仍希望家属参与，再次查看共享内容并确认
→ 创建新 requestId，绑定新 taskVersion
→ 新请求 PENDING
→ 旧 ACCEPTED / DECLINED / CHANGE_PROPOSED 均不继承
```

修改个人提醒提前量属于未共享字段，不必使请求失效；修改事务发生时间、地点、事项或所需帮助必须使请求失效。

## 5. 不变量

1. `SAVED` 不等于 `PENDING`；
2. `PENDING` 不等于 `ACCEPTED`；
3. `ACCEPTED` 不等于事务 `COMPLETED`；
4. `PENDING + overdue` 不等于 `ACCEPTED` 或 `DECLINED`；
5. `DECLINED` 不会取消事务或个人提醒；
6. `WITHDRAWN` 不会取消事务或个人提醒；
7. `CHANGE_PROPOSED` 不会直接修改事务；
8. `SEND_FAILED` 时家属端不得出现请求；
9. `INVALIDATED` 和 `WITHDRAWN` 不接受新回应；
10. 新请求必须拥有新的 `requestId` 并绑定当前 `taskVersion`。

## 6. 阶段 03 状态一致性纸面审查

| 审查场景 | 执行步骤 | 预期结果 | 状态 |
|---|---|---|---|
| 老人取消后家属不能接受 | `TASK-SAVED` + `REQUEST-PENDING` → 老人取消事务 → 小梅从旧页点击接受 | 事务 `CANCELLED`；请求 `INVALIDATED`；接受被拒绝 | PASS |
| 撤回后个人提醒仍存在 | `TASK-SAVED` + `REQUEST-PENDING` → 老人撤回 | 请求 `WITHDRAWN`；事务仍 `SAVED`；提醒仍 `SCHEDULED` | PASS |
| 家属答应后老人正确看到 | `PENDING` → 小梅接受 | 请求 `ACCEPTED`；老人看到答应陪同；事务仍 `SAVED` | PASS |
| 修改后旧答复不覆盖新事务 | v1 请求 `ACCEPTED` → 老人改时间并确认 → 小梅提交旧答复 | v1 请求 `INVALIDATED`；事务 v2；旧答复被拒绝 | PASS |
| 请求失败家属端不存在假请求 | `SENDING` → 发送失败 | 请求 `SEND_FAILED`；小梅列表为空 | PASS |
| 拒绝共享家属端不可见 | `NOT_SHARED` → 老人选择只提醒自己 | 请求保持 `NOT_SHARED`；小梅无请求 | PASS |
| 建议改期必须老人确认 | `PENDING` → 小梅建议 14:00 | 请求 `CHANGE_PROPOSED`；事务仍 9:00，直到老人接受 | PASS |

纸面审查通过只证明规则无直接矛盾；运行态验证仍须在 阶段 12—13 完成。
