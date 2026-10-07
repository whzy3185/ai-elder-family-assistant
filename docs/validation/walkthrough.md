# 阶段 12 完整功能走查（当前版本）

日期：2026-10-07（Asia/Shanghai）；Web 0.12.0；Chrome，390×844；Docker Linux arm64。

访问地址：`http://127.0.0.1:8080`。测试通过实际浏览器鼠标事件操作 UI；每组先通过 Reset 确认恢复初始关系、事务和时钟。除 Reset 外不使用预设场景跳过主流程。

## 当前 T01–T09 结果

| Test | 前置条件与操作 | 预期 | 实际演示结果 | 结果 | Screenshot / Log | Fix |
|---|---|---|---|---|---|---|
| T01 | Reset；双方建立关系并二次确认；输入；8点改9点；保存；共享；家属确认接受；老人查看；提醒；完成 | 时间9:00、提醒8:30；接受≠完成；仅老人确认完成 | 确认接受后事务仍CONFIRMED；老人完成后COMPLETED，提醒清空，协作ACCEPTED | PASS | T01.png、T01-elder-accepted.png；results.json/T01 | 补关系和家属确认；完成停止提醒 |
| T02 | 建立关系；保存；只提醒自己；切家属 | 家属无请求、无事务内容 | sharedFields=null，家属页没有公交卡年审 | PASS | T02.png；results.json/T02 | 返回首页不会覆盖已保存事务 |
| T03 | 已保存且PENDING；撤回二次确认；家属查看 | 仅撤回协作，事务与提醒保留，禁止回应 | WITHDRAWN；CONFIRMED；提醒8:30；无接受按钮 | PASS | T03.png；results.json/T03 | 明确区分撤回和取消 |
| T04 | 已保存且PENDING；取消整件事确认；家属查看 | 事务取消，提醒停止，请求失效 | CANCELLED；reminderAt=null；INVALIDATED；无接受按钮 | PASS | T04.png；results.json/T04 | 双端终态反馈一致 |
| T05 | PENDING；模拟未回应；继续等待 | 未回应不代表接受或拒绝 | NO_RESPONSE且response=null；继续等待后PENDING | PASS | T05-no-response.png、T05.png；results.json/T05 | 等待和接受分开呈现 |
| T06 | PENDING；家属确认不能陪；老人查看 | 提醒继续，事务不取消 | DECLINED；事务CONFIRMED；提醒8:30 | PASS | T06.png；results.json/T06 | 家属拒绝确认和只读结果 |
| T07 | 输入固定原话；AI失败；真实手动表单；确认 | 原话保留且可以恢复 | 原话不变；手动填写后CONFIRMED | PASS | T07.png；results.json/T07 | 用可编辑表单代替固定展示 |
| T08 | 共享预览；模拟发送失败；家属检查；老人重新预览并发送 | 家属无伪成功；重试单条请求 | 失败后家属无事务内容；重试PENDING；sendAttempts=2，requestHistory为空 | PASS | T08-send-failure.png、T08.png；results.json/T08 | 首轮脚本误用不存在的family-request入口，改用实际role-family工具后全部重跑 |
| T09 | ACCEPTED；老人确认改14:00；查看共享并重新发送；家属查看 | 旧接受失效；新共享需再确认；v2等待回复 | 修改后INVALIDATED且未发送；再次确认后PENDING/v2，时间14:00；提醒13:30不外泄；旧请求历史INVALIDATED | PASS | T09-before-renewed-consent.png、T09.png；results.json/T09 | 移除修改后自动发请求；旧答复不继承；更新规则测试 |

## 证据和复现

证据目录：`artifacts/qa/baseline-functional-walkthrough/`。

- `results.json`：第二轮全部通过的逐步操作、最终状态及时间。
- `results-attempt-1.json`、`T08-FAIL.png`：首轮失败保留，不冒充最终通过版本。
- `source-manifest.json`：本轮运行版本的源码 SHA-256 清单。
- `state-tests.txt`：状态模型测试21/21通过。
- `scripts/smoke-regression.mjs`：完整九组 UI 操作脚本。

```sh
docker compose up --build
# 另在独立 Chrome 测试会话打开 URL，并启用 CDP 9335
APP_URL=http://127.0.0.1:8080 CDP_URL=http://127.0.0.1:9335 node scripts/smoke-regression.mjs
npm test
```

本机实际使用独立 context `colima-elder-demo` 和 `compose.local.yaml`，端口绑定127.0.0.1。最终构建镜像：`sha256:09a39f150ea78d9869427829fb13dfd80c9c8f04de244af9c34d90e98f8b6d54`；Compose状态为running / healthy。浏览器资源记录未发现外部资源请求。

## 验证边界

全部是本地固定模拟，不是现实老人测试、真实AI、消息或提醒设备。Web0.11原始记录另存`walkthrough-baseline-web011.md`。本次PASS只覆盖九组指定流程；65项页面覆盖、18项业务攻击、完整适老检查和最终截图同版审计仍需后续阶段验证，不能由本轮结果推定。

VALIDATION_12_STATUS=PASS
