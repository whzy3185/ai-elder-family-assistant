# Release 1.0.0 完整原型索引

源码冻结：`e3144cc75796f0b3179f4daa55f3f9ace9474f9e`。65/65 项来自同版 Docker Web 全长截图。

Web 入口统一为：演示控制 → 按编号查看全部页面与状态 → 选择编号。加载会替换当前模拟数据。

DM-01 是每页底部角色工具；DM-02/DM-03 共用控制台布局，分别定位场景及固定时钟，不省略状态。

| 页面编号 | 名称 | 角色 | 状态 | 图片 | PDF 页 | Web 入口 | 测试 |
|---|---|---|---|---|---:|---|---|
| EL-TASK-00 | 首页空状态 | 老人 | 还没有事务 | [EL-TASK-00](screens/EL-TASK-00.png) | 5 | 控制台编号 EL-TASK-00 | `TC-STATE-001`；全页实测 |
| EL-TASK-01 | 输入事务 | 老人 | 等待输入 | [EL-TASK-01](screens/EL-TASK-01.png) | 6 | 控制台编号 EL-TASK-01 | `TC-MAIN-001`、`TC-AI-003`；全页实测 |
| EL-TASK-02 | AI 处理中 | 老人 | 处理中 | [EL-TASK-02](screens/EL-TASK-02.png) | 7 | 控制台编号 EL-TASK-02 | `TC-MAIN-002`；全页实测 |
| EL-TASK-03A | AI 理解结果（无已知错误） | 老人 | 尚未保存，需要你确认 | [EL-TASK-03A](screens/EL-TASK-03A.png) | 8 | 控制台编号 EL-TASK-03A | `TC-AI-005`；全页实测 |
| EL-TASK-03B | 识别错误状态 | 老人 | 识别错误 | [EL-TASK-03B](screens/EL-TASK-03B.png) | 9 | 控制台编号 EL-TASK-03B | `TC-MAIN-003/004`；全页实测 |
| EL-TASK-04 | 修改单字段 | 老人 | 只修改时间 | [EL-TASK-04](screens/EL-TASK-04.png) | 10 | 控制台编号 EL-TASK-04 | `TC-MAIN-004`；全页实测 |
| EL-TASK-05 | 确认事务 | 老人 | 确认后才会记好 | [EL-TASK-05](screens/EL-TASK-05.png) | 11 | 控制台编号 EL-TASK-05 | `TC-MAIN-005/006`；全页实测 |
| EL-TASK-06 | 保存个人提醒结果/事务详情 | 老人 | 个人事务已保存 | [EL-TASK-06](screens/EL-TASK-06.png) | 12 | 控制台编号 EL-TASK-06 | `TC-REM-001`；全页实测 |
| EL-TASK-07 | 提醒触发 | 老人 | 提醒已触发 | [EL-TASK-07](screens/EL-TASK-07.png) | 13 | 控制台编号 EL-TASK-07 | `TC-REM-002`；全页实测 |
| EL-TASK-08 | 修改已共享事务 | 老人 | 请先了解对陪同安排的影响 | [EL-TASK-08](screens/EL-TASK-08.png) | 14 | 控制台编号 EL-TASK-08 | `TC-VERSION-001`；全页实测 |
| EL-TASK-09A | 确认事务完成 | 老人 | 需要你确认 | [EL-TASK-09A](screens/EL-TASK-09A.png) | 15 | 控制台编号 EL-TASK-09A | `TC-COMPLETE-001`；全页实测 |
| EL-TASK-09B | 事务完成结果 | 老人 | 由张阿姨确认完成 | [EL-TASK-09B](screens/EL-TASK-09B.png) | 16 | 控制台编号 EL-TASK-09B | `TC-COMPLETE-001`；全页实测 |
| EL-TASK-10 | 结束结果/首页有完成结果 | 老人 | 这件事已完成 | [EL-TASK-10](screens/EL-TASK-10.png) | 17 | 控制台编号 EL-TASK-10 | `TC-STATE-004`；全页实测 |
| EL-EX-01 | 必要信息缺失 | 老人 | 没有替你猜 | [EL-EX-01](screens/EL-EX-01.png) | 18 | 控制台编号 EL-EX-01 | `TC-AI-001`；全页实测 |
| EL-EX-02A | AI 解析失败 | 老人 | 原话已经保留 | [EL-EX-02A](screens/EL-EX-02A.png) | 19 | 控制台编号 EL-EX-02A | `TC-AI-002`；全页实测 |
| EL-EX-02B | 手动填写 | 老人 | 原话保留，不使用 AI | [EL-EX-02B](screens/EL-EX-02B.png) | 20 | 控制台编号 EL-EX-02B | `TC-AI-003`；全页实测 |
| EL-SHARE-01 | 是否邀请小梅 | 老人 | 个人提醒已经保存 | [EL-SHARE-01](screens/EL-SHARE-01.png) | 21 | 控制台编号 EL-SHARE-01 | `TC-MAIN-007`、`TC-SHARE-001`；全页实测 |
| EL-SHARE-01B | 只提醒自己结果 | 老人 | 没有告诉小梅 | [EL-SHARE-01B](screens/EL-SHARE-01B.png) | 22 | 控制台编号 EL-SHARE-01B | `TC-SHARE-001`；全页实测 |
| EL-SHARE-02 | 本次共享预览 | 老人 | 等待你确认共享 | [EL-SHARE-02](screens/EL-SHARE-02.png) | 23 | 控制台编号 EL-SHARE-02 | `TC-MAIN-008/009`；全页实测 |
| EL-SHARE-03 | 请求发送中 | 老人 | 还未送达 | [EL-SHARE-03](screens/EL-SHARE-03.png) | 24 | 控制台编号 EL-SHARE-03 | `TC-STATE-002`；全页实测 |
| EL-SHARE-04A | 请求发送成功 | 老人 | 等待回应 | [EL-SHARE-04A](screens/EL-SHARE-04A.png) | 25 | 控制台编号 EL-SHARE-04A | `TC-MAIN-009`；全页实测 |
| EL-SHARE-04B | 等待回应 | 老人 | 已发送，还没有答应 | [EL-SHARE-04B](screens/EL-SHARE-04B.png) | 26 | 控制台编号 EL-SHARE-04B | `TC-MAIN-009`；全页实测 |
| EL-SHARE-05 | 家属已接受 | 老人 | 已接受陪同请求 | [EL-SHARE-05](screens/EL-SHARE-05.png) | 27 | 控制台编号 EL-SHARE-05 | `TC-MAIN-011`；全页实测 |
| EL-SHARE-06 | 家属已拒绝 | 老人 | 你的事务继续 | [EL-SHARE-06](screens/EL-SHARE-06.png) | 28 | 控制台编号 EL-SHARE-06 | `TC-COLLAB-002`；全页实测 |
| EL-SHARE-07 | 改期建议 | 老人 | 由你决定是否修改 | [EL-SHARE-07](screens/EL-SHARE-07.png) | 29 | 控制台编号 EL-SHARE-07 | `TC-COLLAB-003`；全页实测 |
| EL-SHARE-08 | 接受改期/新版本待重新分享 | 老人 | 旧答复已失效；尚未重新发送 | [EL-SHARE-08](screens/EL-SHARE-08.png) | 30 | 控制台编号 EL-SHARE-08 | `TC-COLLAB-004`；全页实测 |
| EL-SHARE-09 | 拒绝改期结果 | 老人 | 仍在等待小梅回应 | [EL-SHARE-09](screens/EL-SHARE-09.png) | 31 | 控制台编号 EL-SHARE-09 | `TC-COLLAB-005`；全页实测 |
| EL-EX-03 | 请求发送失败 | 老人 | 可以重试 | [EL-EX-03](screens/EL-EX-03.png) | 32 | 控制台编号 EL-EX-03 | `TC-REQ-001`；全页实测 |
| EL-EX-04 | 家属未回应 | 老人 | 未回应不等于拒绝 | [EL-EX-04](screens/EL-EX-04.png) | 33 | 控制台编号 EL-EX-04 | `TC-REQ-002`；全页实测 |
| EL-EX-05A | 撤回请求确认 | 老人 | 只撤回协作 | [EL-EX-05A](screens/EL-EX-05A.png) | 34 | 控制台编号 EL-EX-05A | `TC-CANCEL-001`；全页实测 |
| EL-EX-05B | 撤回结果 | 老人 | 个人提醒仍然有效 | [EL-EX-05B](screens/EL-EX-05B.png) | 35 | 控制台编号 EL-EX-05B | `TC-CANCEL-001`；全页实测 |
| EL-EX-06A | 取消整个事务确认 | 老人 | 这会同时停止提醒和协作 | [EL-EX-06A](screens/EL-EX-06A.png) | 36 | 控制台编号 EL-EX-06A | `TC-CANCEL-002`；全页实测 |
| EL-EX-06B | 取消事务结果 | 老人 | 提醒和协作请求均已失效 | [EL-EX-06B](screens/EL-EX-06B.png) | 37 | 控制台编号 EL-EX-06B | `TC-CANCEL-002`；全页实测 |
| EL-EX-07A | 修改共享字段/旧请求将失效 | 老人 | 旧请求和答复不会继承 | [EL-EX-07A](screens/EL-EX-07A.png) | 38 | 控制台编号 EL-EX-07A | `TC-VERSION-001`；全页实测 |
| EL-EX-07B | 新版本重新分享 | 老人 | 旧答复已失效；尚未重新发送 | [EL-EX-07B](screens/EL-EX-07B.png) | 39 | 控制台编号 EL-EX-07B | `TC-VERSION-001/002`；全页实测 |
| EL-SET-01 | 显示设置（P1） | 老人 | 按自己的阅读习惯选择 | [EL-SET-01](screens/EL-SET-01.png) | 40 | 控制台编号 EL-SET-01 | `TC-A11Y-004`；全页实测 |
| EL-REL-01 | 首次关系介绍 | 老人 | 首次建立关系 | [EL-REL-01](screens/EL-REL-01.png) | 41 | 控制台编号 EL-REL-01 | `TC-REL-001`；全页实测 |
| FM-REL-01 | 模拟扫码并发起关系 | 家属 | 等待扫码 | [FM-REL-01](screens/FM-REL-01.png) | 42 | 控制台编号 FM-REL-01 | `TC-REL-001`；全页实测 |
| EL-REL-02 | 查看身份和权限 | 老人 | 需要你确认 | [EL-REL-02](screens/EL-REL-02.png) | 43 | 控制台编号 EL-REL-02 | `TC-REL-001/002`；全页实测 |
| EL-REL-02A | 同意建立关系确认 | 老人 | 请核对：小梅（女儿） | [EL-REL-02A](screens/EL-REL-02A.png) | 44 | 控制台编号 EL-REL-02A | `TC-REL-001`；全页实测 |
| EL-REL-03 | 拒绝关系结果 | 老人 | 仍可使用个人提醒 | [EL-REL-03](screens/EL-REL-03.png) | 45 | 控制台编号 EL-REL-03 | `TC-REL-002`；全页实测 |
| FM-REL-03 | 关系申请被拒绝 | 家属 | 没有建立关系 | [FM-REL-03](screens/FM-REL-03.png) | 46 | 控制台编号 FM-REL-03 | `TC-REL-002`；全页实测 |
| EL-REL-06 | 关系建立成功 | 老人 | 关系已确认 | [EL-REL-06](screens/EL-REL-06.png) | 47 | 控制台编号 EL-REL-06 | `TC-REL-001`；全页实测 |
| FM-REL-02 | 关系建立成功 | 家属 | 已和张阿姨建立协作 | [FM-REL-02](screens/FM-REL-02.png) | 48 | 控制台编号 FM-REL-02 | `TC-REL-001`；全页实测 |
| EL-REL-07 | 她能看到什么 | 老人 | 只有你主动分享的本次事务 | [EL-REL-07](screens/EL-REL-07.png) | 49 | 控制台编号 EL-REL-07 | `TC-PERM-001`；全页实测 |
| EL-REL-04A | 关系详情/结束确认 | 老人 | 现有陪同请求也会失效 | [EL-REL-04A](screens/EL-REL-04A.png) | 50 | 控制台编号 EL-REL-04A | `TC-REL-003`；全页实测 |
| EL-REL-05 | 关系已结束 | 老人 | 旧请求已失效 | [EL-REL-05](screens/EL-REL-05.png) | 51 | 控制台编号 EL-REL-05 | `TC-REL-003`；全页实测 |
| FM-REL-04 | 关系已结束 | 家属 | 旧请求已失效 | [FM-REL-04](screens/FM-REL-04.png) | 52 | 控制台编号 FM-REL-04 | `TC-REL-003`；全页实测 |
| FM-REQ-00 | 请求列表空状态 | 家属 | 暂时没有新请求 | [FM-REQ-00](screens/FM-REQ-00.png) | 53 | 控制台编号 FM-REQ-00 | `TC-STATE-001`；全页实测 |
| FM-REQ-01 | 请求列表有数据 | 家属 | 有 1 个待回复请求 | [FM-REQ-01](screens/FM-REQ-01.png) | 54 | 控制台编号 FM-REQ-01 | `TC-MAIN-010`；全页实测 |
| FM-REQ-02 | 请求详情 | 家属 | 等待你的回复 | [FM-REQ-02](screens/FM-REQ-02.png) | 55 | 控制台编号 FM-REQ-02 | `TC-MAIN-010`；全页实测 |
| FM-REQ-03A | 接受确认 | 家属 | 只回应当前请求 | [FM-REQ-03A](screens/FM-REQ-03A.png) | 56 | 控制台编号 FM-REQ-03A | `TC-COLLAB-001`；全页实测 |
| FM-REQ-03B | 接受结果 | 家属 | 已接受请求 | [FM-REQ-03B](screens/FM-REQ-03B.png) | 57 | 控制台编号 FM-REQ-03B | `TC-COLLAB-001`；全页实测 |
| FM-REQ-04A | 拒绝确认 | 家属 | 只回应当前请求 | [FM-REQ-04A](screens/FM-REQ-04A.png) | 58 | 控制台编号 FM-REQ-04A | `TC-COLLAB-002`；全页实测 |
| FM-REQ-04B | 拒绝结果 | 家属 | 事务仍属于张阿姨 | [FM-REQ-04B](screens/FM-REQ-04B.png) | 59 | 控制台编号 FM-REQ-04B | `TC-COLLAB-002`；全页实测 |
| FM-REQ-05A | 建议改期 | 家属 | 只回应当前请求 | [FM-REQ-05A](screens/FM-REQ-05A.png) | 60 | 控制台编号 FM-REQ-05A | `TC-COLLAB-003`；全页实测 |
| FM-REQ-05B | 建议已发送 | 家属 | 等待张阿姨决定 | [FM-REQ-05B](screens/FM-REQ-05B.png) | 61 | 控制台编号 FM-REQ-05B | `TC-COLLAB-003`；全页实测 |
| FM-EX-01 | 请求已撤回 | 家属 | 不能回应 | [FM-EX-01](screens/FM-EX-01.png) | 62 | 控制台编号 FM-EX-01 | `TC-CANCEL-001`；全页实测 |
| FM-EX-02 | 事务已取消 | 家属 | 不能回应 | [FM-EX-02](screens/FM-EX-02.png) | 63 | 控制台编号 FM-EX-02 | `TC-CANCEL-002`；全页实测 |
| FM-EX-03 | 旧请求已失效 | 家属 | 不能回应 | [FM-EX-03](screens/FM-EX-03.png) | 64 | 控制台编号 FM-EX-03 | `TC-VERSION-002`；全页实测 |
| DM-01 | 角色切换条 | 演示控制 | 还没有事务 | [DM-01](screens/DM-01.png) | 65 | 控制台编号 DM-01 | `TC-DEMO-001`；全页实测 |
| DM-02 | 场景预设面板 | 演示控制 | 评审快捷入口 | [DM-02](screens/DM-02.png) | 66 | 控制台编号 DM-02 | `TC-DEMO-002`；全页实测 |
| DM-03 | 固定演示时间 | 演示控制 | 评审快捷入口 | [DM-03](screens/DM-03.png) | 67 | 控制台编号 DM-03 | `TC-DEMO-003`；全页实测 |
| DM-04A | Reset 确认 | 演示控制 | 只清空这份浏览器中的模拟数据 | [DM-04A](screens/DM-04A.png) | 68 | 控制台编号 DM-04A | `TC-DEMO-004`；全页实测 |
| DM-04B | Reset 结果 | 演示控制 | 无关系、无事务、无请求 | [DM-04B](screens/DM-04B.png) | 69 | 控制台编号 DM-04B | `TC-DEMO-004`；全页实测 |
