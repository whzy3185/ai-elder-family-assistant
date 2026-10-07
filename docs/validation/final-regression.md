# 最终 Docker 回归

原交付链阶段20；Release 1.1.1；2026-10-07；Gate=PASS。

独立产品审查及修复后，移除本项目旧容器和网络，再重新构建启动。最终新容器`1ba38798cfd5`于19:31创建，healthy，访问`http://127.0.0.1:8080`。仅操作本项目Compose服务；本机使用README所列Colima context及localhost override。

| 检查 | 实际结果 | 证据 |
|---|---|---|
| 状态测试 | 46/46 PASS，含取消返回及旧请求导引回归 | artifacts/qa/delivery-audit/state-tests.txt |
| 首次关系、纠错、保存、共享、双角色接受、现实完成 | T01 PASS；接受不自动完成 | artifacts/qa/final-regression/results.json |
| 只提醒、撤回、取消、未回应、拒绝 | T02–T06 PASS；个人提醒与请求相互分离 | 同上，各编号PNG |
| 整理失败、发送失败重试、接受后改期 | T07–T09 PASS；旧答复不继承，重新授权才发送 | 同上 |
| 建议改期、缺信息恢复、提醒及完成 | T10–T11 PASS | 同上 |
| 重复操作、草稿返回/清空、保存/发送中刷新、建议拒绝、发送中返回 | 七组浏览器专项PASS | artifacts/qa/state-consistency/results.json |
| 键盘主流程 | Tab/Enter从建立关系走到完成，PASS | artifacts/qa/keyboard-main-flow/results.json |
| 默认老人、家属、Review及刷新 | 三路由PASS；仅Review出现辅助工具DOM | artifacts/qa/delivery-audit/routes.json |
| 同版性 | Docker提供的11个前端文件与manifest摘要一致；17个源码文件和68图片摘要一致 | served-source.json、exports/source-manifest.json及prototype-index.json |
| 图文 | 68独立画面、73页原型PDF、7页产品说明；README和演示指南1.1.1，固定案例一致 | exports/、docs/validation/final-export-validation.md |

构建记录及容器身份：`artifacts/qa/delivery-audit/final-build.txt`、`final-container.json`。运行时外部资源请求为空。Docker重建未改变UI/规则/文案，故已重新生成的最终静态图仍适用；通过实际服务文件摘要确认，没有以历史截图替代新源码。

这证明可操作原型及本机Docker运行，不证明真人适老理解效果、真实通知或其他硬件环境。两次竞品体验严格证据仍PARTIAL，平台确认/上传/交卷分别核验。
