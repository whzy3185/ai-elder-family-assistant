# Prompt 13 业务一致性攻击审计

2026-10-07；输入基线2cac9f7；当前Web0.12.0修订版。全部为本地模拟验证，不是实际消息或真人使用研究。

## 18 项攻击结果

| 编号 | 攻击项与结果 | 状态 | 证据 |
|---|---|---|---|
| A01 | 改时间使旧请求失效、新请求展示最终时间 | PASS | tests/prompt13-state-attacks.test.mjs / A01 |
| A02 | 取消后家属不能接受 | PASS | tests/prompt13-state-attacks.test.mjs / A02 |
| A03 | 家属接受后老人显示正确且不完成事务 | PASS | tests/prompt13-state-attacks.test.mjs / A03 |
| A04 | 撤回不删除个人事务 | PASS | tests/prompt13-state-attacks.test.mjs / A04 |
| A05 | 拒绝共享后家属不可见 | PASS | tests/prompt13-state-attacks.test.mjs / A05 |
| A06 | 发送失败后家属无请求 | PASS | tests/prompt13-state-attacks.test.mjs / A06 |
| A07 | 连点发送无重复 | PASS | tests/prompt13-state-attacks.test.mjs / A07 |
| A08 | 连点接受不改变结果 | PASS | tests/prompt13-state-attacks.test.mjs / A08 |
| A09 | 旧请求回复不能覆盖新版本 | PASS | tests/prompt13-state-attacks.test.mjs / A09 |
| A10 | 家属建议不直接修改老人事务 | PASS | tests/prompt13-state-attacks.test.mjs / A10 |
| A11 | AI失败保留原话 | PASS | tests/prompt13-state-attacks.test.mjs / A11 |
| A12 | 返回保留草稿，包括清空后的输入 | PASS | tests/prompt13-state-attacks.test.mjs / A12 |
| A13 | 建立关系不会自动共享事务 | PASS | tests/prompt13-state-attacks.test.mjs / A13 |
| A14 | 关系拒绝仍可使用个人提醒 | PASS | tests/prompt13-state-attacks.test.mjs / A14 |
| A15 | 家属不能修改、解析、取消老人事务 | PASS | tests/prompt13-state-attacks.test.mjs / A15 |
| A16 | 家属不能完成老人事务 | PASS | tests/prompt13-state-attacks.test.mjs / A16 |
| A17 | 刷新不回退且发送中刷新可恢复 | PASS | tests/prompt13-state-attacks.test.mjs / A17 |
| A18 | Demo场景完整替换、不污染 | PASS | tests/prompt13-state-attacks.test.mjs / A18 |

状态测试43/43通过，其中包含上述18项和解析过期回调、新事务请求身份、异常手动字段、HTML转义四项附加检查。`artifacts/qa/prompt13-browser/state-tests.txt`保留真实输出。

## Docker 浏览器补充验证

七组实际操作均通过：重复发送、重复接受、草稿返回及清空、已接受状态刷新、发送中刷新与重试、拒绝改期后家属再次回应、发送中返回预览后重试。结果与步骤位于`artifacts/qa/prompt13-browser/results.json`，对应独立截图同目录。

第一次发送中刷新测试发现：界面恢复但LocalStorage仍保留SENDING。修复：Store加载归一化后立即持久化，防止二次刷新与数据读取不一致。失败保留为`results-attempt-1.json`及`A17-refresh-sending-FAIL.png`；修复后七组全量重跑PASS。

## 修复摘要

- 解析提交携带唯一parseToken，过期异步回调不能处理新草稿。
- 草稿更新保留空值，返回不重新填入预置文本。
- 新事务沿用递增版本，避免前一件事的旧requestId与新事碰撞。
- 发送中导航恢复未发送状态；发送中刷新进入重试页，不伪报成功。
- 家属改期建议可以由老人撤回；拒绝建议后回到PENDING，可再次回应。
- 所有家属只读详情准确显示已接受/已拒绝/建议中，不能一概标为失效。
- 手动输入在确认页转义，未知输入安全失败，空字段不能保存。

## 实现与规格映射

规格SAVED对应实现CONFIRMED；NOT_SHARED对应NONE；SEND_FAILED通过失败页面及无已创建请求表达；超时PENDING用NO_RESPONSE表达，仍可回应。此映射不改变业务含义。家属共享白名单仍只有事项、日期、时间、地点、陪同意图。

本Gate证明上述状态冲突已消除；65项全页面入口与截图、全页适老和最终独立验收尚不由本Gate推定。

PROMPT_13_GATE_STATUS=PASS
