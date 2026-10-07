# 阶段 06 Design Audit

审计时间：2026-10-06（Asia/Shanghai）  
审计对象：仓库内 HTML/CSS 高保真设计源；Figma 文件作为补充参考  
审计结论：`PASS`  
规格冻结：`SPEC_FREEZE = TRUE`

## 1. 覆盖完整性

| 检查 | 结果 | 证据 |
|---|---|---|
| 页面矩阵编号 | PASS | 页面矩阵 65 项，设计脚本 65 项，集合精确一致 |
| 实际画面 | PASS | 仓库内画廊共 65 个独立 `390 × 844` 画面；Figma 同时保留 65 个 Frame |
| 重复编号 | PASS | `duplicateIds=[]` |
| 老人端 | PASS | 36 个画面 |
| 关系建立与解除 | PASS | 12 个画面，含双方角色 |
| 家属端 | PASS | 12 个画面 |
| Demo Controller | PASS | 5 个画面 |
| 字体 | PASS | 65 个画面无非 `Noto Sans SC` 文本 |
| 主操作触控高度 | PASS | 结构审计无低于 `56 px` 的 Button 实例 |
| 下一步 | PASS | 每个画面至少存在一个明确按钮 |
| 直接子层溢出 | PASS | 结构审计 `issues=[]` |

结构审计脚本：`artifacts/design/scripts/06-structural-audit.js` 和 `artifacts/design/local-prototype/audit-layout.mjs`。本地浏览器审计结果为 `screenCount=65`、`uniqueCount=65`、`issues=[]`。

## 2. 业务一致性审计

| 必查项 | 对应画面 | 结果 | 判断 |
|---|---|---|---|
| 修改时间后提醒同步 | `EL-TASK-03B` → `EL-TASK-04` → `EL-TASK-05` | PASS | 8:00 / 7:30 修正为 9:00 / 8:30 |
| 家属端显示最新时间 | `FM-REQ-03B`、`EL-SHARE-08` | PASS | 旧 9:00 请求失效，新 14:00 需重新发送 |
| 取消后无残余请求 | `EL-EX-06A/B`、`FM-EX-02` | PASS | 事务、提醒和请求均结束，家属不能继续回应 |
| 撤回后个人提醒仍在 | `EL-EX-05A/B` | PASS | 明确保留 8:30 提醒，只撤回陪同请求 |
| 未回应是真实状态 | `EL-SHARE-04B`、`EL-EX-04` | PASS | 不把未回应解释为拒绝或接受 |
| AI 失败仍可继续 | `EL-EX-02A/B` | PASS | 保留原话，可重试或手动填写，不创建假事务 |
| 拒绝结果清楚 | `EL-SHARE-06`、`FM-REQ-04A/B` | PASS | 家属不能陪同不等于取消老人事务 |
| 改期建议不直接改事务 | `FM-REQ-05A/B`、`EL-SHARE-07` | PASS | 原时间维持 9:00，必须由老人决定 |
| ACCEPTED 不等于 COMPLETED | `FM-REQ-03A`、`EL-SHARE-05`、`EL-TASK-09A/B` | PASS | 家属接受只表示陪同；事务完成需老人另行确认 |
| 关系建立不等于永久共享 | `EL-REL-02A/03`、`FM-REL-03` | PASS | 每件事务单独确认，仅共享五项信息 |
| 老人知道发生什么和下一步 | 全部老人端画面 | PASS | 状态 Badge、结果卡和至少一个下一步按钮同时存在 |

## 3. 视觉抽查

| 抽查画面 | 结果 | 证据 |
|---|---|---|
| `EL-TASK-03B` 识别错误 | PASS | `artifacts/design/review-local/EL-TASK-03B.png`；原话、错误时间、提醒和纠正入口清楚 |
| `EL-SHARE-07` 改期建议 | PASS | `artifacts/design/review-local/EL-SHARE-07.png`；层级、按钮和原时间提示清楚 |
| `EL-REL-02A` 权限说明 | PASS | `artifacts/design/review-local/EL-REL-02A.png`；可见/不可见边界清楚 |
| `FM-REQ-01` 家属请求 | PASS | `artifacts/design/review-local/FM-REQ-01.png`；修正文案无挤压，权限和三个回应清楚 |
| `DM-01` Demo 入口 | PASS | `artifacts/design/review-local/DM-01.png`；预置案例、角色入口和模拟属性清楚 |

## 4. P0 修正闭环

`DA-P0-001` 已关闭：`04-family-screens.js` 将 `FM-REQ-01` 字段缩短为“事项、时间、地点、陪同请求”，仓库内规范画面已重新生成；浏览器截图和全量自动布局审计确认无挤压。Figma Starter 快照仍可能显示旧文案，但它已降级为补充参考，不再是规范源或 Gate 依赖。

## 5. Gate 判定

- 页面和状态完整：`PASS`；
- 业务规则审计：`PASS`；
- 视觉结构审计：`PASS`；
- 所有 P0 UI 问题在规范设计源修复并验证：`PASS`；
- 阶段 06 Gate：`PASS`；
- `SPEC_FREEZE = TRUE`。

阶段 06 可以提交并进入 阶段 07。Figma 外部额度不再阻碍交付，后续 Web 和静态导出均以仓库内规范设计源为基线。
