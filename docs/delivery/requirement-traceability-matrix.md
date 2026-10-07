# 题目验收追踪矩阵

版本：`REQUIREMENT_MATRIX_VERSION=1.0.0`

冻结日期：2026-10-06（Asia/Shanghai）

范围基线：[产品章程](../product/01-product-charter.md)

## 1. 使用规则

每条要求必须同时具备：产品规则、页面或可定位文档状态、实现位置、测试用例和证据位置。状态只使用：

- `PASS`：当前仓库已有可复核证据；
- `PARTIAL`：已有部分证据，但严格证据不完整；
- `FAIL`：缺少题目要求的实际画面、操作、运行结果或交付物。

矩阵中的 `src/`、`tests/`、`artifacts/` 路径是已经冻结的后续落点，不代表文件当前存在。题目要求实际画面或操作的项目，在对应页面、Web、测试和静态证据产生前必须保持 `FAIL`。

## 2. 预留页面与状态 ID

这些 ID 在 Prompt 04 形成正式页面矩阵时可以合并到同一页面布局，但状态 ID、进入方式和证据定位不得删除。

| ID 组 | 含义 |
|---|---|
| `EL-REL-*` | 老人端关系建立、拒绝、解除及权限说明 |
| `FM-REL-*` | 家属端关系发起和结果 |
| `EL-TASK-*` | 老人端输入、AI 理解、纠错、保存、提醒、完成 |
| `EL-SHARE-*` | 老人端共享决定、确认、发送、等待和结果 |
| `FM-REQ-*` | 家属端请求列表、详情和回应 |
| `EL-EX-*` / `FM-EX-*` | 双端异常、取消、过期和旧版本 |
| `DM-*` | 角色切换、场景加载和重置 |
| `DOC-*` | 可定位文档交付物 |

## 3. 用户、依据与范围

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-001 | 明确实际使用条件，包括老人设备能力、常用设备和居住情况 | 72 岁张阿姨；智能手机；会语音、扫码、接电话；独居或日间独处；具备自主决策能力 | `DOC-CHARTER-USER` | `docs/product/01-product-charter.md#2-用户画像` | `TC-DOC-001` 逐字段核对画像 | 当前产品章程第 2 节 | PASS |
| RTM-002 | 明确家属参与条件 | 小梅同城、工作忙、可查看请求但不能保证陪同 | `DOC-CHARTER-FAMILY` | `docs/product/01-product-charter.md#22-家属小梅` | `TC-DOC-002` 核对关系、距离、响应能力 | 当前产品章程第 2.2—3 节 | PASS |
| RTM-003 | 区分老人需求与家属诉求 | 老人关注理解、提醒、决定权；家属关注信息明确、响应负担和非监控 | `DOC-CHARTER-GOALS` | `docs/product/01-product-charter.md#6-用户目标` | `TC-DOC-003` 双角色目标无混写 | 当前产品章程第 6—7 节 | PASS |
| RTM-004 | 围绕一个主要问题和一个事务 | 只做公交卡年审提醒与一次陪同请求 | `DOC-CHARTER-SCENARIO` | `docs/product/01-product-charter.md#4-唯一核心事务` | `TC-DOC-004` 全库固定事务一致性检查 | 当前产品章程第 4 节 | PASS |
| RTM-005 | 明确当前替代方式及选择依据 | 对比 Apple 提醒、共享列表、华为关怀和远程守护 | `DOC-RESEARCH-COMPETITORS` | `docs/research/apple-study.md`、`docs/research/huawei-study.md` | `TC-RES-001` 结论可追溯检查 | 两份文字体验记录 | PARTIAL |
| RTM-006 | 至少实际体验两个产品或替代方案并保留证据 | 采用华为与 Apple；文字记录可用，截图、录屏和设备版本仍需补 | `DOC-RESEARCH-EVIDENCE` | `docs/research/evidence-index.md` | `TC-RES-002` 证据完整性检查 | `artifacts/research/*`（缺失） | PARTIAL |
| RTM-007 | 区分真实观察、二手资料和假设 | 使用 A/B/C/D 与候选人观察、官方事实、方案推演、待验证假设标记 | `DOC-RESEARCH-METHOD` | `docs/00-research-method.md`、`docs/research/*` | `TC-RES-003` 抽样追溯标记 | 当前研究方法和来源索引 | PASS |
| RTM-008 | 列出必做范围、主动舍弃和理由 | P0、P1、Explicitly Excluded 已冻结；P1 不得阻塞 P0 | `DOC-CHARTER-SCOPE` | `docs/product/01-product-charter.md#9-p0本次必须交付` | `TC-DOC-005` 范围与导航一致性检查 | 当前产品章程第 9—15 节 | PASS |
| RTM-009 | 不扩展成陪聊、硬件、智能家居、定位、医疗或应急 | 上述能力全部排除，不设计入口 | `DOC-CHARTER-EXCLUDED` | `docs/product/01-product-charter.md#11-explicitly-excluded` | `TC-SCOPE-001` 全库禁用能力扫描 | 当前 Explicitly Excluded | PASS |

