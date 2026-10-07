# Release 1.0.0 冻结与静态导出

日期：2026-10-07（Asia/Shanghai）。源码冻结commit：`e3144cc75796f0b3179f4daa55f3f9ace9474f9e`。这是UI/运行源码基线；后续文档、截图和验证提交不改变此运行源码。最终仓库SHA在Prompt23另行报告，不能把源码基线当成最终提交SHA。

Docker已真实重建，容器healthy，镜像89b05b3b6dfb；URL `http://127.0.0.1:8080`。本阶段从该容器Web通过编号入口导出65张全长截图，页面覆盖集合与Page Matrix精确一致。

- `exports/screens/`：65张独立编号图片；`audit.json`为同版65页/两种视口的实际检查结果。
- `exports/prototype-index.md`、`.json`：编号、名称、角色、状态、图片、PDF页码、Web入口和测试映射。
- `exports/prototype-pages.pdf`：69页，1封面+3索引+65独立画面；书签按编号可定位。长页按图片高度保留全长，不截掉操作。
- `exports/source-manifest.json`：前端、服务器、包与Docker配置逐文件SHA-256。同版性通过该清单核对，不依赖自引用的最终commit。

PDF已嵌入中文字形。首版使用系统CID字体导致渲染器缺少中文语言包，修复后Poppler渲染无报错；封面、索引、首页和长控制台原尺寸渲染检查通过，页面ID逐页提取校验65/65通过。

DM-01为各页底部演示工具；DM-02/03共用控制台布局，分别定位场景和时钟。每个编号仍有独立导出图片，不用旧设计稿替代。编号快照只供演示控制层使用，主流程仍可从Reset连续操作。

维护：冻结后若修改UI、规则或文案，须更新版本、受影响截图、PDF、文档并重新验证。本阶段还不代表独立验收或最终交卷已完成。

PROMPT_15_GATE_STATUS=PASS
