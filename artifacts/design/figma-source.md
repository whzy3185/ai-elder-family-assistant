# 阶段 06 Figma 设计源

更新时间：2026-10-06（Asia/Shanghai）

## 1. 规范源与补充设计文件

阶段 06 的规范源已切换为 `artifacts/design/local-prototype/`，它包含全部 65 个画面、逐屏访问、可编辑 HTML/CSS 和自动布局审计，不依赖外部额度。

- 文件：[AI 老年家庭协作助手｜阶段 06 高保真](https://www.figma.com/design/mrG3v1XKOEaTMztedG1zpt)
- File key：`mrG3v1XKOEaTMztedG1zpt`
- 主要设备：移动端 `390 × 844`
- 字体：`Noto Sans SC`
- 页面：`00 Foundations`、`01 Product Screens`、`02 Demo`
- Starter 计划最多允许三个页面，因此老人、关系和家属画面以三个独立 Board 放在同一 Product Screens 页面；此约束不影响画面独立定位。

## 2. 画面清单

| Board | Figma Node | 画面数 | 内容 |
|---|---:|---:|---|
| `Board / Elder` | `7:18` | 36 | 事务、AI 纠错、分享、未回应、撤回、取消、失败和设置 |
| `Board / Relationship` | `8:329` | 12 | 双方建立关系、权限说明、拒绝、二维码失效和解除关系 |
| `Board / Family` | `8:513` | 12 | 接受、拒绝、建议改期、请求变化、撤回和发送失败 |
| `Board / Demo` | `8:697` | 5 | 角色切换、预置场景和重置 |
| **合计** |  | **65** | 与 `page-state-matrix.md` 精确一致 |

## 3. 设计系统

- 变量集合：Primitives `VariableCollectionId:3:4`、Semantic `VariableCollectionId:3:5`、Size `VariableCollectionId:3:6`；
- 组件：Button `3:75`、StatusBadge `3:86`、RoleBar `3:99`、FieldRow `3:100`、InfoCard `3:103`；
- 主操作按钮高 `56 px`；正文采用适老 `20 px` 基线；
- 不依赖远程 UI Kit。Material 3 和 Simple Design System 已检查，但其字体和适老尺寸不满足冻结规则，因此只保留本地令牌和组件。

## 4. 可编辑源与复现

Figma 生成脚本位于 `artifacts/design/scripts/`：

1. `01-foundations.js`
2. `02-elder-screens.js`
3. `03-relationship-screens.js`
4. `04-family-screens.js`
5. `05-demo-screens.js`
6. `06-structural-audit.js`

状态账本位于 `artifacts/design/figma-state.json`。脚本是可编辑设计源，但当前脚本按“新建 Board”工作，不应在同一文件无条件重复运行。

## 5. Figma 快照限制

三组 Figma 代表性截图归档在 `artifacts/design/review/`。其中 `FM-REQ-01` 仍可能保留旧长文案，因为同步时 Starter 计划达到 MCP 调用上限。该问题已在仓库内规范源修复，并由 `review-local/FM-REQ-01.png` 与 65 屏自动审计验证。

因此 Figma 文件仅作为早期可编辑补充，不再决定 `SPEC_FREEZE`；规范版本以仓库内设计源和 Design Audit 为准。