## 4. 关系、权限与双端协作

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-010 | 首次建立家庭协作关系 | 小梅扫码发起；张阿姨查看身份、用途、范围和撤回方式后同意 | `FM-REL-01`、`EL-REL-01/02`、`REL-PENDING/ACTIVE` | `src/views.js`、`src/state/model.js` | `TC-REL-001` 建立关系 | Prompt 08 连续浏览器走查 | PASS |
| RTM-011 | 老人可以拒绝建立关系 | 拒绝后关系不成立，小梅不能查看事务，张阿姨仍可使用个人提醒 | `EL-REL-03`、`FM-REL-03`、`REL-DECLINED` | `src/views.js`、`src/state/model.js` | `TC-REL-002` 拒绝关系 | Scenario A 浏览器截图与状态测试 | PASS |
| RTM-012 | 说明双方分别能看什么 | 小梅只见已授权的事项、日期、时间、地点和帮助；不见提醒、原文、位置和其他事务 | `EL-REL-02`、`EL-SHARE-02`、`FM-REQ-02` | `src/views.js`、`src/state/model.js` | `TC-PERM-001` 字段白名单 | 浏览器断言家属无 8:30 私人提醒 | PASS |
| RTM-013 | 说明双方分别能做什么 | 张阿姨拥有事务；小梅只能接受、拒绝、建议改期 | `EL-REL-02`、`FM-REQ-02/03/04/05` | `src/views.js`、`src/state/model.js` | `TC-PERM-002` 角色动作矩阵 | 三类家属回应均已浏览器验证 | PASS |
| RTM-014 | 明确何时需要老人确认 | 建立关系、保存事务、共享、接受改期、撤回、取消和完成均由老人确认 | `EL-REL-02`、`EL-TASK-05`、`EL-SHARE-02`、`EL-EX-04/05`、`EL-TASK-09` | `src/state/model.js`、`src/views.js` | `TC-PERM-003` 未确认不得执行 | 主流程及撤回、取消、改期确认均已验证 | PASS |
| RTM-015 | 关系授权不等于全部信息开放 | 关系只建立通道，每件事务单独授权 | `EL-REL-02`、`EL-SHARE-02` | `src/state/model.js`、`src/views.js` | `TC-CONSENT-001` 无事务授权不可见 | 关系建立后仍需独立共享确认 | PASS |
| RTM-016 | 拒绝共享后流程仍清楚，支持“只提醒自己、不共享” | 张阿姨选择只提醒自己；事务和 08:30 提醒保留，小梅无请求 | `EL-SHARE-01`、`EL-TASK-06`、`FM-REQ-00` | `src/views.js`、`src/state/model.js` | `TC-SHARE-001` 只提醒自己 | Scenario B 家属空状态截图 | PASS |
| RTM-017 | 老人可以结束关系 | 结束后阻止新共享和新访问；已有演示状态按 Prompt 03 规则处理 | `EL-REL-04/05`、`FM-REL-04` | `src/features/relationship/*` | `TC-REL-003` 解除关系 | 解除确认与结果图（缺失） | FAIL |

