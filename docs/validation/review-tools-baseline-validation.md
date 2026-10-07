# 阶段 10 Demo Controller 验证

验证日期：2026-10-07（Asia/Shanghai）  
版本：`web-prototype-0.10.0`

## 1. Gate 结论

`VALIDATION_10_STATUS=PASS`

独立 Demo Controller 已完成，13 个规定场景、老人/家属角色快捷入口、固定演示时钟和全量重置均已实际点击验证。

控制台首屏明确显示：

> 演示控制，不属于老人真实产品功能

## 2. 快速复现场景

| ID | 页面结果 | 核心状态 |
|---|---|---|
| `INITIAL` | 老人初始首页 | 未建立关系、无事务、无请求 |
| `MAIN_FLOW` | 已保存事务 | 09:00 事务、08:30 提醒、尚未共享 |
| `RECOGNITION_ERROR` | 错误确认页 | 08:00 / 07:30，等待纠错 |
| `MISSING_INFORMATION` | 必填缺失页 | 时间和地点为空，不猜测 |
| `AI_FAILURE` | 解析失败页 | 原输入保留，可手动继续 |
| `SEND_FAILURE` | 发送失败页 | 个人事务存在、家属请求不存在 |
| `PENDING_FAMILY` | 家属请求详情 | 当前请求 `PENDING` |
| `ACCEPTED` | 老人接受结果 | 请求 `ACCEPTED`，事务仍 `CONFIRMED` |
| `DECLINED` | 老人拒绝结果 | 请求 `DECLINED`，事务继续 |
| `CHANGE_PROPOSED` | 老人改期审阅 | 建议 14:00，原事务仍 09:00 |
| `WITHDRAWN` | 老人撤回结果 | 请求 `WITHDRAWN`，提醒保留 |
| `CANCELLED` | 事务取消结果 | 任务 `CANCELLED`，提醒为空，请求失效 |
| `REMINDER_TRIGGER` | 08:30 提醒页 | 固定时钟推进到提醒时刻 |

## 3. 完整快照规则

- 每个入口调用 `createDemoSnapshot(scenario)` 创建全新顶层状态。
- 不把场景状态合并进当前 Store；关系、任务、请求、请求历史、角色、页面、时钟和场景 ID 一次性替换。
- 自动测试先构造含脏数据、错误时钟和伪请求历史的状态，再逐一加载 13 个场景并与规范快照做深度相等比较。
- `Reset All Demo Data` 恢复 `createInitialState()`。

## 4. 验证证据

- 单元与状态测试：`npm test`，21/21 PASS。
- 浏览器走查：`scripts/smoke-review-tools-baseline.mjs`，13 场景 + 2 角色 + Reset PASS。
- 控制台截图：`artifacts/qa/review-tools-baseline.png`。
- 主流程不依赖 Demo Controller；`scripts/smoke-main-flow-baseline.mjs` 仍可从 Reset 后连续完成 23 步。

