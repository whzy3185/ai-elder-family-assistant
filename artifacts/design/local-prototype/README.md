# Repository-native 高保真设计源

这是 Prompt 06 的规范设计源，不依赖 Figma、私人账号、模型额度或外部服务。

## 使用

```powershell
node artifacts/design/local-prototype/generate-data.mjs
```

随后用浏览器打开 `index.html`。完整画廊显示 65 个状态；在地址后增加 `?screen=FM-REQ-01` 可独立查看指定画面。

## 文件

- `generate-data.mjs`：从四组 Figma 生成脚本读取冻结页面数据，验证总数和重复 ID；
- `screens.generated.js`：65 个页面的生成数据；
- `index.html`、`styles.css`、`app.js`：可编辑高保真画廊；
- `audit-layout.mjs`：通过 Chromium DevTools Protocol 检查数量、唯一 ID、390×844 画布、内部溢出、字体、按钮高度和下一步操作。

## 证据

代表性浏览器截图位于 `artifacts/design/review-local/`。全量独立 PNG 在 Prompt 15 Release 冻结时导出；此阶段以完整画廊、逐屏路由和自动布局审计作为 65 个画面的设计证据。