## 5. 一次完整事务主流程

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-018 | 老人表达一件日常事务 | 支持固定模拟语音和手动文字；使用冻结原句 | `EL-TASK-01`、`TASK-DRAFT` | `src/views.js` | `TC-MAIN-001` 输入事务 | Prompt 08 浏览器走查 | PASS |
| RTM-019 | 展示 AI 处理状态 | 处理中不得提前显示成功；模拟等待短于 2 秒且可复现 | `EL-TASK-02`、`TASK-UNDERSTANDING` | `src/app.js`、`src/views.js` | `TC-MAIN-002` 处理中状态 | 450ms 确定性模拟及浏览器断言 | PASS |
| RTM-020 | 老人确认系统理解 | 分字段显示事项、日期、时间、地点、提醒和协作意图 | `EL-TASK-03A/03B`、`TASK-NEEDS_CONFIRMATION` | `src/views.js` | `TC-MAIN-003` 字段复述 | 结构化确认页与走查 | PASS |
| RTM-021 | 展示并修改一处识别错误 | 固定把 9:00 识别为 8:00，老人单字段改回 9:00 | `EL-TASK-03B/04` | `src/state/model.js`、`src/views.js` | `TC-MAIN-004` 8:00→9:00 | 自动走查前后断言 | PASS |
| RTM-022 | 提醒时间随事务时间同步 | 错误时 7:30，修正后 8:30；自然语言再次复述 | `EL-TASK-03B/05` | `src/state/model.js` | `TC-MAIN-005` 时间联动 | 状态测试与浏览器断言 | PASS |
| RTM-023 | 老人确认并保存个人事务 | 未确认不创建；确认后 `TASK-CONFIRMED` | `EL-TASK-05/06` | `src/state/model.js`、`src/views.js` | `TC-MAIN-006` 保存事务 | 保存结果与 LocalStorage 证据 | PASS |
| RTM-024 | 保存个人提醒 | 提醒属于张阿姨，不因家属拒绝、未回应或撤回请求而删除 | `EL-TASK-06`、`REMINDER-SCHEDULED` | `src/state/model.js` | `TC-REM-001` 保存提醒 | Scenario A/B/F/G/I 状态测试 | PASS |
| RTM-025 | 决定是否请求家属 | 保存事务后单独选择“请小梅陪同”或“只提醒我” | `EL-SHARE-01` | `src/views.js` | `TC-MAIN-007` 两分支 | 主流程共享与 Scenario B 不共享均通过 | PASS |
| RTM-026 | 查看本次共享内容 | 发送前逐项显示接收者和五个共享字段 | `EL-SHARE-02`、`CONSENT-REQUIRED` | `src/views.js` | `TC-MAIN-008` 复述共享字段 | 分享页与隐私字段断言 | PASS |
| RTM-027 | 明确确认后才发送 | 只有点击“发给小梅”才创建请求；返回不发送 | `EL-SHARE-02/03`、`REQUEST-SENDING` | `src/state/model.js`、`src/views.js` | `TC-MAIN-009` 发送授权 | 共享确认及失败重试状态已验证 | PASS |
| RTM-028 | 家属接收并查看请求 | 小梅看到请求列表和详情，且内容与老人确认一致 | `FM-REQ-01/02`、`REQUEST-DELIVERED/VIEWED` | `src/views.js` | `TC-MAIN-010` 家属查看 | 共享快照时间和字段断言 | PASS |
| RTM-029 | 家属回应 | 小梅可以接受、拒绝或建议改期，三者互斥 | `FM-REQ-03/04/05` | `src/state/model.js`、`src/views.js` | `TC-COLLAB-001/002/003` | 主流程接受及 Scenario G/H 通过 | PASS |
| RTM-030 | 老人获知家属结果 | 张阿姨看到明确结果、时间和下一步，不把陪同接受当作事务完成 | `EL-SHARE-05/06/07` | `src/views.js` | `TC-MAIN-011` 返回老人结果 | 接受结果和未完成断言 | PASS |
| RTM-031 | 正常完成协作闭环 | 关系建立、纠错、保存、共享、小梅接受、老人看到结果连续可操作 | 主流程全部状态 | `scripts/smoke-prompt08.mjs` | `TC-E2E-001` 完整主流程 | 23 步 PASS 和完成截图 | PASS |
| RTM-032 | 老人确认现实事务完成 | 只有张阿姨可点“这件事办完了”；陪同接受不自动完成 | `EL-TASK-09`、`TASK-COMPLETED` | `src/state/model.js`、`src/views.js` | `TC-COMPLETE-001` 确认完成 | 接受后 CONFIRMED、老人确认后 COMPLETED | PASS |

