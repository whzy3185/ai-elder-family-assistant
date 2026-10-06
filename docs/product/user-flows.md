# 正式用户流程

版本：`USER_FLOW_VERSION=1.0.0`

固定时钟：2026-10-06 20:00（Asia/Shanghai）

## A. 主流程

### A1. 建立关系并完成接受闭环

```text
EL-REL-01 首次介绍
→ FM-REL-01 小梅模拟扫码并申请
→ EL-REL-02 张阿姨查看身份、权限和可见范围
→ EL-REL-02A 张阿姨确认同意
→ EL-REL-06 张阿姨同意，关系 ACTIVE
→ EL-TASK-01 输入固定语音
→ EL-TASK-02 AI 处理中
→ EL-TASK-03B 看到错误时间 8:00、提醒 7:30
→ EL-TASK-04 修改为 9:00
→ EL-TASK-05 确认提醒同步为 8:30
→ EL-TASK-06 保存个人事务和提醒
→ EL-SHARE-01 选择请小梅陪同
→ EL-SHARE-02 查看五个共享字段并确认
→ EL-SHARE-03 发送中
→ EL-SHARE-04A 发送成功
→ EL-SHARE-04B 请求 PENDING，等待回应
→ DM-01 切换家属
→ FM-REQ-01 请求列表
→ FM-REQ-02 请求详情
→ FM-REQ-03A/B 小梅接受
→ DM-01 切换老人
→ EL-SHARE-05 张阿姨看到小梅答应
→ EL-TASK-07 08:30 提醒触发
→ EL-TASK-09A/B 张阿姨在现实办完后确认完成
```

### A2. 主流程步骤与断言

| 步骤 | 页面 | 关键断言 |
|---:|---|---|
| 1 | `EL-REL-01—06` | 关系必须由双方动作建立，不自动开放事务 |
| 2 | `EL-TASK-01—03B` | AI 错误可见，未确认不保存 |
| 3 | `EL-TASK-04—05` | 9:00 与 8:30 同步，其他字段不变 |
| 4 | `EL-TASK-06` | 个人事务先保存，协作仍 `NOT_SHARED` |
| 5 | `EL-SHARE-01—04B` | 发送前有单独共享确认，发送成功后才 `PENDING` |
| 6 | `FM-REQ-01—03B` | 小梅只看五个字段，接受不修改事务 |
| 7 | `EL-SHARE-05` | 老人看到接受，但事务仍 `SAVED` |
| 8 | `EL-TASK-07` | 提醒按固定时钟触发，不依赖现实日期 |
| 9 | `EL-TASK-09A/B` | 只有老人确认后事务才 `COMPLETED` |

## B. 修改 / 撤回 / 取消

### B1. 修改已经共享的事务

```text
EL-TASK-06 事务 v1，request v1 PENDING 或 ACCEPTED
→ EL-TASK-08 点击修改
→ EL-EX-07A 修改时间/地点/帮助并确认影响
→ taskVersion 变为 v2
→ request v1 INVALIDATED
→ FM-EX-03 小梅旧页面不可回应
→ EL-EX-07B 张阿姨决定是否重新分享
→ EL-SHARE-02 重新查看 v2 共享字段
→ 新 requestId + taskVersion v2
→ EL-SHARE-04A/B 新请求 PENDING
```

断言：旧 `ACCEPTED`、`DECLINED` 或 `CHANGE_PROPOSED` 均不继承；旧答复不能覆盖 v2。

### B2. 只撤回陪同请求

```text
EL-SHARE-04B / EL-EX-04
→ EL-EX-05A 撤回确认
→ EL-EX-05B 请求 WITHDRAWN
→ FM-EX-01 家属按钮禁用
→ 事务仍 SAVED
→ 08:30 提醒仍 SCHEDULED
```

断言：撤回请求不取消事务，不删除提醒。

### B3. 取消整个事务

