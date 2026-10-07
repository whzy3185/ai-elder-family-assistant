# 安心记事｜日常事务与家庭协作助手

当前版本 **1.1.1**（产品定义文档校正版）。安心记事面向日常事务中需要提醒、理解确认或有限家庭协作的老年用户。本次原型聚焦其中一个切片：能自主决定、能完成基础智能手机操作，独居或日间独处，且有一名成年家属可适度参与。

72岁张阿姨和同城女儿小梅是固定Persona，公交卡年审是演示案例。设计重点是先纠正系统理解、再由老人决定必要共享、最终获得明确回应；不将这个案例或当前结论外推到所有老人和所有事务。

## 启动与访问

需要Docker Engine/Desktop、Docker Compose v2及空闲的8080端口。在项目根目录运行：

```sh
docker compose up --build
```

容器healthy后访问：http://localhost:8080。停止：`docker compose down`。首次构建需下载固定基础镜像；运行无需私人账号、密钥、模型额度或真实外部服务。

| 地址 | 内容 |
|---|---|
| `/` | 张阿姨的产品：事情 / 家人 |
| `/family` | 小梅的产品：消息 / 家人 |
| `/review` | 手机产品画面旁的独立评审辅助 |

主要手机尺寸390×844。桌面Review建议1100px以上宽度，窄屏辅助工具在产品画面下方、容器外。产品内没有身份切换或场景按钮。

Apple Silicon本机使用独立Colima环境，已有该环境时可执行：

```sh
docker --context colima-elder-demo compose -f compose.yaml -f compose.local.yaml up --build -d --wait
```

本机override绑定127.0.0.1；评审无需安装Colima，默认Compose可直接启动。

## 5–10分钟主流程

1. `/review` → 恢复初始状态 → 确认。切换张阿姨，在产品“家人”里邀请小梅。
2. 辅助工具切换小梅 → 产品“家人” → 向妈妈申请。切回张阿姨 → 家人 → 核对小梅身份 → 同意建立 → 确认同意。建立关系不会自动分享事情。
3. 产品“事情” → 记一件事。输入下面原话，点“帮我整理”。看清8:00结果后点“改时间”，改成9:00，核对8:30提醒，再“确认记好”。
4. 请小梅陪你去 → 查看要告诉她的内容 → 确认发给小梅。她只看到事项、日期、时间、地点、希望陪同。
5. 辅助工具切换小梅 → 查看消息 → 我可以陪你 → 确认。切回张阿姨 → 查看这件事 → 看看小梅的答复。
6. 产品事务详情 → 这件事办完了 → 确认已经办完。接受陪同本身不会完成事务。

身份切换仅模拟两人的设备；无需加载中间状态也能走完主流程。也可依次访问两个独立产品地址操作，刷新恢复同一浏览器内的本地状态。提醒快捷查看在辅助工具“演示时间”区域。

> 明天上午九点去社区服务中心办理公交卡年审，提前半小时提醒我，再问问小梅能不能陪我去。

起始演示时间2026-10-06 20:00 Asia/Shanghai；“明天”对应10月7日。正常09:00/08:30提醒，改期14:00/13:30提醒。语音按钮将上述原话填入输入框；本版本不录音。

## 关键状态与恢复

`/review`的“快速查看”提供13种自然中文情况：首次使用、正常流程、时间需要修改、信息没听全、暂时没整理好、消息没有发出去、小梅还没回复、可以陪同、不能陪同、建议改时间、已撤回、已取消、提醒时间到了。加载会完整替换当前数据。

“查看全部画面”覆盖68项（63产品画面、5辅助画面）。界面只显示自然中文名称；材料索引使用稳定页面编号定位。辅助快照中的整理/发送过程可在工具中继续；正常连续流程自动等待450/350ms。

恢复：辅助工具→恢复初始状态→确认；关系、事务、请求和时钟回到首次。取消事务会停提醒；撤回陪同只撤回请求。失败保留输入与个人提醒；改时间后必须再次查看共享并确认发送，旧答复不会沿用。

[完整演示指南](docs/delivery/demo-guide.md)提供各条路径及预期结果。

## 材料与源码

- [产品说明](docs/product/product-description.md)，PDF：`exports/product-description.pdf`。
- [全部页面索引](exports/prototype-index.md)，原型PDF：`exports/prototype-pages.pdf`，独立PNG：`exports/screens/`。
- [页面与状态清单](docs/product/page-state-matrix.md)、[需求追踪矩阵](docs/delivery/requirement-traceability-matrix.md)。
- [业务走查](docs/validation/walkthrough.md)、[可见内容审计](docs/validation/presentation-purity-audit.md)、[适老审计](docs/validation/senior-usability-audit.md)。
- [独立验收](docs/validation/independent-acceptance.md)、[最终Docker回归](docs/validation/final-regression.md)、[版本记录](docs/delivery/version.md)。
- [本轮用户定义与交付核对](docs/delivery/definition-and-delivery-audit.md)、[平台最后操作](docs/delivery/platform-finalization.md)。
- [已知问题](docs/validation/known-issues.md)、[冻结记录](docs/delivery/release-freeze.md)、[研究证据](docs/research/evidence-index.md)。

`src/`为可编辑HTML渲染、CSS和本地状态模型；`Dockerfile`、`compose.yaml`、`server.mjs`提供静态前端，无后端或数据库。`scripts/`与`tests/`包含验证工具，`artifacts/`是历史设计和QA证据。当前静态材料由本轮最终Docker重新截图导出；同版源码及图片校验见exports/source-manifest.json。

无Docker开发可用Node22以上：`npm start`后打开http://localhost:4173；`npm test`运行状态测试。浏览器自动测试需独立Chrome CDP会话；当前主回归脚本为`scripts/smoke-regression.mjs`。

## 模拟边界与待验证事项

语音、整理、消息、邀请、提醒和失败使用预设状态；不会联系真实家属。数据存于当前浏览器LocalStorage，跨设备/跨标签页实时协同未实现。支持固定公交卡年审案例与09:00/14:00；事项和地点可手动修改，日期固定10月7日；不保证任意自然语言解析。

本次围绕一次事务做提醒、整理纠错及单次家庭协作；舍弃医疗、应急、定位监控、全权托管、多家属、完整历史及真实后端/AI/通知，以控制权限和异常组合。完成/取消后仍可查看当前结果。

原型走查与自动测试已执行；真人测试尚未进行，计划从上述用户切片招募。Huawei/Apple两次体验的原始设备、版本、截图证据仍 **PARTIAL**。未覆盖的人群边界见产品说明，不能把工程检查当成用户研究。

平台动作依次是：本人锁定本轮新SHA→把网页生成的实际上传说明发给已连接Agent→上传当前会话原始日志并核验回执→本人确认交卷。各步骤分别核验，不沿用修改前SHA。
