# 页面与状态清单

版本1.1.0；60产品画面与5独立辅助画面。每项有编号、角色、入口、实际按钮、去向和同版原型位置。产品里不显示材料编号，/review按自然中文标题进入。邀请准备/申请等待合并在关系页面内，权限或取消确认仍独立。

| 编号 | 当前画面名称 | 角色 | 进入方式 | 主要操作 | 去向 | 原型位置 |
|---|---|---|---|---|---|---|
| EL-TASK-00 | 张阿姨，记一件事吧 | 老人 | 已登录 预设案例；无事务 | 记一件事；字太小？调整阅读方式 | EL-TASK-01；EL-SET-01 | [PNG](../../exports/screens/EL-TASK-00.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-01 | 想记什么事？ | 老人 | 点击“记一件事” | 帮我整理；用语音记事；自己填写时间和地点；返回，保留内容 | EL-TASK-02 → EL-TASK-03B；当前输入页填入原话；EL-EX-02B；EL-TASK-00/10 | [PNG](../../exports/screens/EL-TASK-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-02 | 正在帮你整理 | 老人 | 提交有效输入 | 返回，接着写 | EL-TASK-01 | [PNG](../../exports/screens/EL-TASK-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-03A | 我这样记，对吗？ | 老人 | 正常解析 预设案例 成功 | 修改时间；确认记好；返回输入 | EL-TASK-04；EL-TASK-06；EL-TASK-01 | [PNG](../../exports/screens/EL-TASK-03A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-03B | 我这样记，对吗？ | 老人 | 主演示 预设案例 解析成功 | 修改时间；改时间；返回输入 | EL-TASK-04；EL-TASK-01 | [PNG](../../exports/screens/EL-TASK-03B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-04 | 改成几点？ | 老人 | 在理解结果点击字段 | 改成上午9:00；不改了 | EL-TASK-05；EL-TASK-03B/05 | [PNG](../../exports/screens/EL-TASK-04.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-05 | 再看一遍 | 老人 | 字段已修正且齐全 | 修改时间；确认记好；返回输入 | EL-TASK-04；EL-TASK-06；EL-TASK-01 | [PNG](../../exports/screens/EL-TASK-05.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-06 | 办理公交卡年审 | 老人 | 确认保存 | 请小梅陪你去；只提醒我自己；修改时间；这件事办完了；取消这件事 | EL-SHARE-01；当前页；EL-TASK-08；EL-TASK-09A；EL-EX-06A | [PNG](../../exports/screens/EL-TASK-06.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-07 | 该准备出发了 | 老人 | Demo 时钟到 08:30；事务仍 `SAVED` | 知道了，看看这件事 | EL-TASK-06 | [PNG](../../exports/screens/EL-TASK-07.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-08 | 要改时间吗？ | 老人 | 已有请求且点击修改 | 继续修改；先不修改 | EL-EX-07A；EL-TASK-06 | [PNG](../../exports/screens/EL-TASK-08.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-09A | 这件事办完了吗？ | 老人 | 事务 `SAVED` | 已经办完了；还没有，返回这件事 | EL-TASK-09B；EL-TASK-06 | [PNG](../../exports/screens/EL-TASK-09A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-09B | 这件事办完了 | 老人 | 老人确认完成 | 回到首页 | EL-TASK-00/10 | [PNG](../../exports/screens/EL-TASK-09B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-TASK-10 | 这件事办完了 | 老人 | 事务终结 | <span class="secondary-text">已经办完</span><strong>办理公交卡年审</strong><span>上午 9:00 · 社区服务中心</span><span class="entry-link">查看这件事 →</span>；记一件事；字太小？调整阅读方式 | EL-TASK-06；EL-TASK-01；EL-SET-01 | [PNG](../../exports/screens/EL-TASK-10.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-01 | 还需要时间和地点 | 老人 | 解析缺少必要字段 | 填写时间和地点；返回输入 | EL-EX-02B；EL-TASK-01 | [PNG](../../exports/screens/EL-EX-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-02A | 这次没整理好 | 老人 | 失败场景 预设案例 | 自己填写时间和地点；再试一次；返回，接着写 | EL-EX-02B；EL-TASK-02；EL-TASK-01 | [PNG](../../exports/screens/EL-EX-02A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-02B | 把这件事写下来 | 老人 | 选择手动填写或补字段 | 填好了，再看看；返回原话 | EL-TASK-05；EL-TASK-01 | [PNG](../../exports/screens/EL-EX-02B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-01 | 要请小梅陪你去吗？ | 老人 | 个人事务已保存 | 看看要告诉小梅的内容；只提醒我自己；返回这件事 | EL-SHARE-02；当前页；EL-TASK-06 | [PNG](../../exports/screens/EL-SHARE-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-01B | 只提醒你自己 | 老人 | 选择不共享 | 回到这件事 | EL-TASK-06 | [PNG](../../exports/screens/EL-SHARE-01B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-02 | 发给小梅前，再看看 | 老人 | 选择请求小梅 | 就把这些发给小梅；先不发送；她能看到什么？ | EL-SHARE-03 → EL-SHARE-04A；EL-TASK-06；EL-REL-07 | [PNG](../../exports/screens/EL-SHARE-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-03 | 正在发给小梅 | 老人 | 明确确认发送 | 先不发送，返回看看 | EL-SHARE-02 | [PNG](../../exports/screens/EL-SHARE-03.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-04A | 已经发给小梅 | 老人 | 发送 adapter 成功 | 看看回复；回到这件事；撤回陪同请求 | EL-SHARE-04B；EL-TASK-06；EL-EX-05A | [PNG](../../exports/screens/EL-SHARE-04A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-04B | 等小梅回复 | 老人 | 请求已成功送达且暂无答复 | 回到这件事；撤回陪同请求 | EL-TASK-06；EL-EX-05A | [PNG](../../exports/screens/EL-SHARE-04B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-05 | 小梅可以陪你去 | 老人 | 小梅接受有效请求 | 回到这件事；修改时间 | EL-TASK-06；EL-TASK-08 | [PNG](../../exports/screens/EL-SHARE-05.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-06 | 小梅这次不能陪你 | 老人 | 小梅拒绝 | 回到这件事 | EL-TASK-06 | [PNG](../../exports/screens/EL-SHARE-06.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-07 | 小梅想下午2:00去 | 老人 | 小梅建议 14:00 | 同意，改到下午2:00；仍按上午 9:00 | EL-SHARE-08；EL-SHARE-09 | [PNG](../../exports/screens/EL-SHARE-07.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-08 | 已改到下午2:00 | 老人 | 接受建议 | 看看内容，再问小梅；先保留自己的安排 | EL-SHARE-02；EL-TASK-06 | [PNG](../../exports/screens/EL-SHARE-08.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SHARE-09 | 仍按原来的时间 | 老人 | 坚持 9:00 | 继续等小梅；撤回陪同请求 | EL-SHARE-04A；EL-EX-05A | [PNG](../../exports/screens/EL-SHARE-09.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-03 | 没有发给小梅 | 老人 | 发送 adapter 失败 | 重新发送；先不发送 | EL-SHARE-03 → EL-SHARE-04A；EL-TASK-06 | [PNG](../../exports/screens/EL-EX-03.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-04 | 小梅还没有回复 | 老人 | `PENDING` 超过演示期限 | 再等一等；撤回陪同请求 | EL-SHARE-04A；EL-EX-05A | [PNG](../../exports/screens/EL-EX-04.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-05A | 不需要小梅陪了吗？ | 老人 | 请求仍可撤回 | 确认撤回陪同；继续等小梅 | EL-EX-05B；EL-SHARE-04A | [PNG](../../exports/screens/EL-EX-05A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-05B | 陪同请求已撤回 | 老人 | 确认撤回 | 回到这件事 | EL-TASK-06 | [PNG](../../exports/screens/EL-EX-05B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-06A | 要取消这件事吗？ | 老人 | 事务 `SAVED` | 确认取消这件事；继续保留 | EL-EX-06B；来源事务/协作页 | [PNG](../../exports/screens/EL-EX-06A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-06B | 这件事已取消 | 老人 | 确认取消 | 回到首页 | EL-TASK-00/10 | [PNG](../../exports/screens/EL-EX-06B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-07A | 改到下午2:00？ | 老人 | 从 `EL-TASK-08` 继续 | 确认改时间；先不修改 | EL-EX-07B；EL-TASK-06 | [PNG](../../exports/screens/EL-EX-07A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-EX-07B | 已改到下午2:00 | 老人 | 新版本已保存，旧请求 `INVALIDATED` | 看看内容，再问小梅；先保留自己的安排 | EL-SHARE-02；EL-TASK-06 | [PNG](../../exports/screens/EL-EX-07B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-SET-01 | 看得更清楚 | 老人 | P1 功能已启用 | 字再大一些；颜色更清楚；恢复通常的显示；回到首页 | 当前页大字；当前页提高对比；当前页恢复显示；EL-TASK-00/10 | [PNG](../../exports/screens/EL-SET-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-01 | 和小梅一起记挂 | 老人 | 尚无关系，进入家庭协作 | 邀请小梅；以后再说 | EL-REL-01中的邀请等待状态；EL-TASK-00/10 | [PNG](../../exports/screens/EL-REL-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REL-01 | 和妈妈建立协作 | 家属 | 老人已发出邀请 | 向妈妈申请；回到消息 | FM-REL-01中的申请等待状态 → EL-REL-02；FM-REQ-00/01 | [PNG](../../exports/screens/FM-REL-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-02 | 小梅想与你建立协作 | 老人 | 小梅已发起申请 | 是小梅，同意建立；这次先不同意；她能看到什么？ | EL-REL-02A；EL-REL-03；EL-REL-07 | [PNG](../../exports/screens/EL-REL-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-02A | 同意和小梅协作吗？ | 老人 | 在身份和权限页点击同意 | 确认同意；返回 | EL-REL-06；EL-REL-01/02/06或FM-REL-01/02 | [PNG](../../exports/screens/EL-REL-02A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-03 | 这次先不建立协作 | 老人 | 点击暂不同意 | 回到首页 | EL-TASK-00/10 | [PNG](../../exports/screens/EL-REL-03.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REL-03 | 妈妈这次先不同意 | 家属 | 老人拒绝 | 返回 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-REL-03.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-06 | 小梅 · 女儿 | 老人 | 老人同意 | 回到事情；她能看到什么？；结束家庭协作 | EL-TASK-00/10；EL-REL-07；EL-REL-04A | [PNG](../../exports/screens/EL-REL-06.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REL-02 | 妈妈 · 张阿姨 | 家属 | 老人同意 | 查看消息；结束家庭协作 | FM-REQ-00/01；EL-REL-04A | [PNG](../../exports/screens/FM-REL-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-07 | 她能看到什么？ | 老人 | 关系或共享说明入口 | 知道了 | 返回来源页 | [PNG](../../exports/screens/EL-REL-07.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-04A | 结束和小梅的协作？ | 老人 | 关系 `ACTIVE` | 确认结束协作；继续保留协作 | EL-REL-05/FM-REL-04；EL-REL-01/02/06或FM-REL-01/02 | [PNG](../../exports/screens/EL-REL-04A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| EL-REL-05 | 家庭协作已结束 | 老人 | 确认结束 | 回到首页 | EL-TASK-00/10 | [PNG](../../exports/screens/EL-REL-05.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REL-04 | 家庭协作已结束 | 家属 | 任一方结束关系 | 回到首页 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-REL-04.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-00 | 妈妈的消息 | 家属 | 关系未建立、刚建立或没有有效请求 | 看看家庭协作 | EL-REL-01/02/06或FM-REL-01/02 | [PNG](../../exports/screens/FM-REQ-00.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-01 | 妈妈的消息 | 家属 | 有 `PENDING` 请求 | <span class="secondary-text">等你回复</span><strong>办理公交卡年审</strong><span>10月7日 上午 9:00</span><span>社区服务中心</span><span class="entry-link">查看消息 →</span> | FM-REQ-02/EX-01/02/03 | [PNG](../../exports/screens/FM-REQ-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-02 | 妈妈想请你陪她去 | 家属 | 打开当前有效请求 | 我可以陪你；这次不能陪同；建议下午2:00去；返回消息 | FM-REQ-03A；FM-REQ-04A；FM-REQ-05A；FM-REQ-00/01 | [PNG](../../exports/screens/FM-REQ-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-03A | 确认可以陪妈妈？ | 家属 | 点击接受 | 确认可以陪；先不发送 | FM-REQ-03B；FM-REQ-02/EX-01/02/03 | [PNG](../../exports/screens/FM-REQ-03A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-03B | 已告诉妈妈你可以陪同 | 家属 | 确认接受 | 回到消息 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-REQ-03B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-04A | 这次不能陪妈妈？ | 家属 | 点击拒绝 | 确认不能陪；先不发送 | FM-REQ-04B；FM-REQ-02/EX-01/02/03 | [PNG](../../exports/screens/FM-REQ-04A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-04B | 已告诉妈妈这次不能陪同 | 家属 | 确认拒绝 | 回到消息 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-REQ-04B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-05A | 建议下午2:00去？ | 家属 | 点击建议改期 | 把建议告诉妈妈；先不发送 | FM-REQ-05B；FM-REQ-02/EX-01/02/03 | [PNG](../../exports/screens/FM-REQ-05A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-REQ-05B | 已把建议告诉妈妈 | 家属 | 提交建议 | 回到消息 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-REQ-05B.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-EX-01 | 妈妈不用你陪同了 | 家属 | 老人撤回 | 回到消息 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-EX-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-EX-02 | 妈妈取消了这件事 | 家属 | 老人取消整个事务 | 回到消息 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-EX-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| FM-EX-03 | 之前的安排更新了 | 家属 | 事务版本变化或关系结束 | 回到消息 | FM-REQ-00/01 | [PNG](../../exports/screens/FM-EX-03.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| DM-01 | 当前身份 | 评审辅助 | /review对应工具区域 | 切换角色 | 对应角色同一业务状态 | [PNG](../../exports/screens/DM-01.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| DM-02 | 快速查看 | 评审辅助 | /review对应工具区域 | 快速查看 | 场景起始页面 | [PNG](../../exports/screens/DM-02.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| DM-03 | 演示时间 | 评审辅助 | /review对应工具区域 | 推进时间；恢复时间 | 相关提醒/未回应页面 | [PNG](../../exports/screens/DM-03.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| DM-04A | 恢复初始状态确认 | 评审辅助 | /review对应工具区域 | 确认恢复；返回 | `DM-04B` 或原页 | [PNG](../../exports/screens/DM-04A.png)；[索引/PDF页码](../../exports/prototype-index.md) |
| DM-04B | 恢复初始状态结果 | 评审辅助 | /review对应工具区域 | 开始演示 | `EL-REL-01` | [PNG](../../exports/screens/DM-04B.png)；[索引/PDF页码](../../exports/prototype-index.md) |

所有主流程、改期、取消、失败与多角色操作均实测，证据见../validation/walkthrough.md。静态工具截图只截独立面板相应区域；60产品图不包含辅助工具。没有历史/聊天等空导航。