## 6. 异常、取消和版本一致性

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-033 | 必要信息缺失 | AI 不猜测缺失时间或地点，突出缺失字段并允许补填 | `EL-EX-01`、`TASK-MISSING_REQUIRED` | `src/views.js`、`src/state/model.js` | `TC-AI-001` 缺失字段 | Scenario C 浏览器截图 | PASS |
| RTM-034 | AI 解析失败 | 保留原输入，明确说明未能整理，进入手动表单 | `EL-EX-02`、`TASK-PARSE_FAILED` | `src/views.js`、`src/state/model.js` | `TC-AI-002` 解析失败恢复 | Scenario D 浏览器截图 | PASS |
| RTM-035 | 提供语音以外的替代操作 | 语音不是唯一入口；随时可用手动文字或结构化字段 | `EL-TASK-01`、`EL-EX-02` | `src/views.js` | `TC-AI-003` 无语音完成 | 手动输入和失败回退均可点击 | PASS |
| RTM-036 | 请求发送失败 | 不显示已通知；保留事务和授权选择；用户主动重试 | `EL-EX-03`、`REQUEST-SEND_FAILED` | `src/views.js`、`src/state/model.js` | `TC-REQ-001` 失败重试 | Scenario E 浏览器截图与单请求断言 | PASS |
| RTM-037 | 家属未回应 | 未回应不是拒绝；显示继续等待、撤回请求或自行安排 | `EL-EX-04`、`REQUEST-NO_RESPONSE` | `src/views.js`、`src/state/model.js` | `TC-REQ-002` 未回应 | Scenario F 浏览器走查 | PASS |
| RTM-038 | 家属拒绝 | 张阿姨看到“不能陪同”，个人事务和提醒继续有效 | `FM-REQ-04`、`EL-SHARE-06`、`REQUEST-DECLINED` | `src/views.js`、`src/state/model.js` | `TC-COLLAB-002` 拒绝 | Scenario G 双端截图与状态测试 | PASS |
| RTM-039 | 家属建议改期 | 小梅只提交提案，不直接改事务 | `FM-REQ-05`、`EL-SHARE-07`、`REQUEST-CHANGE_PROPOSED` | `src/views.js`、`src/state/model.js` | `TC-COLLAB-003` 建议改期 | Scenario H 提案后仍为 09:00 | PASS |
| RTM-040 | 老人决定是否接受改期 | 接受才更新任务并产生新请求版本；拒绝保留 9:00 | `EL-SHARE-08/09` | `src/views.js`、`src/state/model.js` | `TC-COLLAB-004/005` 接受/拒绝改期 | Scenario H1/H2 浏览器截图 | PASS |
| RTM-041 | 老人撤回协作请求 | 撤回只结束陪同请求，不删除事务和 08:30 提醒 | `EL-EX-05`、`FM-EX-01`、`REQUEST-WITHDRAWN` | `src/views.js`、`src/state/model.js` | `TC-CANCEL-001` 撤回请求 | Scenario I 二次确认和家属不可回应 | PASS |
| RTM-042 | 老人取消整个事务 | 取消事务同时取消未终结请求和未来提醒 | `EL-EX-06`、`FM-EX-02`、`TASK-CANCELLED` | `src/views.js`、`src/state/model.js` | `TC-CANCEL-002` 取消事务 | Scenario J 二次确认和家属不可回应 | PASS |
| RTM-043 | 已发送后修改事务 | 修改须确认；旧请求作废，新任务版本生成新请求 | `EL-TASK-08`、`EL-EX-07`、`TASK-V2` | `src/views.js`、`src/state/model.js` | `TC-VERSION-001` 已发送后修改 | Scenario K 新旧版本状态测试 | PASS |
| RTM-044 | 旧家属答复失效 | 小梅在旧页面答复时得到“请求已更新，不能继续处理” | `FM-EX-03`、`REQUEST-SUPERSEDED` | `src/state/model.js`、`requestHistory` | `TC-VERSION-002` 旧答复冲突 | 旧接受归档为 INVALIDATED；专项旧页攻击待 Prompt 13 | PARTIAL |
| RTM-045 | 提醒触发 | 固定时钟到 08:30 显示提醒；取消或完成后不得触发 | `EL-TASK-07`、`REMINDER-TRIGGERED/SUPPRESSED` | `src/state/model.js` | `TC-REM-002/003` 触发/抑制 | 正常触发通过；取消守卫有状态测试 | PASS |
| RTM-046 | 返回或取消不丢失必要内容 | 非破坏性返回保留草稿；破坏性取消明确说明后果 | 所有编辑/确认状态 | `src/domain/persistence.ts` | `TC-NAV-001` 返回保留 | 返回前后截图（缺失） | FAIL |

