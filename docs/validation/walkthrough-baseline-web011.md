# 阶段 12 完整功能走查

2026-10-07，Docker / Web 0.11.0，Chrome。每组从 Reset 或完整前置状态开始；测试脚本为 主流程/异常流程/辅助工具基线脚本。

| Test | 前置与操作 | 预期 | 实际 | 结果 | 证据 |
|---|---|---|---|---|---|
| T01 | Reset；关系、输入、纠错、保存、共享、家属接受、老人获知、提醒、完成 | 9:00 / 8:30；家属接受不代替完成 | 23 步正确，老人最终 COMPLETED | PASS | macos-docker/main-flow.png |
| T02 | 保存后只提醒自己，切换家属 | 无请求 | 家属列表为空 | PASS | exceptions/B-private-only-family-empty.png |
| T03 | PENDING→未回应→撤回确认 | 提醒保留、不可回应 | WITHDRAWN；提醒8:30 | PASS | exceptions/F-I-no-response-withdrawn.png |
| T04 | 保存且已发送→取消确认 | 提醒和请求失效 | CANCELLED，reminder=null，INVALIDATED | PASS | exceptions/J-task-cancelled-request-invalidated.png |
| T05 | PENDING→未回应→继续等待 | 不默认接受 | NO_RESPONSE→PENDING | PASS | smoke-exception-flows-baseline / F |
| T06 | 家属拒绝→老人查看 | 个人事务继续 | CONFIRMED、提醒保留 | PASS | exceptions/G-family-declined-task-kept.png |
| T07 | AI失败→手动→确认 | 原话保留、可恢复 | 原话不变、确认成功 | PASS | exceptions/D-parse-failure-manual-recovered.png |
| T08 | 发送失败→重试 | 家属无伪成功；仅1条 | NONE→PENDING；无重复历史 | PASS | exceptions/E-send-retry-single-request.png |
| T09 | ACCEPTED→老人修改14:00并重询 | 旧接受失效、新等待 | v2 / 13:30 / PENDING；旧请求INVALIDATED | PASS | exceptions/K-old-acceptance-invalidated-new-pending.png |

截图根目录：`artifacts/qa/macos-docker/`。本次所有场景均为固定模拟；不是现实老人测试或真实消息送达。

## 已知问题及下一阶段

走查通过仅涵盖指定案例。对照规格发现：接受/拒绝家属改期后的协作状态、未回应请求的家属可回复性、完成后的提醒字段、首页返回详情、真实手动输入和若干设计稿页面仍需 阶段 13–14 修复。最终 Release 必须重新执行这些测试；本记录保留输入基线的实际结果。

VALIDATION_12_STATUS=PASS
