# 安心记事｜AI 日常事务与家庭协作助手

Release **1.0.1**。为72岁、有自主决定能力、会基础手机操作的张阿姨，完成一次公交卡年审事务：核对并纠正AI整理结果、保存个人提醒、自主选择是否请女儿小梅陪同，再查看回应。小梅只能回应单次请求，不能修改、取消或完成妈妈的事务。

## 启动

前置条件：Docker Engine/Desktop及Docker Compose v2，8080端口可用。首次构建需要联网下载基础镜像；运行无需账号、密钥、真实AI或外部服务。

在项目根目录执行：

```sh
docker compose up --build
```

等待容器healthy后打开 **http://localhost:8080**。手机或桌面浏览器均可，主要演示尺寸 **390×844**；桌面可用浏览器移动设备模式。停止：`docker compose down`。

Apple Silicon本机已使用独立Colima环境实测。若使用已有的`colima-elder-demo`：

```sh
docker --context colima-elder-demo compose -f compose.yaml -f compose.local.yaml up --build -d --wait
```

此override将端口绑定127.0.0.1，不要求评审安装Colima。默认Compose仍可直接启动。

## 5–10分钟主流程

页面最下方的“演示工具”提供**老人端 / 家属端 / 演示控制**。角色切换是模拟工具。每一步观察页面说明，不把“记好”“发出”“答应”“办完”混为一件事。

1. 演示控制 → 恢复初始演示 → 确认恢复 → 开始演示。
2. 老人：家庭协作 → 显示二维码 → 切换到小梅扫码 → 模拟扫码并申请 → 切换到张阿姨确认 → 同意建立 → 确认同意 → 继续记事。
3. 记一件事 → 输入下面原话（或“使用预置语音示例（模拟）”）→ 整理。系统模拟把9点听成8点；点“改时间”，点“改成上午 9:00”，核对提醒8:30后“确认记好”。
4. 事务详情 → 请小梅陪同 → 请小梅陪同，查看共享 → 核对五项信息 → 发给小梅。个人提醒时间和原话不共享。
5. 页底家属端 → 查看请求 → 我可以陪你 → 确认可以陪 → 切换到张阿姨端。老人看到答应，事务仍未完成。
6. 返回首页 → 查看这件事 → 模拟到提醒时间 → 知道了，去办事 → 这件事办完了。只有此确认才完成事务。

固定示例：

> 明天上午九点去社区服务中心办理公交卡年审，提前半小时提醒我，再问问小梅能不能陪我去。

演示时钟固定 **2026-10-06 20:00 Asia/Shanghai**；“明天”指10月7日，正常安排09:00、提醒08:30。改期14:00、提醒13:30。不随评审打开日期改变。

## 异常、修改与全部画面

[演示指南](docs/delivery/demo-guide.md)包含每条路径和预期结果。可从头操作，也可在演示控制加载13个完整预设场景；加载会替换当前模拟数据。

| 要演示 | 入口与操作 | 结果 |
|---|---|---|
| 识别错误 | Recognition Error → 改时间 | 8:00→9:00，提醒7:30→8:30 |
| 只提醒自己 | Main Flow → 只提醒我自己 → 页底家属端 | 家属无请求 |
| 未回应 | Pending Family → 老人端 → 查看这件事 → 查看协作结果 → 演示还未回应 | 尚未答应，提醒继续 |
| 拒绝 | Pending Family → 这次不能陪同 → 确认不能陪 → 老人端结果 | 个人事务不取消 |
| 建议改期 | Pending Family → 建议改到下午2:00 → 提交 → 老人接受或拒绝 | 同意才修改，同意后需重新共享 |
| 撤回 | Pending Family → 老人端 → 事务/协作结果 → 撤回陪同请求 → 确认 | 事务和提醒保留，家属不可回应 |
| 取消 | Main Flow → 取消整件事 → 确认取消 | 停提醒，请求失效 |
| AI失败 | AI Failure → 手动填写 → 确认 | 原话保留，无AI仍可记事 |
| 发送失败 | Send Failure → 返回共享预览 → 发给小梅 | 失败时家属无请求，重试只生成一条 |
| 修改已接受 | Accepted → 返回首页 → 查看这件事 → 修改时间 → 继续修改时间 → 确认修改 | 旧答复失效；再次查看共享并发出才有新请求 |
| Reset | 演示控制 → 恢复初始演示 → 确认 → 开始 | 无关系、无事务、无请求 |

控制台另有**按编号查看全部页面与状态**：65个编号均有独立Web画面、PNG和PDF页。快照中的“发送中”需点“继续，查看发送结果”；正常连续流程的发送自动模拟350ms等待。页面定位由应用状态和`data-screen-id`实现，不以URL子路由定位角色。

## 交付入口

- [产品说明](docs/product/product-description.md)，PDF：`exports/product-description.pdf`。
- [完整页面索引](exports/prototype-index.md)，PDF：`exports/prototype-pages.pdf`，65张全长PNG：`exports/screens/`。
- [页面与状态清单](docs/product/page-state-matrix.md)、[需求追踪](docs/delivery/requirement-traceability-matrix.md)。
- [操作走查](docs/validation/walkthrough.md)、[状态审计](docs/validation/state-consistency-audit.md)、[适老审计](docs/validation/accessibility-audit.md)。
- [已知问题](docs/validation/known-issues.md)、[源码冻结记录](docs/delivery/release-freeze.md)、[研究证据分类](docs/research/evidence-index.md)。

## 源码与目录

```text
src/                 可编辑页面、样式和本地状态模型
index.html           前端入口
server.mjs           容器静态文件服务
Dockerfile           固定基础镜像、非root运行
compose.yaml         默认Docker演示；compose.local.yaml为本机override
package*.json        Node项目及锁文件，无第三方运行依赖
docs/product/        范围、流程、权限、状态机、AI和适老说明
docs/research/       Huawei/Apple继承记录及证据边界
docs/validation/     实测结果、独立验收、回归和限制
docs/delivery/       追踪、演示指南及交付记录
exports/             当前Release的全部原型PNG、两份PDF和索引
evidence/            研究与测试证据索引
scripts/ tests/      可复现的检查脚本和状态测试
artifacts/           历史设计与各阶段QA，不是当前静态原型入口
```

可选无Docker开发：Node22或更新版本，`npm start`后打开http://localhost:4173；`npm test`运行状态测试。自动浏览器检查需另开独立Chrome CDP会话，示例见走查文档。

## 模拟与限制

语音、AI整理、消息、身份、二维码、提醒及失败全部预置模拟。状态保存在当前浏览器LocalStorage，刷新恢复；同一浏览器角色切换可连续操作，跨设备和跨标签页实时协同未实现。支持固定案例与09:00/14:00时间；不保证任意自然语言解析。可手动修改事项和地点，日期固定10月7日。

只保留当前事务结果，不提供完整历史、真实通知、后台、诊断、应急、监控或政务建议。两次相关产品体验的原始设备/版本/截图证据仍 **PARTIAL**；没有真人访谈或真实用户指标，Agent测试不替代用户验证。保存这些限制不代表已经完成平台上传、SHA确认或最终交卷。