## 7. AI 规则和适老交互

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-047 | 说明 AI 在哪个步骤介入 | AI 只在输入后生成待确认结构，不执行创建或发送 | `EL-TASK-02/03A/03B`、`DOC-AI-RULES` | `docs/product/ai-rules.md`、`src/state/model.js` | `TC-AI-004` AI 边界 | 处理页、确认页及状态测试 | PASS |
| RTM-048 | 说明 AI 使用什么信息 | 只用当前输入和明确字段，不读历史、位置、健康或通讯录 | `EL-TASK-03A/03B`、`DOC-AI-RULES` | `docs/product/ai-rules.md` | `TC-AI-005` 输入白名单 | 输入白名单已冻结；页面图缺失 | PARTIAL |
| RTM-049 | AI 输出与依据可理解 | 分字段复述来自当前输入；不显示虚假权威或编造依据 | `EL-TASK-03A/03B` | `docs/product/ai-rules.md`、`src/views.js` | `TC-AI-006` 依据复述 | 结构化确认页已浏览器验证 | PASS |
| RTM-050 | 用户可以纠正 AI | 每个必要字段独立修改，修改后重新复述最终结果 | `EL-TASK-03B/04/05` | `docs/product/ai-rules.md`、`src/views.js`、`src/state/model.js` | `TC-MAIN-004/005` | 8:00→9:00 与提醒联动已验证 | PASS |
| RTM-051 | AI 失败或结果不可信时有办法继续 | 明确失败、保留输入、手动填写；任何结果都需老人确认 | `EL-EX-01/02A/02B` | `docs/product/ai-rules.md`、`src/views.js`、`src/state/model.js` | `TC-AI-001/002/003` | Scenario C/D 浏览器恢复证据 | PASS |
| RTM-052 | 历史记忆仅在必要时设计 | 本版不读取或保留 AI 历史记忆；完整历史中心排除 | `DOC-CHARTER-EXCLUDED`、无历史入口 | `docs/product/01-product-charter.md` | `TC-SCOPE-002` 无历史读取/入口 | 当前产品章程；运行证据缺失 | PARTIAL |
| RTM-053 | 字体、对比度、按钮和步骤适老 | 默认正文约 20 px、主按钮至少 56 px、对比达 AA 基线、一屏一主操作 | 所有老人端页面 | `docs/product/accessibility-guidelines.md`、`src/styles/tokens.css` | `TC-A11Y-001/002/003` | 适老规范已冻结；视觉审计与截图缺失 | PARTIAL |
| RTM-054 | 措辞和反馈适老 | 成人、直接、尊重；反馈包含发生了什么、当前状态和下一步 | 所有结果/错误状态 | `docs/product/content-guidelines.md` | `TC-CONTENT-001` 文案审计 | 文案词典已冻结；页面图缺失 | PARTIAL |
| RTM-055 | 语音识别错误后可修改 | 固定演示 9:00→8:00，提供明显“改时间”入口 | `EL-TASK-03B/04/05` | `docs/product/ai-rules.md`、`src/views.js`、`src/state/model.js` | `TC-MAIN-004` | Prompt 08 浏览器修改前后断言 | PASS |
| RTM-056 | 支持可调适老能力 | 默认界面已适老；P1 可提供标准/大字与高对比切换 | `EL-SET-01`（P1） | `src/features/settings/*` | `TC-A11Y-004` 显示切换 | P1 设置图（缺失） | FAIL |

