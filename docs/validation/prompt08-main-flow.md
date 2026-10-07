# Prompt 08 完整主流程验证

验证日期：2026-10-07（Asia/Shanghai）  
结果：`PASS`

## 连续流程

Reset 后未通过 Demo Controller 强行跳转，按真实页面操作完成：

1. 张阿姨显示关系二维码；
2. 切换小梅扫码并发起申请；
3. 返回张阿姨端确认建立；
4. 张阿姨输入冻结原句；
5. 显示 AI 模拟处理中；
6. 固定错误把 9:00 整理为 8:00，提醒为 7:30；
7. 张阿姨进入单字段时间修改；
8. 改为 9:00，提醒同步为 8:30；
9. 确认并保存个人事务；
10. 选择请求小梅陪同；
11. 查看五项共享内容并确认发送；
12. 切换小梅端查看请求；
13. 小梅接受陪同；
14. 返回张阿姨端查看“小梅答应陪你去”；
15. 模拟 8:30 提醒；
16. 张阿姨确认现实事务完成。

## 自动验证

`scripts/smoke-prompt08.mjs` 在 Edge 中执行 23 个操作/断言，结果：

```text
status=PASS
taskStatus=COMPLETED
requestStatus=ACCEPTED
```

同时验证：

- 纠错前为 `08:00 / 07:30`；
- 纠错后为 `09:00 / 08:30`；
- 分享确认和家属端不包含私人提醒 `08:30`；
- 家属端读取请求快照的最终时间 `09:00`；
- 家属接受后事务仍为 `CONFIRMED`；
- 老人确认后事务才进入 `COMPLETED`；
- 完成操作发生在 `currentRole=ELDER`。

最终截图：`artifacts/qa/prompt08-completed.png`。

## 状态来源

页面不分别写死业务结果：

- 纠错和提醒联动来自 `task.details.time` 与 `task.reminderAt`；
- 家属端来自发送时创建的 `collaborationRequest.sharedFields`；
- 老人结果来自 `collaborationRequest.status/response`；
- 完成结果来自 `task.status`；
- 两个角色使用同一个 Store 和 LocalStorage 状态。
