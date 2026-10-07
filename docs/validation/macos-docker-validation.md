# Mac 本机 Docker 复核

日期：2026-10-07（Asia/Shanghai）。源码输入：research / `0f35b0e1530c7f7a42e381ba1d3ee8feab84adbc`，Web 0.11.0。

## 环境与启动

- Apple Silicon / macOS，Colima 0.10.3，独立 profile `elder-demo`；2 CPU / 2 GiB。
- Docker 客户端 29.8.1；Engine 29.5.2 / Linux arm64；Compose 5.5.1。
- 已通过 GitHub 连接恢复 99 个文件，并逐文件核验 Git blob SHA；原始提交和 tree SHA 精确一致。本地为原始 research 提交的浅检出，远端历史保持原样。
- `docker compose -f compose.yaml -f compose.local.yaml up --build -d --wait` 实际执行成功；本机覆盖配置仅绑定 `127.0.0.1:8080`。
- 镜像 `4ab23dceba25`；容器 `ai-elder-family-assistant-prototype-1` 为 healthy。
- 基础镜像 digest 保持原值；`npm ci --omit=dev --ignore-scripts` 成功、0 vulnerabilities。
- 容器用户 node，根文件系统只读，无宿主机挂载。

## 实测

| 检查 | 实际结果 |
|---|---|
| `/` | 200 |
| `/elder/tasks/active` | 200，SPA fallback |
| 原有 Node 状态测试 | 21/21 PASS |
| Docker URL 主流程 | 23 步 PASS，task=COMPLETED、request=ACCEPTED，外部资源请求=0 |
| Docker URL 异常分支 | A、B、C、D、E、F、G、H、I、J、K，11 项 PASS |
| Demo Controller | 13 场景、2 角色入口、Reset PASS |

浏览器使用独立 Chrome 测试 profile。截图位于 `artifacts/qa/macos-docker/`。异常脚本改为支持 APP_URL 和 SCREENSHOT_DIR，避免只能测试 4173 或覆盖旧证据。

## 限制与后续

以上仅证明原有指定脚本的结果。代码与规格的全面一致性、65 个页面覆盖、适老审计、正式静态导出和独立验收仍须在 Prompt 12–24 完成，不能由此推断整个项目已验收。

本机虚拟机和镜像首次下载使用已有系统代理；前端运行不依赖该代理、账号、密钥或外部服务。