## 8. 页面、状态与连通性

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-057 | 先列页面与状态清单 | 每项含编号、名称、角色、入口、操作、去向和原型位置 | `DOC-PAGE-MATRIX` | `docs/product/page-state-matrix.md` | `TC-DOC-006` 字段完整性 | 当前页面与状态总表 | PASS |
| RTM-058 | 覆盖范围内所有必要页面 | 入口、列表、详情、输入、编辑、确认、结果按实际流程覆盖 | 全部 `EL-*`、`FM-*` | `src/views.js` | `TC-PAGE-001` 页面覆盖 | 主流程、异常和 13 个快照均可操作；全量静态导出待 Prompt 15 | PASS |
| RTM-059 | 导航中不出现空按钮或未完成入口 | 只有 P0 和已完成 P1 可进入；Excluded 不显示 | 全局导航 | `src/app.js`、`src/views.js` | `TC-NAV-002` 可点击元素遍历 | 三套浏览器脚本覆盖全部暴露导航与场景入口 | PASS |
| RTM-060 | 覆盖首次/空状态和正常有数据状态 | 关系首次、家属空列表、已建立关系和有请求均可进入 | `EL-REL-01`、`FM-REQ-00/01` | `src/views.js`、Demo snapshots | `TC-STATE-001` 首次/空/有数据 | Initial、Scenario B、Main Flow、Pending Family | PASS |
| RTM-061 | 覆盖处理中、成功、失败和重试 | AI 处理、请求发送中、保存/回应成功、解析/发送失败和重试分别可见 | `EL-TASK-02`、`EL-SHARE-03`、`EL-EX-02/03` | `src/views.js`、`src/state/model.js` | `TC-STATE-002` 状态覆盖 | Prompt 08—10 浏览器证据 | PASS |
| RTM-062 | 覆盖修改、取消和返回 | 单字段修改、撤回请求、取消事务、非破坏性返回均可操作 | `EL-TASK-04/08`、`EL-EX-05/06` | `src/views.js`、`src/state/model.js` | `TC-STATE-003` 修改取消返回 | Prompt 09 Scenario H—I—J—K | PASS |
| RTM-063 | 页面和关键操作连通 | 入口到结果、返回修改、角色切换均无断点 | 主流程和异常 Flow | `scripts/smoke-prompt08.mjs`、`smoke-prompt09.mjs` | `TC-E2E-002` 全链接走查 | 主流程 23 步、异常 11 场景均连续通过 | PASS |
| RTM-064 | 示例内容和状态保持一致 | 修改时间后提醒、共享详情、家属端和结果页同步；取消后不显示成功 | 全部跨角色状态 | `src/state/model.js`、完整 snapshots | `TC-CONSIST-001` 跨页面一致性 | 状态测试及浏览器字段断言 | PASS |
| RTM-065 | AI、业务数据、等待和失败可以模拟且需说明 | Demo Controller 显式标注模拟，不伪装真实服务 | `DM-01/02` | `src/views.js`、`src/state/initial-state.js` | `TC-DEMO-001` 模拟标识 | Prompt 10 控制台截图和 13/13 走查 | PASS |
| RTM-066 | 统一布局、导航和视觉层级 | 390 × 844 移动 Web；老人端和家属端共享设计系统 | 全部页面 | `src/styles/*`、`src/components/*` | `TC-VISUAL-001` 一致性审计 | 65 屏自动布局审计 `issues=[]`；Web 实现待后续 | PARTIAL |
| RTM-067 | 可从预置登录状态开始但不能省略核心授权 | 不实现登录注册；保留关系确认和每次共享确认 | 首屏预置身份、`EL-REL-*` | `src/state/initial-state.js`、`src/views.js` | `TC-AUTH-001` 预置身份与授权 | Prompt 08 关系确认和单次共享均已运行 | PASS |

