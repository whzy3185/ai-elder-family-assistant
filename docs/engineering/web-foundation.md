# 阶段 07 Web 基础架构

更新时间：2026-10-06（Asia/Shanghai）

## 1. 技术选择

使用浏览器原生 HTML、CSS 和 ES Modules，不引入框架、构建器或第三方运行依赖。

选择原因：

- 状态规模有限，原生模块足以表达；
- 没有依赖安装和版本冲突；
- 可直接由 Node 静态服务器或后续 Nginx 容器提供；
- 无后端、数据库、API Key、真实 AI 或私人账号；
- 所有演示数据都能离线、确定性复现。

## 2. 目录

| 位置 | 职责 |
|---|---|
| `index.html` | 应用入口 |
| `src/app.js` | 事件分发和渲染入口 |
| `src/views.js` | App Shell、老人端、家属端、关系页和 Demo Controller 基础视图 |
| `src/state/initial-state.js` | 固定用户、时钟和初始模型 |
| `src/state/model.js` | 纯状态迁移和不变量验证 |
| `src/state/store.js` | 同一状态容器、订阅和 LocalStorage 持久化 |
| `src/styles.css` | 适老移动 Web 视觉实现 |
| `server.mjs` | 无依赖静态服务器 |
| `tests/state-model.test.mjs` | 状态模型单元测试 |
| `scripts/smoke-foundation-baseline.mjs` | 浏览器主路径与刷新持久化走查 |

## 3. 统一状态模型

顶层字段包括：

- `relationship`
- `task`
- `collaborationRequest`
- `currentRole`
- `demoClock`
- `demoScenario`

另有 `currentView` 负责界面导航，`schemaVersion` 用于后续迁移。老人端和家属端只切换 `currentRole/currentView`，不会复制业务对象，因此读取的是同一份 `task`、`relationship` 和 `collaborationRequest`。

## 4. 当前已实现范围

- App Shell 和四项底部导航；
- 老人首页、事务输入、处理中、理解确认、保存结果；
- 家属空请求页；
- 关系状态页和模拟双方确认；
- Demo Controller 基础页与重置；
- LocalStorage 刷新持久化；
- 固定 2026-10-06 20:00 演示时钟；
- 固定 9:00 事务与 8:30 提醒；
- 本地确定性解析，不调用真实 AI。

异常、完整关系建立、单次共享和家属回应留给 阶段 08—10，未通过空按钮假装完成。

## 5. 验证结果

```text
npm test
4 tests passed

scripts/smoke-foundation-baseline.mjs
PASS / 10 steps
```

浏览器走查覆盖：初始首页、输入、处理中、确认、提醒同步、保存、刷新持久化、家属角色切换、共享状态读取和返回老人首页。证据截图为 `artifacts/qa/foundation-main-flow-baseline.png`。