```text
EL-TASK-06
→ EL-EX-06A 取消事务确认
→ EL-EX-06B 事务 CANCELLED
→ 提醒 CANCELLED
→ 活跃请求 INVALIDATED
→ FM-EX-02 家属不可继续回应
→ EL-TASK-10 显示取消结果
```

断言：取消事务与撤回请求有不同确认文案和不同后果。

## C. 失败 / 未回应 / 拒绝

### C1. 必要信息缺失

```text
EL-TASK-01 输入缺少时间或地点
→ EL-TASK-02 处理中
→ EL-EX-01 标出缺失字段
→ EL-EX-02B 手动补填
→ EL-TASK-05 确认
```

断言：AI 不猜测，不丢失已有字段。

### C2. AI 解析失败

```text
EL-TASK-01 输入
→ EL-TASK-02 处理中
→ EL-EX-02A 解析失败
→ 重试回 EL-TASK-02
或 → EL-EX-02B 手动填写
→ EL-TASK-05 确认
```

断言：失败不显示成功，手动路径可以完成事务。

### C3. 请求发送失败

```text
EL-SHARE-02 确认发送
→ EL-SHARE-03 SENDING
→ EL-EX-03 SEND_FAILED
→ 家属端 FM-REQ-00 仍为空
→ 老人重试
→ EL-SHARE-03
→ EL-SHARE-04A/B PENDING
```

断言：失败时家属端不存在假请求。

### C4. 家属未回应

```text
EL-SHARE-04B PENDING
→ DM-03 推进到回应超时
→ EL-EX-04 PENDING + overdue
→ 继续等待（保持 PENDING）
或 → EL-EX-05A/B 撤回
或 → 选择自行安排并撤回
```

断言：未回应不是拒绝或同意；个人提醒继续存在。

### C5. 家属拒绝

```text
FM-REQ-02
→ FM-REQ-04A/B 小梅拒绝
→ EL-SHARE-06 张阿姨看到不能陪同
→ 事务 SAVED、提醒 SCHEDULED
→ 张阿姨自行安排或取消事务
```

断言：拒绝请求不取消事务。

### C6. 家属建议改期

```text
FM-REQ-02
→ FM-REQ-05A/B 建议 14:00
→ EL-SHARE-07 张阿姨查看建议
├─ 接受 → EL-SHARE-08 → 事务 v2 → 旧请求 INVALIDATED → 重新分享
└─ 拒绝 → EL-SHARE-09 → 事务仍 9:00 → 请求回 PENDING
```

断言：建议改期不自动改变事务，必须由老人确认。

## D. Demo 可复现入口

| 场景 ID | 起始页面 | 固定状态 | 用途 |
|---|---|---|---|
| `main` | `EL-REL-01` | 无关系、无事务、20:00 | 完整主流程 |
| `recognition-error` | `EL-TASK-03B` | 8:00 / 7:30 | 单字段纠错 |
| `missing-info` | `EL-EX-01` | 缺时间 | 必要信息缺失 |
| `parse-failed` | `EL-EX-02A` | 原输入保留 | AI 失败与手动恢复 |
| `send-failed` | `EL-EX-03` | 事务已保存、请求未建立 | 发送失败和重试 |
| `no-response` | `EL-EX-04` | `PENDING + overdue` | 未回应处理 |
| `declined` | `EL-SHARE-06` | `DECLINED` | 家属拒绝 |
| `change-proposed` | `EL-SHARE-07` | 建议 14:00 | 改期确认 |
| `withdrawn` | `EL-EX-05B` | `WITHDRAWN` | 撤回不取消提醒 |
| `task-cancelled` | `EL-EX-06B` | `CANCELLED/INVALIDATED` | 取消整个事务 |
| `stale-request` | `FM-EX-03` | task v2 / request v1 | 旧答复失效 |
| `reminder` | `EL-TASK-07` | 2026-10-07 08:30 | 提醒触发 |
| `completed` | `EL-TASK-09B` | `COMPLETED` | 老人确认完成 |

所有场景由 `DM-02` 加载，`DM-04` 恢复到 `main` 初始状态。