## 9. 核心功能说明、指标和验证

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-068 | 至少一个核心功能写清目标、输入、输出、页面、状态、规则和异常 | 核心功能为“可纠错事务 + 单次家庭请求”；目标、输入输出、页面、双状态机、权限和异常均已冻结 | `DOC-CORE-FEATURE`、`EL-TASK-*`、`EL-SHARE-*`、`FM-REQ-*` | `docs/product/01-product-charter.md`、`task-state-machine.md`、`collaboration-state-machine.md`、`permissions.md`、`ai-rules.md`、`page-state-matrix.md` | `TC-DOC-007` 核心功能字段审计 | 当前六份正式产品规则文档 | PASS |
| RTM-069 | 定义 1 个核心成功指标 | 无指导完成并获得明确协作结果的有效任务占比 | `DOC-METRICS` | `docs/product/17-product-spec.md#指标`；来源 `docs/03-reach-and-validation.md` | `TC-METRIC-001` 口径审计 | 现有指标定义 | PASS |
| RTM-070 | 定义 2—3 个过程指标及对象、口径和周期 | 最终采用纠错成功率、共享知情率、状态误判率；不得写成实测 | `DOC-METRICS` | `docs/product/17-product-spec.md#指标` | `TC-METRIC-002` 分子分母周期检查 | 正式指标字典（缺失） | FAIL |
| RTM-071 | 说明如何发现误导建议和操作失败 | 记录字段误导、状态误判、失败恢复、严重事件和用户复述 | `DOC-VALIDATION` | `docs/product/17-product-spec.md#验证` | `TC-VALID-001` 风险记录模板审计 | 正式验证方案（缺失） | FAIL |
| RTM-072 | 给出最小验证方法和下一步依据 | 约 5 组老人—家属，使用虚构任务，观察纠错、授权、回应和误判 | `DOC-VALIDATION` | `docs/03-reach-and-validation.md` | `TC-VALID-002` 方法完整性 | 当前验证方法 | PASS |
| RTM-073 | 不把预期值写成实测结果 | 所有指标标记为定义或目标；没有真实测试就不报告结果 | `DOC-VALIDATION` | `docs/00-research-method.md` | `TC-VALID-003` 实测声明扫描 | 当前研究边界 | PASS |
| RTM-074 | 自行走查完整主流程 | 按冻结数据从关系建立走到老人看到小梅接受 | `DOC-WALKTHROUGH-MAIN` | `docs/validation/prompt08-main-flow.md` | `TC-E2E-001` | 23 步运行结果和截图；正式综合报告待 Prompt 12 | PARTIAL |
| RTM-075 | 走查修改或取消流程 | 覆盖纠错、撤回请求、取消事务和已发送后修改 | `DOC-WALKTHROUGH-CHANGE` | `docs/validation/prompt09-exception-flows.md` | `TC-E2E-003` | Scenario H—I—J—K；正式综合报告待 Prompt 12 | PARTIAL |
| RTM-076 | 走查失败或无法继续流程 | 覆盖必要信息缺失、AI 失败、发送失败和重试 | `DOC-WALKTHROUGH-FAIL` | `docs/validation/prompt09-exception-flows.md` | `TC-E2E-004` | Scenario C—D—E；正式综合报告待 Prompt 12 | PARTIAL |
| RTM-077 | 多角色产品走通角色间协作 | 老人发起、家属回应、老人获知，双端状态一致 | `DOC-WALKTHROUGH-ROLE` | `docs/validation/prompt08-main-flow.md`、Prompt 09 记录 | `TC-E2E-005` | 接受、拒绝、建议、撤回和取消均双端通过 | PARTIAL |
| RTM-078 | 记录步骤、实际结果和已知问题 | 逐步记录预期、实际、截图、问题、严重度和处理 | `DOC-WALKTHROUGH-REPORT` | `docs/validation/*` | `TC-QA-001` 报告字段检查 | 分阶段记录已存在；正式综合报告待 Prompt 12 | PARTIAL |

## 10. 交付物与 Docker

