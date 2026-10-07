# AI 日常事务与家庭协作助手

面向产品岗位考核的研究与产品设计仓库。当前分支为 `research`，目标是先完成可追溯的前期调研、范围决策、安全基线、实现路线和交付计划，再进入交互原型开发。

## 当前冻结范围

为 72 岁、具备自主决策能力、会使用智能手机基础功能的张阿姨，解决一次“明天上午 9:00 去社区服务中心办理公交卡年审，提前 30 分钟提醒，并询问女儿小梅能否陪同”的事务。AI 仅负责把自然语言整理为结构化事务；创建、修改、共享和取消都由张阿姨确认。

本阶段不做医疗诊断、应急救援、定位监控、完整陪聊、支付、智能家居或真实消息服务。

## 本地运行

当前 Web 基础原型无第三方运行依赖：

```powershell
npm test
npm start
```

浏览器访问 `http://localhost:4173`。当前 Prompt 08 已支持从首次关系建立、固定识别错误与纠正、保存个人提醒、单次共享、家属接受、老人获知结果、提醒触发到老人确认完成的连续主流程；异常分支将在 Prompt 09 补齐。

## 文档索引

| 编号 | 文档 | 作用 |
|---|---|---|
| 00 | [研究方法与证据边界](docs/00-research-method.md) | 资料分级、研究限制、提交前证据门槛 |
| 01 | [产业与发展判断](docs/01-industry-landscape.md) | 人口、数字化、政策、产业链和趋势 |
| 02 | [相关产品与替代方案](docs/02-product-examples.md) | 桌面研究样本与机会空白 |
| 03 | [用户触达与验证方法](docs/03-reach-and-validation.md) | 双边用户、渠道、漏斗和验证设计 |
| 04 | [风险与主动排除](docs/04-risks-and-exclusions.md) | 产品、伦理、隐私、运营和交付雷点 |
| 05 | [开发准则](docs/05-development-guidelines.md) | 状态、适老、质量和交付 Definition of Done |
| 06 | [接口与 GUI 暴露防护准则](docs/06-api-and-gui-security.md) | API、权限、密钥、调试界面和发布安全 |
| 07 | [实现方案与综合成本](docs/07-implementation-and-cost.md) | 技术选型、阶段成本和方案权衡 |
| 08 | [可实现性与可延续性](docs/08-feasibility-and-sustainability.md) | 可行性、依赖、扩展边界和退出条件 |
| 09 | [产品 Roadmap](docs/09-roadmap.md) | 48 小时交付及中长期演进 |
| 10 | [执行 Plan](docs/10-execution-plan.md) | 工作分解、验收、分支和提交策略 |
| 11 | [来源索引](docs/11-sources.md) | 官方来源、访问日期及用途 |
| 12 | [研究决策登记](docs/12-decision-register.md) | 已确定决策、待验证假设和变更规则 |
| 13 | [项目需求框架草案](docs/13-requirements-framework-draft.md) | 题目拆解、角色、需求、状态与验收映射 |
| 14 | [产品阶段限制草案](docs/14-stage-guardrails-draft.md) | 各阶段范围、数据、AI、安全、成本和退出门槛 |
| 15 | [能力边界与主观决策审计](docs/15-ability-boundaries-and-decision-audit.md) | 无代码条件下的交付边界、已知信息和完整决策积压 |
| P-01 | [正式产品章程](docs/product/01-product-charter.md) | 冻结用户、唯一事务、P0/P1、排除范围、权限和演示时钟 |
| P-03A | [事务状态机](docs/product/task-state-machine.md) | 事务、解析过程、提醒、版本和完成/取消规则 |
| P-03B | [家庭协作状态机](docs/product/collaboration-state-machine.md) | 请求发送、回应、未回应、撤回、改期和失效规则 |
| P-03C | [字段级权限矩阵](docs/product/permissions.md) | 双方可见字段、动作权限、确认点和拒绝规则 |
| P-04A | [页面与状态总表](docs/product/page-state-matrix.md) | 老人、关系、家属和 Demo 全部页面状态及测试映射 |
| P-04B | [信息架构](docs/product/information-architecture.md) | 双角色结构、对象所有权、路由与导航边界 |
| P-04C | [正式用户流程](docs/product/user-flows.md) | 主流程、修改/撤回/取消及失败/未回应/拒绝流程 |
| P-05A | [AI 理解规则](docs/product/ai-rules.md) | 输入/输出白名单、确认、纠错、失败与手动降级 |
| P-05B | [适老交互规范](docs/product/accessibility-guidelines.md) | viewport、字号、触控、反馈、缩放与验收基线 |
| P-05C | [产品文案规范](docs/product/content-guidelines.md) | 成人化语言、固定术语、结果模板与禁用表达 |
| D-06A | [仓库内高保真设计源](artifacts/design/local-prototype/README.md) | 65 个高保真画面、逐屏访问、可编辑 HTML/CSS 和自动布局审计 |
| D-06F | [Figma 补充设计源](artifacts/design/figma-source.md) | 早期设计系统、节点索引和 Figma 快照限制 |
| D-06B | [Design Audit](docs/validation/design-audit.md) | 页面完整性、业务一致性、视觉抽查与 P0 缺口 |
| E-07 | [Web 基础架构](docs/engineering/web-foundation.md) | 原生前端选择、统一状态模型、LocalStorage 和浏览器走查 |
| V-08 | [完整主流程验证](docs/validation/prompt08-main-flow.md) | 23 步浏览器走查、跨角色数据一致性和完成权限验证 |
| D-02 | [题目验收追踪矩阵](docs/delivery/requirement-traceability-matrix.md) | 90 项原题要求到规则、页面、实现、测试和证据的映射 |
| S-00 | [统一项目状态](docs/PROJECT_STATUS.md) | 当前阶段、版本、各交付状态与后续阶段清单 |
| G-00 | [Gap Audit](docs/GAP_AUDIT.md) | 题目要求、已有成果、缺口、负责阶段和验收证据 |
| R-01 | [竞品体验证据索引](docs/research/evidence-index.md) | 华为与 Apple 体验材料、证据分级和待补项 |
| R-02 | [华为体验研究](docs/research/huawei-study.md) | 长辈关怀、远程守护、双层授权与适老启示 |
| R-03 | [Apple 体验研究](docs/research/apple-study.md) | 结构化提醒、共享权限与双状态机启示 |

## 证据标记

- **[事实]**：可由列明的公开来源直接支持。
- **[分析]**：基于事实作出的产品或商业判断。
- **[假设]**：尚待用户研究或实验验证，不作为事实陈述。
- **[候选人观察]**：候选人提供的实际操作文字记录；若缺截图、设备或版本细节，标为 `C-PARTIAL`。
- **[待补实证]**：已有文字记录，但仍需截图、录屏或设备版本信息才能独立复核。

## 仓库约束

- 项目文件仅位于 E 盘。
- 原型阶段默认不连接真实后端、数据库、AI、短信或推送服务。
- 不把密钥、令牌、真实老人数据、真实家庭关系或原始语音提交到仓库。
- `research` 分支用于研究基线；后续原型和交付文档使用独立分支并通过合并进入 `main`。
