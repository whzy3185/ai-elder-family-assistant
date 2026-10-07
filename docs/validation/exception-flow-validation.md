# 阶段 09 异常与修改分支验证

验证日期：2026-10-07（Asia/Shanghai）  
版本：`web-prototype-0.9.0`

## 1. Gate 结论

`VALIDATION_09_STATUS=PASS`

11 个场景均从合理前置状态进入，通过页面按钮连续完成；状态模型测试 16/16 通过，浏览器走查 11/11 通过。

## 2. 场景结果

| 场景 | 实际结果 | 关键不变量 | 证据 |
|---|---|---|---|
| A 拒绝关系 | 拒绝后继续保存个人事务和 08:30 提醒 | 关系保持 `DECLINED`，不阻断个人提醒 | `A-relationship-declined-private-reminder.png` |
| B 只提醒自己 | 家属端显示无请求 | `collaborationRequest.status=NONE` | `B-private-only-family-empty.png` |
| C 信息缺失 | 明示缺少时间和地点，补齐后继续保存 | 未补齐前不猜测、不确认 | `C-missing-fields-recovered.png` |
| D 解析失败 | 原输入保留，手动填写后继续 | `rawInput` 前后逐字一致 | `D-parse-failure-manual-recovered.png` |
| E 发送失败 | 个人提醒保留；失败时家属无请求；重试只生成一条 | 首次失败 `NONE`，重试后单一 `PENDING` | `E-send-retry-single-request.png` |
| F 未回应 | 显示“还没有回复”，可继续等待或撤回 | 未回应不转成拒绝 | `F-I-no-response-withdrawn.png` |
| G 家属拒绝 | 老人看到“这次不能陪同” | 事务仍为 `CONFIRMED`，提醒仍在 | `G-family-declined-task-kept.png` |
| H 家属建议改期 | 拒绝建议保留 09:00；接受后才改为 14:00 | 家属只提案，老人最终决定 | `H1-*`、`H2-*` |
| I 撤回请求 | 二次确认后请求变 `WITHDRAWN` | 个人提醒保留；家属不能再回应 | `F-I-no-response-withdrawn.png` |
| J 取消事务 | 二次确认后任务取消、提醒清空、请求失效 | 家属不能回应 `INVALIDATED` 请求 | `J-task-cancelled-request-invalidated.png` |
| K 已接受后修改 | 老人确认从 09:00 改为 14:00 | 旧接受归档为 `INVALIDATED`；新版本为 `PENDING` 且无继承答复 | `K-old-acceptance-invalidated-new-pending.png` |

截图目录：`artifacts/qa/exception-flows-baseline/`。

## 3. 自动验证

- 状态模型：`npm test`
- 浏览器走查：`node scripts/smoke-exception-flows-baseline.mjs`
- 浏览器脚本使用本地 Edge CDP，只操作本地静态原型，不调用真实 AI、消息或外部服务。

## 4. 权限与一致性检查

- 家属回应仅在当前请求为 `PENDING` 且当前角色为 `FAMILY` 时有效。
- 撤回或取消后，即使切换到家属端打开原请求，也只显示不可回应结果。
- 取消请求不会取消老人事务；取消事务会停止提醒并使协作请求失效。
- 家属建议不直接修改任务；老人接受后才更新任务和提醒时间。
- 已接受请求对应旧任务版本；老人修改后旧接受不会继承到新请求。