| ID | 原题要求 | 产品规则 | 页面/状态 | 实现位置 | 测试用例 | 静态证据 | 当前状态 |
|---|---|---|---|---|---|---|---|
| RTM-079 | 产品说明覆盖用户、依据、范围、流程、AI、指标和验证 | 最终合并为一份与 Release 一致的正式说明 | `DOC-PRODUCT-SPEC` | `docs/product/17-product-spec.md` | `TC-DOC-008` 章节覆盖 | 正式产品说明（缺失） | FAIL |
| RTM-080 | 完整原型图按页面与状态编号整理 | 每个必要页面和关键状态可独立查看 | `DOC-STATIC-INDEX` | `artifacts/static/index.md`、`artifacts/static/*.png`、PDF | `TC-STATIC-001` 页面矩阵一一对应 | PNG/PDF（缺失） | FAIL |
| RTM-081 | 可操作 Web 原型和可编辑源码 | 全部 P0 连续可操作，使用本地确定性状态和虚构数据 | 全部 `EL-*`、`FM-*`、`DM-*` | `src/*` | `TC-E2E-*`、`TC-UNIT-*` | 主流程、异常和 Demo Controller 均已运行验证 | PASS |
| RTM-082 | 设计工具存在时提供源文件或访问方式 | 规范源使用仓库内 HTML/CSS；Figma 文件作为补充参考 | `DOC-DESIGN-SOURCE` | `artifacts/design/local-prototype/`、`artifacts/design/figma-source.md` | `TC-DELIVERY-001` 源文件可访问 | 可编辑设计源、生成脚本、Figma URL 和审计证据 | PASS |
| RTM-083 | 提供 Dockerfile | 多阶段构建或等效静态镜像，无秘密和外部服务 | `DOC-DOCKER` | `Dockerfile` | `TC-DOCKER-001` 镜像构建 | Dockerfile（缺失） | FAIL |
| RTM-084 | 提供 Docker Compose 配置 | 单命令启动前端，端口和健康检查明确 | `DOC-DOCKER` | `compose.yaml` | `TC-DOCKER-002` Compose 启动 | Compose 文件（缺失） | FAIL |
| RTM-085 | `docker compose up --build` 后浏览器可完成演示 | 干净环境、无公网、无密钥完成主流程和异常 | `WEB-RUNNING` | Docker 运行环境 | `TC-DOCKER-003` 浏览器冒烟 | 启动日志和截图（缺失） | FAIL |
| RTM-086 | README 写明启动与访问 | 包含命令、地址、端口、要求、结构和已知限制 | `DOC-README` | `README.md` | `TC-DOC-009` README 启动检查 | 最终 README（当前仅研究索引） | FAIL |
| RTM-087 | Demo Guide 写明尺寸、角色、案例、关键状态和重置 | 使用固定时钟、张阿姨/小梅、场景入口和一键重置 | `DOC-DEMO-GUIDE` | `docs/delivery/demo-guide.md` | `TC-DOC-010` 演示说明完整性 | Demo Guide（缺失） | FAIL |
| RTM-088 | 演示不依赖私人账号、模型额度或密钥 | 所有服务本地模拟，无登录、外部 API 或真实通知 | `DM-02`、`WEB-OFFLINE` | `src/adapters/mock/*`、Docker | `TC-OFFLINE-001` 断网演示 | 断网运行记录（缺失） | FAIL |
| RTM-089 | 静态图、Web、文档对应同一版本 | Release 版本号写入 UI、导出索引、README 和产品说明 | `DOC-RELEASE` | `docs/RELEASE_STATUS.md`、构建元数据 | `TC-RELEASE-001` 版本一致性 | Release 索引（缺失） | FAIL |
| RTM-090 | 页面清单无遗漏和断开跳转 | 页面矩阵、路由、静态导出和 E2E 覆盖集合完全一致 | `DOC-PAGE-MATRIX`、全路由 | `scripts/check-coverage.*` 或测试等效实现 | `TC-DELIVERY-002` 集合差异检查 | 覆盖报告（缺失） | FAIL |

## 11. 当前汇总

| 状态 | 含义 | 当前数量 |
|---|---|---:|
| PASS | 当前要求已有足够仓库证据 | 62 |
| PARTIAL | 已有规则或视觉证据，但运行/导出证据仍不完整 | 13 |
| FAIL | 实际操作、实现、运行测试或交付证据尚不存在 | 15 |
| 合计 | 全部追踪项 | 90 |

数量必须通过脚本或人工复核与矩阵行一致；后续每个 Prompt 只在产生实际证据后更新状态。

## 12. Prompt 02 Gate

| Gate | 状态 | 证据 |
|---|---|---|
| 原题明确要求已拆成可验收项 | PASS | RTM-001—RTM-090 |
| 每项包含产品规则 | PASS | “产品规则”列无空项 |
| 每项包含页面或状态 | PASS | “页面/状态”列无空项 |
| 每项包含实现位置 | PASS | 当前或冻结的目标路径 |
| 每项包含测试用例 | PASS | `TC-*` ID 无空项 |
| 每项包含静态证据位置 | PASS | 当前证据或明确目标位置 |
| 缺失证据如实标记 | PASS | 有画面无运行证据的项目为 `PARTIAL`；完全无当前证据的项目为 `FAIL` |
| P0 无“后面再说”空项 | PASS | 所有 P0 已有规则、状态、路径、测试和证据目标 |

`REQUIREMENT_MATRIX_STATUS=PASS` 只表示追踪矩阵完整，不表示产品已经通过验收。`FINAL_ACCEPTANCE_STATUS` 仍为 `FAIL`。
