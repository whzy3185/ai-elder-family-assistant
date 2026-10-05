# 接口与 GUI 暴露防护准则

## 1. 适用范围

考核原型不需要真实后端，本阶段最安全的默认方案是：静态前端 + 本地虚构状态 + 无外部网络请求。本文同时定义未来接入后端时的最低安全准则。

“不暴露接口”不能理解为隐藏 URL。浏览器发出的请求天然可被用户观察；安全目标应是：即使接口地址被发现，未授权用户仍不能读取、修改或触发不属于自己的资源。

## 2. 原型阶段安全架构

```text
Browser
  -> Static Nginx container
  -> Local mock adapter
  -> In-memory/sessionStorage fictional state
```

- 不接真实 AI、数据库、短信、推送或账号系统；
- 不包含任何 API Key、OAuth token 或真实服务域名；
- 演示状态重置只影响虚构本地数据；
- 默认不把数据写入持久化浏览器存储；如需刷新保留，使用可清空的 `sessionStorage`；
- Docker 镜像只包含构建产物和 Nginx 配置。

## 3. 未来后端推荐架构

```text
Web/PWA
  -> same-origin BFF/API Gateway
      -> Identity and consent service
      -> Task/collaboration service
      -> AI adapter
      -> Notification adapter
```

前端只访问同源 BFF。AI、短信和推送供应商凭据只存在于服务端密钥管理系统中。

## 4. 身份、授权和对象隔离

OWASP API Security Top 10 把对象级授权、认证、字段级授权、资源消耗和功能级授权列为主要风险。[来源](https://api-security.owasp.org/editions/2023/en/0x11-t10/)

必须执行：

- 默认拒绝，按角色和关系显式授权；
- 每个读取或修改对象的接口都在服务端验证当前用户、家庭关系、事务关系和允许动作；
- 不信任前端提交的 `elderId`、`familyId`、`role` 或 `isAdmin`；
- UUID/随机 ID 只能降低枚举便利，不能替代授权；
- 响应使用字段白名单，不序列化完整数据库对象；
- 家属只获得本次授权共享的字段；
- 老人撤回后，新的访问立即被拒绝；
- 管理功能使用独立权限域和独立审计，不与普通控制器混用；
- 对跨家庭读取、修改和状态操作编写自动化反向测试。

## 5. 认证与会话

- Web 优先使用 `Secure`、`HttpOnly`、`SameSite=Lax/Strict` Cookie；
- 短期会话 + 可撤销刷新机制；
- 不在 `localStorage` 保存长期访问令牌；
- 敏感操作要求近期认证或明确二次确认；
- 关系绑定邀请使用一次性、短时、限定用途的 token；
- 登录、邀请和恢复接口限速并记录异常；
- 账号枚举场景返回一致文案。

## 6. 接口契约

### 基本规范

- 基础路径：`/api/v1`；
- JSON 使用 UTF-8，时间使用 ISO 8601 UTC 并在客户端本地化；
- 变更操作支持 `Idempotency-Key`；
- 乐观并发使用 `version` 或 ETag；
- 错误采用 `application/problem+json`，不返回堆栈、SQL、内部主机名或供应商响应正文；
- 列表默认分页和字段最小化；
- 所有输入通过 schema 白名单验证，禁止 mass assignment；
- 上传类型、大小、数量和扫描策略显式限制。

### 核心接口示例

| 接口 | 老人 | 指定家属 | 关键校验 |
|---|---|---|---|
| `POST /tasks` | 创建 | 禁止 | 内容 schema、幂等 |
| `PATCH /tasks/{id}` | 仅自己的事务 | 禁止直接修改 | 对象授权、允许字段、版本 |
| `POST /tasks/{id}/requests` | 创建并确认共享 | 禁止 | 同意回执、接收人关系 |
| `GET /requests/{id}` | 自己发出的 | 仅指定接收者 | 对象 + 字段级授权 |
| `POST /requests/{id}/responses` | 禁止代答 | 指定接收者 | 状态、幂等、过期校验 |
| `POST /requests/{id}/cancel` | 可取消 | 禁止 | 状态转换、审计 |

### 错误示例

```json
{
  "type": "https://example.invalid/problems/request-not-actionable",
  "title": "当前请求不能继续处理",
  "status": 409,
  "code": "REQUEST_ALREADY_CANCELLED",
  "correlationId": "public-safe-id"
}
```

## 7. 防止密钥和接口细节暴露

- 前端环境变量只允许非敏感公开配置；`VITE_*` 等构建变量一律视为公开；
- 服务端凭据使用密钥管理或运行时注入，不进入 Git、镜像层和 CI 日志；
- 禁止把服务端错误原样传给客户端；
- 生产环境 API 文档、管理端、健康详情和 metrics 默认不公开；确需使用时独立认证和网络限制；
- GraphQL introspection、调试端点、测试账号和 mock 路由不得进入生产配置；
- CORS 使用精确来源列表；不能用 `*` 搭配凭据；
- 使用 CSP、HSTS、`X-Content-Type-Options`、`Referrer-Policy` 和 frame 限制；
- 公共 source map 默认不部署；内部错误追踪使用受控上传；
- 日志对 token、Cookie、手机号、地址和语音转写做结构化脱敏，且不记录请求全文。

## 8. 防止 GUI、调试与管理能力暴露

仅把元素设为 `display:none` 或隐藏导航不能构成安全控制。必须同时做到：

1. 演示控制栏使用独立构建标志，并在非演示构建中从 bundle 删除；
2. 管理路由在服务端执行权限检查，不能仅依赖前端路由守卫；
3. 未发布功能通过服务端权限化 feature flag 控制；
4. 禁止在 HTML 注释、JS 常量、前端配置中留下管理员 URL、测试密码或内部域名；
5. 生产构建关闭 React/Vue 调试工具集成、详细错误页和测试 fixture；
6. 管理端使用独立入口、独立会话受众和更严格认证；
7. 公开 Web 服务器使用明确文件 allowlist，禁止目录列表、`.git`、源文件和备份文件访问；
8. CI 检查构建产物中是否出现 `secret`、测试账号、内部域名和 source map。

## 9. 隐私与数据生命周期

《个人信息保护法》强调目的明确、最小必要、便捷撤回，并把医疗健康、金融账户和行踪轨迹列为敏感个人信息。[来源](https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm)

- 创建每个字段前说明用途、接收者和保留期；
- 关系同意、单次共享同意和敏感信息同意分别记录；
- 撤回同意的入口与开启入口同等容易；
- 事务完成后按约定期限删除或匿名化；
- 语音原始音频默认不保留；如需改进模型，另行选择加入；
- 不把真实家庭数据用于演示、开发或通用模型训练；
- 提供查询、更正、导出、删除和注销流程。

## 10. 发布前安全门槛

- secret scanning 无发现；
- 依赖漏洞扫描无高危未处置项；
- 跨家庭 BOLA/BFLA 测试通过；
- GUI 调试与管理入口在生产构建中不可达；
- 错误响应不含内部细节；
- CSP 和安全响应头检查通过；
- 日志不包含凭据或未授权个人信息；
- 关系撤回后权限立即失效；
- 供应商故障不会让系统显示假成功。

