# 阶段 11 Docker 启动验证

验证日期：2026-10-07（Asia/Shanghai）
版本：`web-prototype-0.11.0`

## 1. Gate 结论

`VALIDATION_11_STATUS=PASS`

项目已通过真实 Docker Engine 构建、Compose 启动、容器健康检查、Windows 浏览器 HTTP 访问、子路由刷新、23 步主流程、13 个 Demo 场景、双角色快捷入口和全量 Reset 验证。

## 2. 验证环境

| 项目 | 实测值 |
|---|---|
| Docker Engine | 29.8.2，Linux/amd64 |
| Docker Compose | 5.1.4 |
| 存储驱动 | overlay2 |
| 验证 Engine 位置 | `E:\WSL\CodexDocker` |
| 项目位置 | E 盘仓库 |
| 浏览器 | Microsoft Edge 154（Chromium headless） |

本机 Docker Desktop 4.94.0 在 Windows 26200 上因 `sailor-ingest.sock` 的 AF_UNIX 宿主机缺陷无法启动。本次没有使用“恢复出厂设置”，也没有把该宿主机故障当作项目失败；改用 E 盘独立 WSL Docker Engine 执行了同一份 `Dockerfile` 和 `compose.yaml` 的真实验证。评审启动命令不受该验证环境差异影响。

## 3. 构建与启动

项目根目录执行：

```sh
docker compose up --build -d
```

实测结果：

- Compose 配置解析成功；
- `node:22.20.0-alpine3.22` 基础镜像按 manifest digest `sha256:dbcedd8a…25af` 锁定；
- `npm ci --omit=dev --ignore-scripts` 成功，审计结果为 0 vulnerabilities；
- 最终镜像 ID：`sha256:180471e2ec666b519af20a3d020abb80a12cde640d7425b96a5c4bf14eee5ac5`；
- 容器：`ai-elder-family-assistant-prototype-1`；
- 状态：`Up (healthy)`；
- 端口：`0.0.0.0:8080->8080/tcp` 与 `[::]:8080->8080/tcp`；
- 容器日志：`Prototype running at http://localhost:8080`。

## 4. HTTP 与子路由

| URL | 结果 | 说明 |
|---|---:|---|
| `http://localhost:8080/` | 200 | 返回原型入口 HTML |
| `http://localhost:8080/elder/tasks/active` | 200 | 无扩展名子路由回退到入口，刷新正常 |
| `http://localhost:8080/family/requests/pending` | 200 | 家属子路由回退到入口，刷新正常 |
| `http://localhost:8080/src/app.js` | 200 | 静态 JS 正常返回 |
| `http://localhost:8080/missing.js` | 404 | 缺失静态资源不会被错误回退 |

首次实测发现子路由返回 404，已在 `server.mjs` 增加仅针对无扩展名路径的 SPA fallback；重新 build 后以上检查全部通过。

## 5. Docker 版本浏览器走查

### 5.1 主流程

通过 `APP_URL=http://127.0.0.1:8080 node scripts/smoke-main-flow-baseline.mjs` 实际连续点击 23 步：

关系建立 → 老人输入 → 固定识别错误 → 单字段改正 → 保存提醒 → 审阅最小共享 → 发送请求 → 家属接受 → 老人查看结果 → 提醒触发 → 老人确认完成。

结果：

```json
{"status":"PASS","steps":23,"taskStatus":"COMPLETED","requestStatus":"ACCEPTED","externalRequests":0}
```

截图：[docker-main-flow-baseline.png](../../artifacts/qa/docker-main-flow-baseline.png)

### 5.2 Demo Controller 与 Reset

通过 `APP_URL=http://127.0.0.1:8080 node scripts/smoke-review-tools-baseline.mjs` 实际验证：

- 13 个规定场景；
- 老人/家属 2 个角色快捷入口；
- 固定演示时钟；
- `Reset All Demo Data` 恢复初始未绑定、无事务、无请求状态。

结果：

```json
{"status":"PASS","scenarios":13,"roleShortcuts":2,"reset":true}
```

截图：[docker-review-tools-baseline.png](../../artifacts/qa/docker-review-tools-baseline.png)

## 6. 运行约束验证

| 检查 | 实测结果 |
|---|---|
| 宿主机 Node | 评审运行不需要；Node 仅在镜像内 |
| 后端与数据库 | 无 |
| API Key、私人账号和真实外部服务 | 无；完整主流程运行时外部资源请求数为 0 |
| 绝对路径 | Dockerfile、Compose 和 README 启动命令均无本机绝对路径 |
| 未提交依赖 | 使用提交的 `package-lock.json` 与 `npm ci` |
| 容器用户 | `node`，非 root |
| 根文件系统 | `read_only=true`；向 `/app` 写入实测被拒绝 |
| 临时写空间 | 仅 `/tmp` 16 MiB tmpfs，写入探针通过 |
| 宿主机挂载 | `Mounts=[]`，不依赖本地未提交文件 |
| 单元与状态测试 | 21/21 PASS |

## 7. 复现命令

```sh
docker compose up --build
```

浏览器访问 `http://localhost:8080`。停止演示：

```sh
docker compose down
```

## 8. 结论

阶段 11 所有 Gate 条件均已有实际运行证据。Docker 交付不依赖宿主机 Node、后端、数据库、密钥、私人账号、绝对路径或未提交依赖，可以进入 阶段 12 完整功能走查。
